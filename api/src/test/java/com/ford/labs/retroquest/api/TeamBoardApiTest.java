package com.ford.labs.retroquest.api;

import com.ford.labs.retroquest.api.setup.ApiTest;
import com.ford.labs.retroquest.columntitle.ColumnTitleRepository;
import com.ford.labs.retroquest.team.CreateTeamRequest;
import com.ford.labs.retroquest.team.Team;
import com.ford.labs.retroquest.team.TeamRepository;
import com.ford.labs.retroquest.team.TeamService;
import com.ford.labs.retroquest.users.*;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Tag("api")
public class TeamBoardApiTest extends ApiTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private TeamService teamService;

    @Autowired
    private ColumnTitleRepository columnTitleRepository;

    @Autowired
    private UserTeamMappingRepository userTeamMappingRepository;

    private final NewUserRequest validNewUserRequest = NewUserRequest.builder().name("jake").password("paul").build();

    private final ExistingTeamRequest validNewTeamRequest = ExistingTeamRequest.builder().name("team1").password("pass123").build();
    private final ExistingTeamRequest validSecondTeamRequest = ExistingTeamRequest.builder().name("team2").password("pass123").build();

    private String jwt;

    @BeforeEach
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

    @AfterEach
    public void teardown() {
        userRepository.deleteAllInBatch();
        teamRepository.deleteAllInBatch();
        columnTitleRepository.deleteAllInBatch();
        userTeamMappingRepository.deleteAllInBatch();

        assertThat(userRepository.count()).isZero();
        assertThat(teamRepository.count()).isZero();
        assertThat(columnTitleRepository.count()).isZero();
        assertThat(userTeamMappingRepository.count()).isZero();
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

        assertThat(userTeamMappingRepository.count()).isZero();
    }

    @Test
    public void shouldNotAddExistingTeamToUserWithAnInvalidToken() throws Exception {

        mockMvc.perform(put("/api/user/" + validNewUserRequest.getName() + "/team")
                .content(objectMapper.writeValueAsString(validNewTeamRequest))
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("invalid-team"))
        )
                .andExpect(status().is(403));

        assertThat(userTeamMappingRepository.count()).isZero();
    }

    @Test
    public void shouldNotAddNewTeamToUserWithNoToken() throws Exception {

        mockMvc.perform(post("/api/user/" + validNewUserRequest.getName() + "/team")
                .content(objectMapper.writeValueAsString(validNewTeamRequest))
                .contentType(MediaType.APPLICATION_JSON)
        )
                .andExpect(status().is(401));

        assertThat(userTeamMappingRepository.count()).isZero();
    }

    @Test
    public void shouldNotAddNewTeamToUserWithAnInvalidToken() throws Exception {

        mockMvc.perform(post("/api/user/" + validNewUserRequest.getName() + "/team")
                .content(objectMapper.writeValueAsString(validNewTeamRequest))
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("invalid-team"))
        )
                .andExpect(status().is(403));

        assertThat(userTeamMappingRepository.count()).isZero();
    }

    @Test
    public void shouldNotAddNewTeamToUserWithMissingBody() throws Exception {
        mockMvc.perform(post("/api/user/" + validNewUserRequest.getName() + "/team")
                .content("")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + jwt)
        )
                .andExpect(status().is(400));

        assertThat(userTeamMappingRepository.count()).isZero();
    }

    @Test
    public void shouldNotAddNewTeamToUserWithEmptyBody() throws Exception {
        mockMvc.perform(post("/api/user/" + validNewUserRequest.getName() + "/team")
                .content(objectMapper.writeValueAsString(NewTeamRequest.builder().name("").build()))
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + jwt)
        )
                .andExpect(status().is(400));

        assertThat(userTeamMappingRepository.count()).isZero();
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

        User savedUser = userRepository.findByName(validNewUserRequest.getName()).orElseThrow(Exception::new);
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

        Set<Team> teams = objectMapper.readValue(
                result.getResponse().getContentAsByteArray(),
                objectMapper.getTypeFactory().constructCollectionType(Set.class, Team.class)
        );

        assertThat(teams).hasSize(1);
    }

}
