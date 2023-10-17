package com.ford.labs.retroquest.team2;

import com.ford.labs.retroquest.team2.exception.TeamAlreadyExistsException;
import com.ford.labs.retroquest.teamusermapping.TeamUserMappingService;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.Mockito.*;

class TeamService2Test {
    private final TeamRepository2 mockTeamRepository = mock(TeamRepository2.class);
    private final TeamUserMappingService mockTeamUserMappingService = mock(TeamUserMappingService.class);
    private final TeamService2 service = new TeamService2(mockTeamRepository, mockTeamUserMappingService);

    @Test
    void createTeam_ShouldReturnCreatedTeam() {
        var expected = new Team(UUID.randomUUID(), "expected name", LocalDateTime.now());
        when(mockTeamRepository.save(new Team(null, "expected name", null))).thenReturn(expected);
        var actual = service.createTeam("expected name", "User ID");
        assertThat(actual).isEqualTo(expected);
    }

    @Test
    void createTeam_WhenTeamAlreadyExists_ShouldThrowException() {
        when(mockTeamRepository.save(new Team(null, "team already exists", null))).thenThrow(DataIntegrityViolationException.class);
        assertThatExceptionOfType(TeamAlreadyExistsException.class).isThrownBy(() -> service.createTeam("team already exists", "user ID"));
    }

    @Test
    void createTeam_ShouldAddCreatingUserToTeam() {
        var expected = new Team(UUID.randomUUID(), "expected team name", LocalDateTime.now());
        when(mockTeamRepository.save(new Team(null, "expected team name", null))).thenReturn(expected);
        var actual = service.createTeam("expected team name", "User ID");
        assertThat(actual).isEqualTo(expected);
        verify(mockTeamUserMappingService).addUserToTeam(actual.getId(), "User ID");
    }

}