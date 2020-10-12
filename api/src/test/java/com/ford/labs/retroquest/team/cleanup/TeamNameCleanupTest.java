package com.ford.labs.retroquest.team.cleanup;

import com.ford.labs.retroquest.actionitem.ActionItem;
import com.ford.labs.retroquest.actionitem.ActionItemRepository;
import com.ford.labs.retroquest.board.Board;
import com.ford.labs.retroquest.board.BoardRepository;
import com.ford.labs.retroquest.columntitle.ColumnTitle;
import com.ford.labs.retroquest.columntitle.ColumnTitleRepository;
import com.ford.labs.retroquest.feedback.Feedback;
import com.ford.labs.retroquest.feedback.FeedbackRepository;
import com.ford.labs.retroquest.team.Team;
import com.ford.labs.retroquest.team.TeamRepository;
import com.ford.labs.retroquest.team.TeamService;
import com.ford.labs.retroquest.thought.Thought;
import com.ford.labs.retroquest.thought.ThoughtRepository;
import com.ford.labs.retroquest.users.UserTeamMapping;
import com.ford.labs.retroquest.users.UserTeamMappingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.util.ReflectionTestUtils;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static java.util.Collections.disjoint;
import static java.util.Collections.emptyList;
import static java.util.Comparator.comparing;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
properties = { "com.retroquest.runTeamCleanupJob=true"})
class TeamNameCleanupTest {

    @Autowired
    private TeamNameCleanup teamNameCleanup;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private ThoughtRepository thoughtRepository;

    @Autowired
    private ColumnTitleRepository columnTitleRepository;

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private ActionItemRepository actionItemRepository;

    @Autowired
    private UserTeamMappingRepository userTeamMappingRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private TeamService teamService;


    @Mock
    private ApplicationReadyEvent applicationReadyEvent;

    private final List<Team> teamsToFix = new ArrayList<>();

    private final List<Team> teamsToKeep = new ArrayList<>();

    private final Map<Team, Team> teamsToDeleteToReplacement = new HashMap<>();

    private final Map<Team, Map<String, ColumnTitle>> teamsToTopicsToColumnTitles = new HashMap<>();

    private final Map<Team, Map<String, List<Thought>>> teamsToTopicsToThoughts = new HashMap<>();

    private final Map<Team, List<Board>> teamsToBoards = new HashMap<>();

    private final Map<Team, List<ActionItem>> teamsToActionItems = new HashMap<>();

    private final Map<Team, List<Feedback>> teamsToFeedback = new HashMap<>();


    @BeforeEach
    public void setup() {
        teamsToFix.clear();
        teamsToKeep.clear();
        teamsToDeleteToReplacement.clear();
        teamsToTopicsToColumnTitles.clear();
        teamsToTopicsToThoughts.clear();
        teamsToBoards.clear();
        teamsToActionItems.clear();
        teamsToFeedback.clear();

        feedbackRepository.deleteAll();
        userTeamMappingRepository.deleteAll();
        actionItemRepository.deleteAll();
        boardRepository.deleteAll();
        thoughtRepository.deleteAll();
        columnTitleRepository.deleteAll();
        teamRepository.deleteAll();

        createConflictingTeamNames();
        ReflectionTestUtils.setField(teamNameCleanup, "runCleanupJob", true);
    }

    @Test
    public void canDetectConflictingTeams() {
        Set<CanonicalTeamNameAndCount> actual = teamRepository.findAllTeamsWithConflictingCanonicalNames();
        Set<CanonicalTeamNameAndCount> expected = teamsToFix.stream()
                .map(t -> new CanonicalTeamNameAndCount(t.getName().trim().toUpperCase(), 2L))
                .collect(Collectors.toSet());
        assertThat(actual).isEqualTo(expected);
    }

