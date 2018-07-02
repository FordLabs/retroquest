package com.ford.labs.retroquest.api;

import com.ford.labs.retroquest.MainApplication;
import com.ford.labs.retroquest.security.JwtBuilder;
import com.ford.labs.retroquest.team.RequestedTeam;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.Assert.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = {MainApplication.class})
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class TeamRetroDownloadTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private JwtBuilder jwtBuilder;

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void canRetrieveCsvOfActionItemsAndThoughts() throws Exception {
        RequestedTeam teamEntity = new RequestedTeam();
        teamEntity.setName("Beach Bums");
        teamEntity.setPassword("password");

        restTemplate.postForObject("/api/team/", teamEntity, String.class);

        MvcResult response = mockMvc.perform(get("/api/team/beach-bums/csv")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("beach-bums")))
                .andReturn();

        assertEquals(200, response.getResponse().getStatus());
    }

    @Test
    public void cannotDownloadRetroIfNotAuthorizedForBoard() throws Exception {
        RequestedTeam teamEntity = new RequestedTeam();
        teamEntity.setName("Beach Bums");
        teamEntity.setPassword("password");

        restTemplate.postForObject("/api/team/", teamEntity, String.class);

        mockMvc.perform(get("/api/team/beach-bums/csv")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("not-beach-bums")))
                .andExpect(status().isForbidden());
    }

}
