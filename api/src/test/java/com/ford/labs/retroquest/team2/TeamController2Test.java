package com.ford.labs.retroquest.team2;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ford.labs.retroquest.team2.exception.InviteExpiredException;
import com.ford.labs.retroquest.team2.exception.InviteNotFoundException;
import com.ford.labs.retroquest.team2.exception.TeamAlreadyExistsException;
import com.ford.labs.retroquest.team2.exception.TeamNotFoundException;
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

import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@AutoConfigureMockMvc
@SpringBootTest
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
    void createTeam_Returns201WithLocationIncludingTeamId() throws Exception {
        var teamId = UUID.randomUUID();
        var teamName = "Team name";
        when(service.createTeam(teamName, "user")).thenReturn(new Team(teamId, teamName, LocalDateTime.now()));

        mockMvc.perform(post("/api/team2")
                        .with(jwt())
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

    @Test
    void createTeam_WhenTeamAlreadyExists_Throws409() throws Exception {
        var teamName = "Team name";
        doThrow(TeamAlreadyExistsException.class).when(service).createTeam(teamName, "user");
        mockMvc.perform(post("/api/team2")
                        .with(jwt())
                        .content(objectMapper.writeValueAsString(new CreateTeamRequest(teamName)))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isConflict())
                .andExpect(status().reason("A team with that name already exists"));
    }

    @Test
    void addUser_WithGoodInvite_Returns200() throws Exception {
        var teamId = UUID.randomUUID();
        var inviteId = UUID.randomUUID();
        mockMvc.perform(post("/api/team2/%s/users".formatted(teamId.toString()))
                        .with(jwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AddUserToTeamRequest(inviteId))))
                .andExpect(status().isOk());
        verify(service).addUser(teamId, "user", inviteId);
    }

    @Test
    void addUser_WithInvalidToken_Throws401() throws Exception {
        mockMvc.perform(post("/api/team2/%s/users".formatted(UUID.randomUUID()))
                        .with(SecurityMockMvcRequestPostProcessors.anonymous())
                        .content(objectMapper.writeValueAsString(new AddUserToTeamRequest(UUID.randomUUID())))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void addUser_WhenTeamNotFound_Returns404() throws Exception {
        var teamId = UUID.randomUUID();
        var inviteId = UUID.randomUUID();
        doThrow(TeamNotFoundException.class).when(service).addUser(teamId, "user", inviteId);
        mockMvc.perform(post("/api/team2/%s/users".formatted(teamId.toString()))
                        .with(jwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AddUserToTeamRequest(inviteId))))
                .andExpect(status().isNotFound())
                .andExpect(status().reason("Team not found"));
    }

    @Test
    void addUser_WithInvalidInviteId_Returns404() throws Exception {
        var teamId = UUID.randomUUID();
        var inviteId = UUID.randomUUID();
        doThrow(InviteNotFoundException.class).when(service).addUser(teamId, "user", inviteId);
        mockMvc.perform(post("/api/team2/%s/users".formatted(teamId.toString()))
                        .with(jwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AddUserToTeamRequest(inviteId))))
                .andExpect(status().isNotFound())
                .andExpect(status().reason("Invite not found for team"));
    }

    @Test
    void addUser_WithExpiredInvite_Returns400() throws Exception {
        var teamId = UUID.randomUUID();
        var inviteId = UUID.randomUUID();
        doThrow(InviteExpiredException.class).when(service).addUser(teamId, "user", inviteId);
        mockMvc.perform(post("/api/team2/%s/users".formatted(teamId.toString()))
                        .with(jwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AddUserToTeamRequest(inviteId))))
                .andExpect(status().isBadRequest())
                .andExpect(status().reason("Invite expired"));
    }
}