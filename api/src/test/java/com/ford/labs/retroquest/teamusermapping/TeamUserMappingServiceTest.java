package com.ford.labs.retroquest.teamusermapping;

import com.ford.labs.retroquest.teamusermapping.exception.TeamNotFoundException;
import org.h2.jdbc.JdbcSQLIntegrityConstraintViolationException;
import org.hibernate.exception.ConstraintViolationException;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class TeamUserMappingServiceTest {

    private final TeamUserMappingRepository mockRepository = mock(TeamUserMappingRepository.class);
    private final TeamUserMappingService service = new TeamUserMappingService(mockRepository);

    @Test
    void addUserToTeam_SavesRecordToRepositoryWithTeamAndUserId() {
        var teamId = UUID.randomUUID();
        var userId = "User ID";
        service.addUserToTeam(teamId, userId);
        verify(mockRepository).save(new TeamUserMapping(null, teamId, userId, null));
    }

    @Test
    void addUserToTeam_WhenTeamDoesNotExist_ReturnsTeamNotFoundException() {
        var teamId = UUID.randomUUID();
        var userId = "User ID";
        when(mockRepository.save(new TeamUserMapping(null, teamId, userId, null)))
                .thenThrow(new DataIntegrityViolationException("could not execute statement", new ConstraintViolationException("could not execute statement", null, "FK_TEAM_MAPPING")));
        assertThrows(TeamNotFoundException.class, () -> service.addUserToTeam(teamId, userId));
    }

    @Test
    void addUserToTeam_WhenUserAlreadyAddedToTeam_SwallowsException() {
        var teamId = UUID.randomUUID();
        var userId = "User ID";
        when(mockRepository.save(new TeamUserMapping(null, teamId, userId, null)))
                .thenThrow(new DataIntegrityViolationException("could not execute statement", new JdbcSQLIntegrityConstraintViolationException(
                        "Unique index or primary key violation: \"PUBLIC.UNIQUE_TEAM_USER_MAPPING_INDEX_9 ON PUBLIC.TEAM_USER_MAPPING(TEAM_ID, USER_ID) VALUES 1\"; SQL statement:\n" +
                                "insert into team_user_mapping (created_at, team_id, user_id, id) values (?, ?, ?, ?) [23505-200]",
                        "insert into team_user_mapping (created_at, team_id, user_id, id) values (?, ?, ?, ?)",
                        "23505",
                        23505,
                        null,
                        null
                )));
        service.addUserToTeam(teamId, userId);
    }

    @Test
    void addUserToTeam_WhenOtherExceptionIsThrown_ThrowsException() {
        var teamId = UUID.randomUUID();
        var userId = "User ID";
        when(mockRepository.save(new TeamUserMapping(null, teamId, userId, null))).thenThrow(new RuntimeException("Something went wrong"));
        assertThrows(RuntimeException.class, () -> service.addUserToTeam(teamId, userId));
    }

}