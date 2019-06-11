package com.ford.labs.retroquest.api.refactor;

import com.ford.labs.retroquest.api.refactor.setup.ApiTest;
import com.ford.labs.retroquest.team.CreateTeamRequest;
import com.ford.labs.retroquest.team.TeamRepository;
import com.ford.labs.retroquest.team.TeamService;
import com.ford.labs.retroquest.users.*;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class TeamBoardApiTest extends ApiTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private TeamService teamService;

    @Autowired
    private UserTeamMappingRepository userTeamMappingRepository;

    private NewUserRequest validNewUserRequest = NewUserRequest.builder().name("jake").password("paul").build();

    private ExistingTeamRequest validNewTeamRequest = ExistingTeamRequest.builder().name("team1").password("pass123").build();
    private ExistingTeamRequest validSecondTeamRequest = ExistingTeamRequest.builder().name("team2").password("pass123").build();

    private String jwt;

    @Before
    public void setup() throws Exception {
        teamService.createNewTeam(CreateTeamRequest.builder()
                .name(validNewTeamRequest.getName())
                .password(validNewTeamRequest.getPassword())
                .build());

        teamService.createNewTeam(CreateTeamRequest.builder()
                .name(validSecondTeamRequest.getName())
                .password(validSecondTeamRequest.getPassword())
                .build());


        MvcResult result = mockMvc.perform(post("/api/user")
                .content(objectMapper.writeValueAsString(validNewUserRequest))
                .contentType(MediaType.APPLICATION_JSON)
        )
                .andExpect(status().is(201))
                .andReturn();

        jwt = result.getResponse().getContentAsString();
    }

    @After
    public void teardown() {
        userRepository.deleteAll();
        teamRepository.deleteAll();
        userTeamMappingRepository.deleteAll();

        assertThat(userRepository.count()).isEqualTo(0);
        assertThat(teamRepository.count()).isEqualTo(0);
        assertThat(userTeamMappingRepository.count()).isEqualTo(0);
    }

    @Test
    public void shouldAddTwoExistingTeamsToTheUser() throws Exception {

        // First Call

        mockMvc.perform(put("/api/user/" + validNewUserRequest.getName() + "/team")
                .content(objectMapper.writeValueAsString(validNewTeamRequest))
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + jwt)
        )
                .andExpect(status().is(201));

        assertThat(userRepository.count()).isEqualTo(1);

        User firstedSavedUser = userRepository.findAll().get(0);

        assertThat(firstedSavedUser.getTeams()).hasSize(1);
        assertThat(userTeamMappingRepository.count()).isEqualTo(1);

        // Second Call

        mockMvc.perform(put("/api/user/" + validNewUserRequest.getName() + "/team")
                .content(objectMapper.writeValueAsString(validSecondTeamRequest))
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + jwt)
        )
                .andExpect(status().is(201));

        List<UserTeamMapping> mappingsList = userTeamMappingRepository.findAll();
        assertThat(mappingsList).hasSize(2);
        assertThat(mappingsList.get(0).getUserId()).isEqualTo(firstedSavedUser.getId());
    }

    @Test
    public void shouldReturnAConflictStatusCodeWhenExistingTeamIsAddedToUserTwice() throws Exception {

        // First Call

        mockMvc.perform(put("/api/user/" + validNewUserRequest.getName() + "/team")
                .content(objectMapper.writeValueAsString(validNewTeamRequest))
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + jwt)
        )
                .andExpect(status().is(201));

        // Second Call

        mockMvc.perform(put("/api/user/" + validNewUserRequest.getName() + "/team")
                .content(objectMapper.writeValueAsString(validNewTeamRequest))
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + jwt)
        )
                .andExpect(status().is(409));

        assertThat(userRepository.count()).isEqualTo(1);
    }

    @Test
    public void shouldNotAddExistingTeamToUserWithNoToken() throws Exception {

        mockMvc.perform(put("/api/user/" + validNewUserRequest.getName() + "/team")
                .content(objectMapper.writeValueAsString(validNewTeamRequest))
                .contentType(MediaType.APPLICATION_JSON)
        )
                .andExpect(status().is(401));

        assertThat(userTeamMappingRepository.count()).isEqualTo(0);
    }

    @Test
    public void shouldNotAddExistingTeamToUserWithAnInvalidToken() throws Exception {

        mockMvc.perform(put("/api/user/" + validNewUserRequest.getName() + "/team")
                .content(objectMapper.writeValueAsString(validNewTeamRequest))
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("invalid-team"))
        )
                .andExpect(status().is(403));

        assertThat(userTeamMappingRepository.count()).isEqualTo(0);
    }

    @Test
    public void shouldNotAddNewTeamToUserWithNoToken() throws Exception {

        mockMvc.perform(post("/api/user/" + validNewUserRequest.getName() + "/team")
                .content(objectMapper.writeValueAsString(validNewTeamRequest))
                .contentType(MediaType.APPLICATION_JSON)
        )
                .andExpect(status().is(401));

        assertThat(userTeamMappingRepository.count()).isEqualTo(0);
    }

    @Test
    public void shouldNotAddNewTeamToUserWithAnInvalidToken() throws Exception {

        mockMvc.perform(post("/api/user/" + validNewUserRequest.getName() + "/team")
                .content(objectMapper.writeValueAsString(validNewTeamRequest))
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("invalid-team"))
        )
                .andExpect(status().is(403));

        assertThat(userTeamMappingRepository.count()).isEqualTo(0);
    }

    @Test
    public void shouldNotAddNewTeamToUserWithMissingBody() throws Exception {
        mockMvc.perform(post("/api/user/" + validNewUserRequest.getName() + "/team")
                .content("")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + jwt)
        )
                .andExpect(status().is(400));

        assertThat(userTeamMappingRepository.count()).isEqualTo(0);
    }

    @Test
    public void shouldNotAddNewTeamToUserWithEmptyBody() throws Exception {
        mockMvc.perform(post("/api/user/" + validNewUserRequest.getName() + "/team")
                .content(objectMapper.writeValueAsString(NewTeamRequest.builder().name("").build()))
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + jwt)
        )
                .andExpect(status().is(400));

        assertThat(userTeamMappingRepository.count()).isEqualTo(0);
    }

    @Test
    public void shouldAddNewTeamToUser() throws Exception {
        NewTeamRequest validNewSecondTeamRequest = NewTeamRequest.builder()
                .name("johnny")
                .build();

        mockMvc.perform(post("/api/user/" + validNewUserRequest.getName() + "/team")
                .content(objectMapper.writeValueAsString(validNewSecondTeamRequest))
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + jwt)
        )
                .andExpect(status().is(201));

        assertThat(userTeamMappingRepository.count()).isEqualTo(1);
    }

    @Test
    public void shouldAddTwoNewTeamsToUser() throws Exception {
        NewTeamRequest validNewSecondTeamRequest = NewTeamRequest.builder()
                .name("johnny")
                .build();

        mockMvc.perform(post("/api/user/" + validNewUserRequest.getName() + "/team")
                .content(objectMapper.writeValueAsString(validNewSecondTeamRequest))
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + jwt)
        )
                .andExpect(status().is(201));

        assertThat(userTeamMappingRepository.count()).isEqualTo(1);


        NewUserRequest validNewThirdTeamRequest = NewUserRequest.builder()
                .name("johnny2")
                .password("appleseed2")
                .build();


        mockMvc.perform(post("/api/user/" + validNewUserRequest.getName() + "/team")
                .content(objectMapper.writeValueAsString(validNewThirdTeamRequest))
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + jwt)
        )
                .andExpect(status().is(201));

        assertThat(userTeamMappingRepository.count()).isEqualTo(2);

        User savedUser = userRepository.findUserByName(validNewUserRequest.getName());
        assertThat(savedUser.getTeams()).hasSize(2);
    }

    @Test
    public void shouldGetTeamsAssignedToUser() throws Exception {
        NewTeamRequest validNewSecondTeamRequest = NewTeamRequest.builder()
                .name("johnny")
                .build();

        mockMvc.perform(post("/api/user/" + validNewUserRequest.getName() + "/team")
                .content(objectMapper.writeValueAsString(validNewSecondTeamRequest))
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + jwt)
        )
                .andExpect(status().is(201));

        assertThat(userTeamMappingRepository.count()).isEqualTo(1);

        MvcResult result = mockMvc.perform(get("/api/user/" + validNewUserRequest.getName() + "/team")
                .content(objectMapper.writeValueAsString(validNewSecondTeamRequest))
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + jwt)
        )
                .andExpect(status().is(200))
                .andReturn();

        Set teams = objectMapper.readValue(result.getResponse().getContentAsByteArray(), Set.class);

        assertThat(teams).hasSize(1);
    }

}