    @Test
    public void theTeamWithTheLeastRecentThoughtIsDeleted() {
        teamNameCleanup.onApplicationEvent(applicationReadyEvent);
        assertThat(teamRepository.findAllTeamsWithConflictingCanonicalNames().size()).isEqualTo(0);
        List<Team> existingTeams = teamRepository.findAll();
        assertThat(existingTeams).isEqualTo(teamsToKeep);
        assertThat(disjoint(existingTeams, teamsToDeleteToReplacement.keySet())).isTrue();
    }

    @Test
    public void thoughtsWithBoardsArePointedToNewTeamAndColumnsOnNewTeam_andThoughtsWithoutBoardsAreDeleted() {
        teamNameCleanup.onApplicationEvent(applicationReadyEvent);
        List<Thought> expectedThoughts = getExpectedThoughts();

        List<Thought> actualThoughts = thoughtRepository.findAll();
        assertThat(actualThoughts).containsAll(expectedThoughts);
        assertThat(actualThoughts.size()).isEqualTo(expectedThoughts.size());
    }

    @Test
    public void columnTitlesAreDeletedAlongWithTeams() {
        teamNameCleanup.onApplicationEvent(applicationReadyEvent);

        List<ColumnTitle> expectedColumnTitles = new ArrayList<>();
        for (Team t : teamsToKeep) {
            expectedColumnTitles.addAll(teamsToTopicsToColumnTitles.get(t).values());
        }

        List<ColumnTitle> actualColumnTitles = columnTitleRepository.findAll();
        assertThat(actualColumnTitles).containsAll(expectedColumnTitles);
        assertThat(actualColumnTitles.size()).isEqualTo(expectedColumnTitles.size());
    }

    @Test
    public void boardsArePointedToNewTeam() {
        teamNameCleanup.onApplicationEvent(applicationReadyEvent);

        List<Board> expectedBoards = new ArrayList<>();
        for (Team team : teamsToKeep) {
            expectedBoards.addAll(teamsToBoards.get(team));
        }

        List<Thought> expectedThoughts = getExpectedThoughts();
        for (Team oldTeam : teamsToDeleteToReplacement.keySet()) {
            Team newTeam = teamsToDeleteToReplacement.get(oldTeam);
            for (Board oldBoard : teamsToBoards.get(oldTeam)) {
                Board newBoard = oldBoard.toBuilder()
                        .teamId(newTeam.getId())
                        .thoughts(new ArrayList<>())
                        .build();
                for (Thought oldThought : oldBoard.getThoughts()) {
                    Thought expectedThought = expectedThoughts.stream()
                            .filter(t -> t.getId().equals(oldThought.getId()))
                            .findFirst().orElseThrow();
                    newBoard.getThoughts().add(expectedThought);
                }
                expectedBoards.add(newBoard);
            }
        }
        List<Board> actualBoards = boardRepository.findAll();
        actualBoards.sort(comparing(Board::getId));
        expectedBoards.sort(comparing(Board::getId));

        assertThat(expectedBoards).containsAll(actualBoards);
        assertThat(expectedBoards.size()).isEqualTo(actualBoards.size());
    }

    @Test
    public void actionItemsAreDeletedAlongWithTeams() {
        teamNameCleanup.onApplicationEvent(applicationReadyEvent);

        List<ActionItem> expectedActionItems = new ArrayList<>();
        for (Team team : teamsToKeep) {
            expectedActionItems.addAll(teamsToActionItems.get(team));
        }

        List<ActionItem> actualActionItems = actionItemRepository.findAll();
        actualActionItems.sort(comparing(ActionItem::getId));
        expectedActionItems.sort(comparing(ActionItem::getId));
        assertThat(actualActionItems).isEqualTo(expectedActionItems);
    }

