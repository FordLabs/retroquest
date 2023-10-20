package com.ford.labs.retroquest.teamusermapping;

import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class TeamUserAuthorizationServiceTest {

    private final TeamUserMappingRepository mockRepository = mock(TeamUserMappingRepository.class);
    private final TeamUserAuthorizationService authService = new TeamUserAuthorizationService(mockRepository);

    @Test
    void isUserMemberOfTeam_WhenUserIsOnTeam_ReturnsTrue() {
        var userId = "User ID";
        var teamId = UUID.randomUUID();
        when(mockRepository.findByTeamIdAndUserId(teamId, userId)).thenReturn(Optional.of(new TeamUserMapping(
                UUID.randomUUID(),
                teamId,
                userId,
                LocalDateTime.now())));
        assertThat(authService.isUserMemberOfTeam(new JwtAuthenticationToken(mock(Jwt.class), null, userId), teamId)).isTrue();
    }

    @Test
    void isUserMemberOfTeam_WhenUserNotOnTeam_ReturnsFalse() {
        var userId = "User ID";
        var teamId = UUID.randomUUID();
        when(mockRepository.findByTeamIdAndUserId(teamId, userId)).thenReturn(Optional.empty());
        assertThat(authService.isUserMemberOfTeam(new JwtAuthenticationToken(mock(Jwt.class), null, userId), teamId)).isFalse();
    }

}