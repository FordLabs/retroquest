package com.ford.labs.retroquest.team2;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
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
@SpringBootTest//(classes = TeamController2.class)
class TeamController2Test {

    @MockBean
    private JwtDecoder jwtDecoder;

    @MockBean
    private TeamService2 service;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createTeam_WithValidToken_Returns201WithLocationIncludingTeamId() throws Exception {
        var teamId = UUID.randomUUID();
        var teamName = "Team name";
        when(service.createTeam(teamName, "user")).thenReturn(new Team(teamId, teamName, LocalDateTime.now()));

        mockMvc.perform(post("/api/team2")
                .with(SecurityMockMvcRequestPostProcessors.jwt())
                .content(objectMapper.writeValueAsString(new CreateTeamRequest(teamName)))
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isCreated())
            .andExpect(header().string(HttpHeaders.LOCATION, "/api/team/%s".formatted(teamId)));
    }

    @Test
    void createTeam_WithInvalidToken_Throws401() throws Exception {
        mockMvc.perform(post("/api/team2")
                .with(SecurityMockMvcRequestPostProcessors.anonymous())
                .content(objectMapper.writeValueAsString(new CreateTeamRequest("Team name")))
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isUnauthorized());
    }
}