    @Test
    public void userTeamMappingsAreRepointedToNewTeamWhenNoConflicts() {

        Map<Team, List<UserTeamMapping>> existingUserTeamMappings = new HashMap<>();
        teamsToDeleteToReplacement.keySet().forEach(oldTeam -> {
            existingUserTeamMappings.put(oldTeam, new ArrayList<>());
            existingUserTeamMappings.get(oldTeam)
                    .add(userTeamMappingRepository.save(new UserTeamMapping(0L, 0L, oldTeam.getUri())));
            existingUserTeamMappings.get(oldTeam)
                    .add(userTeamMappingRepository.save(new UserTeamMapping(0L, 1L, oldTeam.getUri())));
            existingUserTeamMappings.get(oldTeam)
                    .add(userTeamMappingRepository.save(new UserTeamMapping(0L, 2L, oldTeam.getUri())));
        });

        teamNameCleanup.onApplicationEvent(applicationReadyEvent);

        List<UserTeamMapping> expectedUserTeamMappings = new ArrayList<>();
        for (Team oldTeam : teamsToDeleteToReplacement.keySet()) {
            Team newTeam = teamsToDeleteToReplacement.get(oldTeam);
            for (UserTeamMapping oldMapping : existingUserTeamMappings.get(oldTeam)) {
                UserTeamMapping newMapping = oldMapping.toBuilder().teamUri(newTeam.getUri()).build();
                expectedUserTeamMappings.add(newMapping);
            }
        }

        List<UserTeamMapping> actualUserTeamMappings = userTeamMappingRepository.findAll();
        actualUserTeamMappings.sort(comparing(UserTeamMapping::getId));
        expectedUserTeamMappings.sort(comparing(UserTeamMapping::getId));
        assertThat(actualUserTeamMappings).isEqualTo(expectedUserTeamMappings);
    }

    @Test
    public void userTeamMappingsAreDeletedWhenConflicts() {

        Map<Team, List<UserTeamMapping>> existingUserTeamMappings = new HashMap<>();
        List<UserTeamMapping> expectedUserTeamMappings = new ArrayList<>();
        teamsToKeep.forEach(newTeam -> {
            existingUserTeamMappings.put(newTeam, new ArrayList<>());
            existingUserTeamMappings.get(newTeam)
                    .add(userTeamMappingRepository.save(new UserTeamMapping(0L, 0L, newTeam.getUri())));
            existingUserTeamMappings.get(newTeam)
                    .add(userTeamMappingRepository.save(new UserTeamMapping(0L, 1L, newTeam.getUri())));
            existingUserTeamMappings.get(newTeam)
                    .add(userTeamMappingRepository.save(new UserTeamMapping(0L, 2L, newTeam.getUri())));
            expectedUserTeamMappings.addAll(existingUserTeamMappings.get(newTeam));
        });


        teamsToDeleteToReplacement.keySet().forEach(oldTeam -> {
            existingUserTeamMappings.put(oldTeam, new ArrayList<>());
            existingUserTeamMappings.get(oldTeam)
                    .add(userTeamMappingRepository.save(new UserTeamMapping(0L, 0L, oldTeam.getUri())));
            existingUserTeamMappings.get(oldTeam)
                    .add(userTeamMappingRepository.save(new UserTeamMapping(0L, 1L, oldTeam.getUri())));
            existingUserTeamMappings.get(oldTeam)
                    .add(userTeamMappingRepository.save(new UserTeamMapping(0L, 2L, oldTeam.getUri())));
        });

        teamNameCleanup.onApplicationEvent(applicationReadyEvent);

        List<UserTeamMapping> actualUserTeamMappings = userTeamMappingRepository.findAll();
        actualUserTeamMappings.sort(comparing(UserTeamMapping::getId));
        expectedUserTeamMappings.sort(comparing(UserTeamMapping::getId));
        assertThat(actualUserTeamMappings).isEqualTo(expectedUserTeamMappings);
    }

