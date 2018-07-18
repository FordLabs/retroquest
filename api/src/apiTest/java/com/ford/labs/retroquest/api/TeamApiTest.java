package com.ford.labs.retroquest.api;

import com.ford.labs.retroquest.security.JwtBuilder;
import com.ford.labs.retroquest.team.RequestedTeam;
import com.ford.labs.retroquest.team.Team;
import com.ford.labs.retroquest.team.TeamRepository;
import org.junit.After;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.web.client.RestTemplate;

import static org.hamcrest.Matchers.containsString;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.client.ExpectedCount.once;
import static org.springframework.test.web.client.ExpectedCount.times;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
public class TeamApiTest {

    private static final String VALID_PASSWORD = "Passw0rd";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtBuilder jwtBuilder;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private TestRestTemplate testRestTemplate;

    @Autowired
    private RestTemplate restTemplate;

    @Test
    public void canCreateTeamWithValidTeamNameAndPassword() throws Exception {
        MockRestServiceServer server = MockRestServiceServer.bindTo(restTemplate).build();
        server.expect(requestTo("http://captcha.url")).andRespond(withSuccess("{\"success\":true}", MediaType.APPLICATION_JSON));

        String teamJsonBody = "{ \"name\" : \"Beach Bums\", \"password\" : \"" + VALID_PASSWORD + "\", \"captchaResponse\":\"some captcha\"}";

        MvcResult mvcResult = mockMvc.perform(post("/api/team")
                .contentType(APPLICATION_JSON)
                .content(teamJsonBody)).andReturn();


        Team teamEntity = teamRepository.findOne("beach-bums");

        assertEquals(201, mvcResult.getResponse().getStatus());
        assertEquals("Beach Bums", teamEntity.getName());
        assertEquals("beach-bums", teamEntity.getUri());
        assertEquals(60, teamEntity.getPassword().length());
        assertNotNull(mvcResult.getResponse().getContentAsString());
    }

