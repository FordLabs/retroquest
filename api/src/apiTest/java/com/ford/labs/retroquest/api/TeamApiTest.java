package com.ford.labs.retroquest.api;

import com.ford.labs.retroquest.team.Team;
import com.ford.labs.retroquest.team.TeamRepository;
import com.ford.labs.retroquest.security.JwtBuilder;
import com.ford.labs.retroquest.team.RequestedTeam;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.test.context.junit4.AbstractTransactionalJUnit4SpringContextTests;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.containsString;
import static org.junit.Assert.*;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
public class TeamApiTest extends AbstractTransactionalJUnit4SpringContextTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtBuilder jwtBuilder;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private TestRestTemplate restTemplate;

    @Ignore
    @Test
    public void canCreateTeamWithValidTeamNameAndPassword() throws Exception {
        String teamJsonBody = "{ \"name\" : \"Beach Bums\", \"password\" : \"superSecure\"}";
        String expectedJwt = jwtBuilder.buildJwt("beach-bums");

        MvcResult mvcResult = mockMvc.perform(post("/api/team")
                .contentType(APPLICATION_JSON)
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("beach-bums"))
                .content(teamJsonBody)).andReturn();


        Team teamEntity = teamRepository.findOne("beach-bums");

        assertEquals(201, mvcResult.getResponse().getStatus());
        assertEquals("Beach Bums", teamEntity.getName());
        assertEquals("beach-bums", teamEntity.getUri());
        assertEquals(60, teamEntity.getPassword().length());
        assertEquals(expectedJwt, mvcResult.getResponse().getContentAsString());
    }

    @Test
    public void cannotCreateTeamWithEmptyPassword() throws Exception {
        String teamJsonBody = "{ \"name\" : \"A name\"}";

        mockMvc.perform(post("/api/team")
                .contentType(APPLICATION_JSON)
                .content(teamJsonBody)).andExpect(status()
                .reason(containsString("Password must be 8 characters or longer.")))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void cannotCreateURIWithEmptyString() throws Exception {
        String teamJsonBody = "{ \"name\" : \"\", \"password\" : \"superSecure\"}";

        mockMvc.perform(post("/api/team")
                .contentType(APPLICATION_JSON)
                .content(teamJsonBody)).andExpect(status()
                .reason(containsString("Please enter a board name.")))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void cannotCreateURIWithSpecialCharactersInTeamName() throws Exception {
        String teamJsonBody = "{ \"name\" : \"The@Mild$Ones\", \"password\" : \"superSecure\"}";

        mockMvc.perform(post("/api/team")
                .contentType(APPLICATION_JSON)
                .content(teamJsonBody)).andExpect(status()
                .reason(containsString("Please enter a board name without any special characters.")))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void cannotCreateTeamWithDuplicateKey() throws Exception {
        String teamJsonBody = "{ \"name\" : \"Beach Bums A Team\", \"password\" : \"superSecure\"}";
        String teamJsonSameBody = "{ \"name\" : \"Beach Bums A Team\", \"password\" : \"superSecure\"}";

        MvcResult mvcResult = mockMvc.perform(post("/api/team")
                .contentType(APPLICATION_JSON)
                .content(teamJsonBody)).andReturn();

        assertEquals(201, mvcResult.getResponse().getStatus());

        mockMvc.perform(post("/api/team")
                .contentType(APPLICATION_JSON)
                .content(teamJsonSameBody))
                .andExpect(status().reason(containsString("This board name is already in use. Please try another one.")))
                .andExpect(status().isConflict());
    }

    @Test
    public void canRetrieveNameFromTeamId() throws Exception {
        String expectedName = "Beachity Bums";

        RequestedTeam team = new RequestedTeam();
        team.setName("Beachity Bums");
        team.setPassword("password");

        restTemplate.postForObject("/api/team/", team, String.class);

        String actualName = mockMvc.perform(get("/api/team/beachity-bums/name")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("beachity-bums")))
            .andReturn().getResponse().getContentAsString();

        assertEquals(expectedName, actualName);
    }

    @Test
    public void retrieveNonExistentNameReturns403() throws Exception {
        MvcResult mvcResult = mockMvc.perform(get("/api/team/nonExistentTeamName/name"))
                .andExpect(status().isForbidden())
                .andReturn();

        assertEquals("Incorrect board name. Please try again.", mvcResult.getResponse().getErrorMessage());
    }

    @Test
    public void canLoginWithTeamNameAndPassword() throws Exception {
        RequestedTeam team = new RequestedTeam();
        team.setName("PEACHY BEACHY");
        team.setPassword("password");

        restTemplate.postForObject("/api/team/", team, String.class);

        MvcResult mvcResult = mockMvc.perform(post("/api/team/login")
                .content("{\"name\":\"PEACHY BEACHY\", \"password\":\"password\"}")
                .contentType(APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();

        assertEquals("peachy-beachy", mvcResult.getResponse().getHeader("Location"));
        assertNotNull(mvcResult.getResponse().getContentAsString());
    }

    @Test
    public void loginWithBadTeamNameReturns403() throws Exception {
        MvcResult mvcResult = mockMvc.perform(post("/api/team/login")
                .content("{\"name\":\"NOT A TEAM\"}")
                .contentType(APPLICATION_JSON))
            .andExpect(status().isForbidden())
            .andReturn();

        assertEquals("Incorrect board name. Please try again.", mvcResult.getResponse().getErrorMessage());
    }

    @Test
    public void loginWithBadPasswordReturns403() throws Exception {
        RequestedTeam team = new RequestedTeam();
        team.setName("PEACHY BEACHY");
        team.setPassword("password");

        restTemplate.postForObject("/api/team/", team, String.class);

        MvcResult mvcResult = mockMvc.perform(post("/api/team/login")
                .content("{\"name\":\"PEACHY BEACHY\"}")
                .contentType(APPLICATION_JSON))
                .andExpect(status().isForbidden())
                .andReturn();

        assertEquals("Incorrect board or password. Please try again.", mvcResult.getResponse().getErrorMessage());
    }

    @Test
    public void canSetPasswordWhenTeamPasswordIsNull() throws Exception {
        Team team = new Team();
        team.setUri("a-team");
        team.setName("A Team");
        teamRepository.save(team);

        mockMvc.perform(post("/api/team/a-team/set-password")
                .content("{\"password\":\"password\"}")
                .contentType(APPLICATION_JSON))
            .andExpect(status().isOk())
            .andReturn();

        Team actualTeam = teamRepository.findOne("a-team");
        assertTrue(actualTeam.getPassword() != null);
    }
    
    @Test
    public void shouldErrorWhenTryingToSetPasswordOnTeamThatAlreadyHasOne() throws Exception {
        Team team = new Team();
        team.setUri("a-team");
        team.setName("A Team");
        team.setPassword("password");
        teamRepository.save(team);

        MvcResult mvcResult = mockMvc.perform(post("/api/team/a-team/set-password")
                .content("{\"password\":\"password\"}")
                .contentType(APPLICATION_JSON))
                .andExpect(status().isConflict())
                .andReturn();

        assertTrue(mvcResult.getResponse().getErrorMessage().contains("Team already has a password"));
    }

    @Test
    public void shouldErrorWhenTryingToSetTooShortPassword() throws Exception {
        Team team = new Team();
        team.setUri("a-team");
        team.setName("A Team");
        teamRepository.save(team);

        MvcResult mvcResult = mockMvc.perform(post("/api/team/a-team/set-password")
                .content("{\"password\":\"passwor\"}")
                .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andReturn();

        assertTrue(mvcResult.getResponse().getErrorMessage().contains("Password must be 8 characters or longer."));
    }

    @Test
    public void shouldErrorWhenTryingToSetNoPassword() throws Exception {
        Team team = new Team();
        team.setUri("a-team");
        team.setName("A Team");
        teamRepository.save(team);

        MvcResult mvcResult = mockMvc.perform(post("/api/team/a-team/set-password")
                .content("{}")
                .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andReturn();

        assertTrue(mvcResult.getResponse().getErrorMessage().contains("Password must be 8 characters or longer."));
    }

    @Test
    public void shouldReturnOkayWhenTheDesiredTeamMatchesTheTokenTeam() throws Exception {
        mockMvc.perform(get("/api/team/teamId/validate")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("teamId")))
            .andExpect(status().isOk());
    }

    @Test
    public void shouldReturnBadRequestWhenTheDesiredTeamDoesNotMatchTheTokenTeam() throws Exception {
        mockMvc.perform(get("/api/team/wrongTeamId/validate")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("teamId")))
            .andExpect(status().isUnauthorized());
    }
}
