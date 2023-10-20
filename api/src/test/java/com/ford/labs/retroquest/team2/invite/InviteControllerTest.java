package com.ford.labs.retroquest.team2.invite;

import com.ford.labs.retroquest.teamusermapping.TeamUserAuthorizationService;
import org.assertj.core.util.Lists;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.UUID;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.anonymous;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@SpringBootTest
class InviteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private InviteService inviteService;

    @MockBean
    private TeamUserAuthorizationService authorizationService;

    @MockBean
    private JwtDecoder jwtDecoder;

    @Test
    void createInvite_Returns201CreatedWithInviteIdInLocationHeader() throws Exception {
        var teamId = UUID.randomUUID();
        var inviteId = UUID.randomUUID();
        var authentication = createAuthentication();
        when(authorizationService.isUserMemberOfTeam(authentication, teamId)).thenReturn(true);
        when(inviteService.createInvite(teamId)).thenReturn(new Invite(inviteId, teamId, LocalDateTime.now()));
        mockMvc.perform(post("/api/team2/%s/invites".formatted(teamId.toString()))
                .with(jwt()))
            .andExpect(status().isCreated())
            .andExpect(header().string(HttpHeaders.LOCATION, "/api/team/%s/invites/%s".formatted(teamId.toString(), inviteId.toString())));
    }

    @Test
    void createInvite_WithInvalidToken_Throws401() throws Exception {
        mockMvc.perform(post("/api/team2/%s/invites".formatted(UUID.randomUUID()))
                .with(anonymous()))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void createInvite_WhenUserNotOnTeam_Throws403() throws Exception{
        UUID teamId = UUID.randomUUID();
        var authentication = createAuthentication();
        when(authorizationService.isUserMemberOfTeam(authentication, teamId)).thenReturn(false);
        mockMvc.perform(post("/api/team2/%s/invites".formatted(teamId))
                .with(jwt()))
            .andExpect(status().isForbidden());
    }

    Authentication createAuthentication() {
        var headers = new HashMap<String, Object>();
        headers.put("alg", "none");
        var claims = new HashMap<String, Object>();
        claims.put("sub", "user");
        claims.put("scope", "read");
        var authorities = Lists.list(new SimpleGrantedAuthority("SCOPE_read"));
        return new JwtAuthenticationToken(
                new Jwt(
                        "token",
                        null,
                        null,
                        headers,
                        claims
                ),
                authorities,
                "user"
        );
    }
}