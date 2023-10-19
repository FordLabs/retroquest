package com.ford.labs.retroquest.team2.invite;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.mockito.Mockito.when;
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
    private JwtDecoder jwtDecoder;

    @Test
    void createInvite_Returns201CreatedWithInviteIdInLocationHeader() throws Exception {
        var teamId = UUID.randomUUID();
        var inviteId = UUID.randomUUID();
        when(inviteService.createInvite(teamId)).thenReturn(new Invite(inviteId, teamId, LocalDateTime.now()));
        mockMvc.perform(post("/api/team2/%s/invites".formatted(teamId.toString()))
                .with(SecurityMockMvcRequestPostProcessors.jwt()))
            .andExpect(status().isCreated())
            .andExpect(header().string(HttpHeaders.LOCATION, "/api/team/%s/invites/%s".formatted(teamId.toString(), inviteId.toString())));
    }

    @Test
    void createInvite_WithInvalidToken_Throws401() throws Exception {
        mockMvc.perform(post("/api/team2/%s/invites".formatted(UUID.randomUUID()))
                .with(SecurityMockMvcRequestPostProcessors.anonymous()))
            .andExpect(status().isUnauthorized());
    }
}