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
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Value;
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
    private final TeamService teamService;
    private final boolean runCleanupJob;

    public TeamNameCleanup(TeamRepository teamRepository,
                           ThoughtRepository thoughtRepository,
                           ColumnTitleRepository columnTitleRepository,
                           BoardRepository boardRepository,
                           ActionItemRepository actionItemRepository,
                           UserTeamMappingRepository userTeamMappingRepository,
                           FeedbackRepository feedbackRepository,
                           TeamService teamService,
                           @Value("${com.retroquest.runTeamCleanupJob:false}") boolean runCleanupJob) {
        this.teamRepository = teamRepository;
        this.thoughtRepository = thoughtRepository;
        this.columnTitleRepository = columnTitleRepository;
        this.boardRepository = boardRepository;
        this.actionItemRepository = actionItemRepository;
        this.userTeamMappingRepository = userTeamMappingRepository;
        this.feedbackRepository = feedbackRepository;
        this.teamService = teamService;
        this.runCleanupJob = runCleanupJob;
    }

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        if (runCleanupJob) {
            fixConflictingTeamNames();
            teamService.trimAllTeamNames();
        }
    }

    private void fixConflictingTeamNames() {
        var conflictTeams = teamRepository.findAllTeamsWithConflictingCanonicalNames();
        conflictTeams.forEach(this::resolveTeamNameConflict);
    }

    private void resolveTeamNameConflict(CanonicalTeamNameAndCount teamNameRecord) {
        var teams = teamRepository.findAllTeamsByNameWithTrimmingAndIgnoreCase(teamNameRecord.getName());
        var teamToKeep = getTeamToKeep(teams);
        deleteDuplicateTeams(teams, teamToKeep);
    }

    private void deleteDuplicateTeams(List<Team> teams, Team teamToKeep) {
        teams.stream()
                .filter(t -> !t.getId().equals(teamToKeep.getId()))
                .forEach(t -> deleteTeam(t, teamToKeep));
    }

    private void deleteTeam(Team oldTeam, Team newTeam) {
        moveThoughtsWithBoardsToNewTeamOrElseDelete(oldTeam, newTeam);
        deleteColumnTitles(oldTeam);
        moveBoardsToNewTeam(oldTeam, newTeam);
        deleteActionItems(oldTeam);
        moveUserTeamMappingsToNewTeam(oldTeam, newTeam);
        moveFeedbackToNewTeam(oldTeam, newTeam);
        teamRepository.delete(oldTeam);
    }


    private Team getTeamToKeep(List<Team> teams) {
        var maxTeam = teams.get(0);
        var maxId = 0L;

        for (var t : teams) {
            var maxIdForTeam = thoughtRepository.getMaxIdByTeamId(t.getId()).orElse(0L);
            if (maxIdForTeam > maxId) {
                maxId = maxIdForTeam;
                maxTeam = t;
            }
        }
        return maxTeam;
    }

    private void moveThoughtsWithBoardsToNewTeamOrElseDelete(Team oldTeam, Team newTeam) {
        var columnTitles = columnTitleRepository.findAllByTeamId(newTeam.getId());
        var topicsToNewTitles = columnTitles.stream()
                .collect(toMap(ColumnTitle::getTopic, columnTitle -> columnTitle));

        var oldThoughts = thoughtRepository.findAllByTeamId(oldTeam.getId());
        for (var oldThought : oldThoughts) {
            if (oldThought.getBoardId() != null && oldThought.getBoardId() != 0) {
                var newThought = oldThought.toBuilder()
                        .teamId(newTeam.getId())
                        .columnTitle(topicsToNewTitles.get(oldThought.getTopic()))
                        .build();
                thoughtRepository.save(newThought);
            } else {
                thoughtRepository.delete(oldThought);
            }
        }
    }

    private void deleteColumnTitles(Team oldTeam) {
        var columnTitles = columnTitleRepository.findAllByTeamId(oldTeam.getId());
        columnTitles.forEach(columnTitleRepository::delete);
    }

    private void moveBoardsToNewTeam(Team oldTeam, Team newTeam) {
        var boards = boardRepository.findAllByTeamId(oldTeam.getId());
        boards.forEach(oldBoard -> {
            var newBoard = oldBoard.toBuilder().teamId(newTeam.getId()).build();
            boardRepository.save(newBoard);
        });
    }

    private void deleteActionItems(Team oldTeam) {
        var actionItems = actionItemRepository.findAllByTeamId(oldTeam.getId());
        actionItems.forEach(actionItemRepository::delete);
    }

    private void moveFeedbackToNewTeam(Team oldTeam, Team newTeam) {
        var feedback = feedbackRepository.findAllByTeamId(oldTeam.getId());
        feedback.forEach(oldFeedback -> {
            var newFeedback = oldFeedback.toBuilder().teamId(newTeam.getId()).build();
            feedbackRepository.save(newFeedback);
        });
    }

    private void moveUserTeamMappingsToNewTeam(Team oldTeam, Team newTeam) {
        var userTeamMappings = userTeamMappingRepository.findAllByTeamUri(oldTeam.getUri());
        userTeamMappings.forEach(oldUserTeamMapping -> {
            if (userTeamMappingRepository.findAllByTeamUriAndUserId(newTeam.getUri(), oldUserTeamMapping.getUserId()).size() == 0) {
                var newUserTeamMapping = oldUserTeamMapping.toBuilder().teamUri(newTeam.getUri()).build();
                userTeamMappingRepository.save(newUserTeamMapping);
            } else {
                userTeamMappingRepository.delete(oldUserTeamMapping);
            }
        });
    }
}