    @Test
    public void cannotCreateTeamWithEmptyPassword() throws Exception {
        MockRestServiceServer server = MockRestServiceServer.bindTo(restTemplate).build();
        server.expect(requestTo("http://captcha.url")).andRespond(withSuccess("{\"success\":true}", MediaType.APPLICATION_JSON));

        String teamJsonBody = "{ \"name\" : \"A name\", \"captchaResponse\":\"some captcha\"}";

        mockMvc.perform(post("/api/team")
                .contentType(APPLICATION_JSON)
                .content(teamJsonBody)).andExpect(status()
                .reason(containsString("Password must be 8 characters or longer.")))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void cannotCreateURIWithEmptyString() throws Exception {
        MockRestServiceServer server = MockRestServiceServer.bindTo(restTemplate).build();
        server.expect(requestTo("http://captcha.url")).andRespond(withSuccess("{\"success\":true}", MediaType.APPLICATION_JSON));

        String teamJsonBody = "{ \"name\" : \"\", \"password\" : \"" + VALID_PASSWORD + "\", \"captchaResponse\":\"some captcha\"}";

        mockMvc.perform(post("/api/team")
                .contentType(APPLICATION_JSON)
                .content(teamJsonBody)).andExpect(status()
                .reason(containsString("Please enter a board name.")))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void cannotCreateURIWithSpecialCharactersInTeamName() throws Exception {
        MockRestServiceServer server = MockRestServiceServer.bindTo(restTemplate).build();
        server.expect(requestTo("http://captcha.url")).andRespond(withSuccess("{\"success\":true}", MediaType.APPLICATION_JSON));

        String teamJsonBody = "{ \"name\" : \"The@Mild$Ones\", \"password\" : \"" + VALID_PASSWORD + "\", \"captchaResponse\":\"some captcha\"}";

        mockMvc.perform(post("/api/team")
                .contentType(APPLICATION_JSON)
                .content(teamJsonBody)).andExpect(status()
                .reason(containsString("Please enter a board name without any special characters.")))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void cannotCreateTeamWithDuplicateKey() throws Exception {
        MockRestServiceServer server = MockRestServiceServer.bindTo(restTemplate).build();
        server.expect(times(2), requestTo("http://captcha.url")).andRespond(withSuccess("{\"success\":true}", MediaType.APPLICATION_JSON));

        String teamJsonBody = "{ \"name\" : \"Beach Bums A Team\", \"password\" : \"" + VALID_PASSWORD + "\", \"captchaResponse\":\"some captcha\"}";
        String teamJsonSameBody = "{ \"name\" : \"Beach Bums A Team\", \"password\" : \"" + VALID_PASSWORD + "\", \"captchaResponse\":\"some captcha\"}";

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
        MockRestServiceServer server = MockRestServiceServer.bindTo(restTemplate).build();
        server.expect(requestTo("http://captcha.url")).andRespond(withSuccess("{\"success\":true}", MediaType.APPLICATION_JSON));

        String expectedName = "Beachity Bums";

        RequestedTeam team = new RequestedTeam();
        team.setName("Beachity Bums");
        team.setPassword(VALID_PASSWORD);
        team.setCaptchaResponse("some captcha");

        testRestTemplate.postForObject("/api/team/", team, String.class);

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
        MockRestServiceServer server = MockRestServiceServer.bindTo(restTemplate).build();
        server.expect(times(2), requestTo("http://captcha.url")).andRespond(withSuccess("{\"success\":true}", MediaType.APPLICATION_JSON));

        RequestedTeam team = new RequestedTeam();
        team.setName("PEACHY BEACHY");
        team.setPassword(VALID_PASSWORD);
        team.setCaptchaResponse("some captcha");

        testRestTemplate.postForObject("/api/team/", team, String.class);

        MvcResult mvcResult = mockMvc.perform(post("/api/team/login")
                .content("{\"name\":\"PEACHY BEACHY\", \"password\":\"" + VALID_PASSWORD + "\", \"captchaResponse\":\"captcha\"}")
                .contentType(APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();

        assertEquals("peachy-beachy", mvcResult.getResponse().getHeader("Location"));
        assertNotNull(mvcResult.getResponse().getContentAsString());
    }

    @Test
    public void loginWithBadCaptchaResponseReturns403() throws Exception {
        MockRestServiceServer server = MockRestServiceServer.bindTo(restTemplate).build();
        server.expect(once(), requestTo("http://captcha.url")).andRespond(withSuccess("{\"success\":true}", MediaType.APPLICATION_JSON));
        server.expect(once(), requestTo("http://captcha.url")).andRespond(withSuccess("{\"success\":false}", MediaType.APPLICATION_JSON));

        RequestedTeam team = new RequestedTeam();
        team.setName("PEACHY BEACHY");
        team.setPassword(VALID_PASSWORD);
        team.setCaptchaResponse("some captcha");

        testRestTemplate.postForObject("/api/team/", team, String.class);

        MvcResult mvcResult = mockMvc.perform(post("/api/team/login")
                .content("{\"name\":\"PEACHY BEACHY\", \"password\":\"" + VALID_PASSWORD + "\", \"captchaResponse\":\"invalid captcha\"}")
                .contentType(APPLICATION_JSON))
                .andExpect(status().isForbidden())
                .andReturn();

        assertEquals("Incorrect board or password. Please try again.", mvcResult.getResponse().getErrorMessage());
    }

    @Test
    public void loginWithBadTeamNameReturns403() throws Exception {
        MockRestServiceServer server = MockRestServiceServer.bindTo(restTemplate).build();
        server.expect(once(), requestTo("http://captcha.url")).andRespond(withSuccess("{\"success\":true}", MediaType.APPLICATION_JSON));

        MvcResult mvcResult = mockMvc.perform(post("/api/team/login")
                .content("{\"name\":\"NOT A TEAM\", \"password\":\"" + VALID_PASSWORD + "\", \"captchaResponse\":\"some captcha\"}")
                .contentType(APPLICATION_JSON))
                .andExpect(status().isForbidden())
                .andReturn();

        assertEquals("Incorrect board name. Please try again.", mvcResult.getResponse().getErrorMessage());
    }

    @Test
    public void loginWithBadPasswordReturns403() throws Exception {
        MockRestServiceServer server = MockRestServiceServer.bindTo(restTemplate).build();
        server.expect(times(2), requestTo("http://captcha.url")).andRespond(withSuccess("{\"success\":true}", MediaType.APPLICATION_JSON));

        RequestedTeam team = new RequestedTeam();
        team.setName("PEACHY BEACHY");
        team.setPassword(VALID_PASSWORD);
        team.setCaptchaResponse("some captcha");

        testRestTemplate.postForObject("/api/team/", team, String.class);

        MvcResult mvcResult = mockMvc.perform(post("/api/team/login")
                .content("{\"name\":\"PEACHY BEACHY\", \"password\":\"wr0ngPassw0rd\", \"captchaResponse\":\"some captcha\"}")
                .contentType(APPLICATION_JSON))
                .andExpect(status().isForbidden())
                .andReturn();

        assertEquals("Incorrect board or password. Please try again.", mvcResult.getResponse().getErrorMessage());
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

    @After
    public void cleanUpTestData() {
        teamRepository.deleteAll();
    }
}
