package com.ford.labs.retroquest.api;

import com.ford.labs.retroquest.api.setup.ApiTest;
import com.ford.labs.retroquest.team.LoginRequest;
import com.ford.labs.retroquest.team.TeamRepository;
import org.junit.After;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class DownloadTeamBoardApiTest extends ApiTest {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private TestRestTemplate restTemplate;

    private LoginRequest loginRequest = LoginRequest.builder().name(teamId).password("password").build();

    @After
    public void teardown() {
        teamRepository.deleteAll();
        assertThat(teamRepository.count()).isEqualTo(0);
    }

    @Test
    public void should_get_csv_with_thoughts_and_action_items() throws Exception {

        restTemplate.postForObject("/api/team/", loginRequest, String.class);

        mockMvc.perform(get("/api/team/" + teamId + "/csv")
                .header("Authorization", getBearerAuthToken()))
                .andExpect(status().isOk());
    }

    @Test
    public void should_not_get_csv_unauthorized() throws Exception {

        restTemplate.postForObject("/api/team/", loginRequest, String.class);

        mockMvc.perform(get("/api/team/" + teamId + "/csv")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("not-beach-bums")))
                .andExpect(status().isForbidden());
    }

}
