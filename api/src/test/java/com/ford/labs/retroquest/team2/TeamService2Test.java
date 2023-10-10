package com.ford.labs.retroquest.team2;

import com.ford.labs.retroquest.team2.exception.TeamAlreadyExistsException;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class TeamService2Test {
    private final TeamRepository2 mockTeamRepository = mock(TeamRepository2.class);
    private final TeamService2 service = new TeamService2(mockTeamRepository);

    @Test
    void createTeam_ShouldReturnCreatedTeam() {
        var expected = new Team(UUID.randomUUID(), "expected name", LocalDateTime.now(), new HashSet<>());
        when(mockTeamRepository.save(new Team(null, "expected name", null, null))).thenReturn(expected);
        var actual = service.createTeam("expected name");
        assertThat(actual).isEqualTo(expected);
    }

    @Test
    void createTeam_WhenTeamAlreadyExists_ShouldThrowException() {
        when(mockTeamRepository.save(new Team(null, "team already exists", null, null))).thenThrow(DataIntegrityViolationException.class);
        assertThatExceptionOfType(TeamAlreadyExistsException.class).isThrownBy(() -> {
            service.createTeam("team already exists");
        });
    }

}