    @Test
    public void feedbackIsPointedToNewTeam() {
        teamNameCleanup.onApplicationEvent(applicationReadyEvent);

        List<Feedback> expectedFeedback = new ArrayList<>();
        for (Team team : teamsToKeep) {
            expectedFeedback.addAll(teamsToFeedback.get(team));
        }
        for (Team oldTeam : teamsToDeleteToReplacement.keySet()) {
            Team newTeam = teamsToDeleteToReplacement.get(oldTeam);
            for (Feedback oldFeedback : teamsToFeedback.get(oldTeam)) {
                Feedback newFeedback = oldFeedback.toBuilder().teamId(newTeam.getId()).build();
                expectedFeedback.add(newFeedback);
            }
        }

        List<Feedback> actualFeedback = feedbackRepository.findAll();
        actualFeedback.sort(comparing(Feedback::getId));
        expectedFeedback.sort(comparing(Feedback::getId));
        assertThat(actualFeedback).isEqualTo(expectedFeedback);
    }

    @Test
    public void teamNamesRemoveExtraSpaces() {
        createTeamToKeep(new Team("name-with-trailing", "nameWithTrailing    ", "Password1"));
        createTeamToKeep(new Team("name-with-leading", "   nameWithLeading", "Password1"));
        createTeamToKeep(new Team("name-with-extras", "  name   with   extras  ", "Password1"));
        teamNameCleanup.onApplicationEvent(applicationReadyEvent);

        List<Team> expectedTeams = teamsToKeep.stream()
                .map(t -> t.toBuilder().name(t.getName().trim()).build())
                .collect(Collectors.toList());
        List<Team> actualTeams = teamRepository.findAll();
        actualTeams.sort(comparing(Team::getUri));
        expectedTeams.sort(comparing(Team::getUri));
        assertThat(actualTeams).isEqualTo(expectedTeams);
    }

    @Test
    public void doesNothingIfPropertyIsNotSet() {
        ReflectionTestUtils.setField(teamNameCleanup, "runCleanupJob", false);
        teamNameCleanup.onApplicationEvent(applicationReadyEvent);
        assertThat(teamRepository.findAllTeamsWithConflictingCanonicalNames().size()).isNotEqualTo(0);
        List<Team> existingTeams = teamRepository.findAll();
        assertThat(existingTeams).containsAll(teamsToKeep);
        assertThat(existingTeams).containsAll(teamsToDeleteToReplacement.keySet());
    }

    private void createConflictingTeamNames() {
        Team teamToDelete, teamToKeep;
        teamToDelete = createTeamToDelete(new Team("name0-", "name0 ", "Password1"));
        teamToKeep = createTeamToKeep(new Team("name0", "name0", "Password1"));
        teamsToDeleteToReplacement.put(teamToDelete, teamToKeep);

        teamToDelete = createTeamToDelete(new Team("-name1", "name1 ", "Password1"));
        teamToKeep = createTeamToKeep(new Team("name1", "name1", "Password1"));
        teamsToDeleteToReplacement.put(teamToDelete, teamToKeep);

        teamToDelete = createTeamToDelete(new Team("name2", "name2 ", "Password1"));
        teamToKeep = createTeamToKeep(new Team("someonechangedthedb", "name2", "Password1"));
        teamsToDeleteToReplacement.put(teamToDelete, teamToKeep);

        teamToDelete = createTeamToDelete(new Team("mixedcase", "mixed case", "Password1"));
        teamToKeep = createTeamToKeep(new Team("mixed-case", "Mixed Case", "Password1"));
        teamsToDeleteToReplacement.put(teamToDelete, teamToKeep);
    }

    private Team createTeam(Team team, boolean mustHaveThoughts) {
        Team savedTeam = teamRepository.save(team);
        teamsToFix.add(team);

        createColumnTitles(savedTeam);
        createSomeThoughts(savedTeam, null, mustHaveThoughts);
        createSomeBoards(savedTeam);
        createSomeActionItems(savedTeam);
        createSomeFeedback(savedTeam);
        return savedTeam;
    }

