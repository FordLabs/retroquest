package com.ford.labs.retroquest.api;

import com.ford.labs.retroquest.security.JwtBuilder;
import com.ford.labs.retroquest.team.LoginRequest;
import com.ford.labs.retroquest.team.TeamRepository;
import org.junit.After;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.Assert.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class TeamRetroDownloadTest extends ControllerTest {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private JwtBuilder jwtBuilder;

    @Test
    public void canRetrieveCsvOfActionItemsAndThoughts() throws Exception {
        LoginRequest teamEntity = new LoginRequest();
        teamEntity.setName(teamId);
        teamEntity.setPassword("password");

        restTemplate.postForObject("/api/team/", teamEntity, String.class);

        MvcResult response = mockMvc.perform(get("/api/team/" + teamId + "/csv")
                .header("Authorization", getBearerAuthToken()))
                .andReturn();

        assertEquals(200, response.getResponse()
                .getStatus());
    }

    @Test
    public void cannotDownloadRetroIfNotAuthorizedForBoard() throws Exception {
        LoginRequest teamEntity = new LoginRequest();
        teamEntity.setName(teamId);
        teamEntity.setPassword("password");

        restTemplate.postForObject("/api/team/", teamEntity, String.class);

        mockMvc.perform(get("/api/team/" + teamId + "/csv")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("not-beach-bums")))
                .andExpect(status().isForbidden());
    }

    @After
    public void cleanUpTestData() {
        teamRepository.deleteAll();
    }

}
