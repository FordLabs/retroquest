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
import com.ford.labs.retroquest.thought.Thought;
import com.ford.labs.retroquest.thought.ThoughtRepository;
import com.ford.labs.retroquest.users.UserTeamMapping;
import com.ford.labs.retroquest.users.UserTeamMappingRepository;
import lombok.extern.java.Log;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Set;

import static java.util.stream.Collectors.toMap;

/**
 * There is a problem in the database.
 * Multiple teams exist with the same Team Name.
 * <p>
 * This is meant to be a one-time startup job to address that.  It combines the data from
 * multiple teams
 * <p>
 * It uses the most recent board name or retro to determine the winner for passwords
 * and URIs
 * <p>
 * Moving forward, the Team service should prevent these kinds of collisions
 */
@Log
@Component
public class TeamNameCleanup implements ApplicationListener<ApplicationReadyEvent> {
    private final TeamRepository teamRepository;
    private final ThoughtRepository thoughtRepository;
    private final ColumnTitleRepository columnTitleRepository;
    private final BoardRepository boardRepository;
    private final ActionItemRepository actionItemRepository;
    private final UserTeamMappingRepository userTeamMappingRepository;
    private final FeedbackRepository feedbackRepository;

    public TeamNameCleanup(TeamRepository teamRepository,
                           ThoughtRepository thoughtRepository,
                           ColumnTitleRepository columnTitleRepository,
                           BoardRepository boardRepository,
                           ActionItemRepository actionItemRepository,
                           UserTeamMappingRepository userTeamMappingRepository,
                           FeedbackRepository feedbackRepository) {
        this.teamRepository = teamRepository;
        this.thoughtRepository = thoughtRepository;
        this.columnTitleRepository = columnTitleRepository;
        this.boardRepository = boardRepository;
        this.actionItemRepository = actionItemRepository;
        this.userTeamMappingRepository = userTeamMappingRepository;
        this.feedbackRepository = feedbackRepository;
    }

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        fixConflictingTeamNames();
    }

    private void fixConflictingTeamNames() {
        Set<CanonicalTeamNameAndCount> conflictTeams = teamRepository.findAllTeamsWithConflictingCanonicalNames();
        conflictTeams.forEach(this::resolveTeamNameConflict);
    }

    private void resolveTeamNameConflict(CanonicalTeamNameAndCount teamNameRecord) {
        List<Team> teams = teamRepository.findAllTeamsByNameWithTrimmingAndIgnoreCase(teamNameRecord.getName());
        Team teamToKeep = getTeamToKeep(teams);
        deleteDuplicateTeams(teams, teamToKeep);
    }

    private void deleteDuplicateTeams(List<Team> teams, Team teamToKeep) {
        teams.stream()
                .filter(t -> !t.getId().equals(teamToKeep.getId()))
                .forEach(t -> deleteTeam(t, teamToKeep));
    }

    private void deleteTeam(Team oldTeam, Team newTeam) {
        moveThoughtsToNewTeam(oldTeam, newTeam);
        deleteColumnTitles(oldTeam);
        moveBoardsToNewTeam(oldTeam, newTeam);
        moveActionItemsToNewTeam(oldTeam, newTeam);
        moveUserTeamMappingsToNewTeam(oldTeam, newTeam);
        moveFeedbackToNewTeam(oldTeam, newTeam);
        teamRepository.delete(oldTeam);
    }


    private Team getTeamToKeep(List<Team> teams) {
        Team maxTeam = teams.get(0);
        Long maxId = 0L;

        for (Team t : teams) {
            Long maxIdForTeam = thoughtRepository.getMaxIdByTeamId(t.getId()).orElse(0L);
            if (maxIdForTeam > maxId) {
                maxId = maxIdForTeam;
                maxTeam = t;
            }
        }
        return maxTeam;
    }

    private void moveThoughtsToNewTeam(Team oldTeam, Team newTeam) {
        List<ColumnTitle> columnTitles = columnTitleRepository.findAllByTeamId(newTeam.getId());
        Map<String, ColumnTitle> topicsToNewTitles = columnTitles.stream()
                .collect(toMap(ColumnTitle::getTopic, columnTitle -> columnTitle));

        List<Thought> oldThoughts = thoughtRepository.findAllByTeamId(oldTeam.getId());
        for (Thought oldThought : oldThoughts) {
            Thought newThought = oldThought.toBuilder()
                    .teamId(newTeam.getId())
                    .columnTitle(topicsToNewTitles.get(oldThought.getTopic()))
                    .build();
            thoughtRepository.save(newThought);
        }
    }

    private void deleteColumnTitles(Team oldTeam) {
        List<ColumnTitle> columnTitles = columnTitleRepository.findAllByTeamId(oldTeam.getId());
        columnTitles.forEach(ct -> columnTitleRepository.delete(ct));
    }

    private void moveBoardsToNewTeam(Team oldTeam, Team newTeam) {
        List<Board> boards = boardRepository.findAllByTeamId(oldTeam.getId());
        boards.forEach(oldBoard -> {
            Board newBoard = oldBoard.toBuilder().teamId(newTeam.getId()).build();
            boardRepository.save(newBoard);
        });
    }

    private void moveActionItemsToNewTeam(Team oldTeam, Team newTeam) {
        List<ActionItem> actionItems = actionItemRepository.findAllByTeamId(oldTeam.getId());
        actionItems.forEach(oldActionItem -> {
            ActionItem newActionItem = oldActionItem.toBuilder().teamId(newTeam.getId()).build();
            actionItemRepository.save(newActionItem);
        });
    }

    private void moveFeedbackToNewTeam(Team oldTeam, Team newTeam) {
        List<Feedback> feedback = feedbackRepository.findAllByTeamId(oldTeam.getId());
        feedback.forEach(oldFeedback -> {
            Feedback newFeedback = oldFeedback.toBuilder().teamId(newTeam.getId()).build();
            feedbackRepository.save(newFeedback);
        });
    }

    private void moveUserTeamMappingsToNewTeam(Team oldTeam, Team newTeam) {
        List<UserTeamMapping> userTeamMappings = userTeamMappingRepository.findAllByTeamUri(oldTeam.getUri());
        userTeamMappings.forEach(oldUserTeamMapping -> {
            if (userTeamMappingRepository.findAllByTeamUriAndUserId(newTeam.getUri(), oldUserTeamMapping.getUserId()).size() == 0) {
                UserTeamMapping newUserTeamMapping = oldUserTeamMapping.toBuilder().teamUri(newTeam.getUri()).build();
                userTeamMappingRepository.save(newUserTeamMapping);
            } else {
                userTeamMappingRepository.delete(oldUserTeamMapping);
            }
        });
    }
}