    private void createColumnTitles(Team team) {
        teamsToTopicsToColumnTitles.put(team, new HashMap<>());
        teamsToTopicsToThoughts.put(team, new HashMap<>());
        List<ColumnTitle> columnTitles = teamService.generateColumns(team);
        for (ColumnTitle columnTitle : columnTitles) {
            teamsToTopicsToColumnTitles.get(team).put(columnTitle.getTopic(), columnTitle);
            teamsToTopicsToThoughts.get(team).put(columnTitle.getTopic(), new ArrayList<>());
        }
    }

    private Team createTeamToKeep(Team team) {
        Team savedTeam = createTeam(team, true);
        teamsToKeep.add(savedTeam);
        return savedTeam;
    }

    private Team createTeamToDelete(Team team) {
        return createTeam(team, false);
    }

    private List<Thought> createSomeThoughts(Team team, Long boardId, boolean atLeastOne) {
        Random rand = new Random();
        int minThoughts = atLeastOne ? 1 : 0;
        List<Thought> createdThoughts = new ArrayList<>();
        teamsToTopicsToColumnTitles.get(team)
                .values()
                .forEach(columnTitle -> {
                    for (int i = 0; i < (rand.nextInt(3) + minThoughts); i++) {
                        Thought thought = new Thought(0L, "test " + columnTitle.getTopic(), 0, columnTitle.getTopic(), false, team.getId(), columnTitle, boardId);
                        Thought savedThought = thoughtRepository.save(thought);
                        teamsToTopicsToThoughts.get(team).get(columnTitle.getTopic()).add(savedThought);
                        createdThoughts.add(savedThought);
                    }
                });
        return createdThoughts;
    }

    private void createSomeBoards(Team team) {
        teamsToBoards.put(team, new ArrayList<>());
        Random rand = new Random();
        for (int i = 0; i < rand.nextInt(3); i++) {
            Board board = new Board(0L, team.getId(), LocalDate.now(), emptyList());
            Board savedBoard = boardRepository.save(board);
            savedBoard.setThoughts(createSomeThoughts(team, savedBoard.getId(), false));
            teamsToBoards.get(team).add(savedBoard);
        }
    }

    private void createSomeActionItems(Team team) {
        Random rand = new Random();
        teamsToActionItems.put(team, new ArrayList<>());
        for (int i = 0; i < rand.nextInt(3); i++) {
            ActionItem actionItem = new ActionItem(0L, "some task", false, team.getId(), "Someone", new Date(0L), false);
            teamsToActionItems.get(team).add(actionItemRepository.save(actionItem));
        }
    }

    private void createSomeFeedback(Team team) {
        Random rand = new Random();
        teamsToFeedback.put(team, new ArrayList<>());
        for (int i = 0; i < rand.nextInt(3); i++) {
            Feedback feedback = new Feedback(0L, 0, "comment", null, team.getId(), LocalDateTime.now());
            teamsToFeedback.get(team).add(feedbackRepository.save(feedback));
        }
    }

    private List<Thought> getExpectedThoughts() {
        List<Thought> expectedThoughts = new ArrayList<>();

        for (Team team : teamsToKeep) {
            for (List<Thought> thoughts : teamsToTopicsToThoughts.get(team).values()) {
                expectedThoughts.addAll(thoughts);
            }
        }

        for (Team oldTeam : teamsToDeleteToReplacement.keySet()) {
            Team newTeam = teamsToDeleteToReplacement.get(oldTeam);
            for (List<Thought> oldThoughts : teamsToTopicsToThoughts.get(oldTeam).values()) {
                for (Thought oldThought : oldThoughts) {
                    if (oldThought.getBoardId() != null && oldThought.getBoardId() != 0) {
                        Thought newThought = oldThought.toBuilder()
                                .teamId(newTeam.getId())
                                .columnTitle(teamsToTopicsToColumnTitles.get(newTeam).get(oldThought.getTopic()))
                                .build();
                        expectedThoughts.add(newThought);
                    }
                }
            }
        }
        return expectedThoughts;
    }


}