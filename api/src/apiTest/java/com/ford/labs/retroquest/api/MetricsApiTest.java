package com.ford.labs.retroquest.api;

import com.ford.labs.retroquest.feedback.Feedback;
import com.ford.labs.retroquest.feedback.FeedbackRepository;
import com.ford.labs.retroquest.team.Team;
import com.ford.labs.retroquest.team.TeamRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.AbstractTransactionalJUnit4SpringContextTests;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Base64;

import static java.util.Arrays.asList;
import static org.junit.Assert.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
public class MetricsApiTest extends AbstractTransactionalJUnit4SpringContextTests {

    @Value("${com.retroquest.adminUsername}")
    private String adminUsername;

    @Value("${com.retroquest.adminPassword}")
    private String adminPassword;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Test
    public void canReadTheTotalNumberOfTeamsCreated() throws Exception {
        String token = getToken(adminUsername, adminPassword);

        Team team = new Team();
        String teamUri = "teamUri";
        team.setUri(teamUri);
        teamRepository.save(team);

        MvcResult result = mockMvc.perform(get("/api/admin/metrics/team/count")
                .header("Authorization", "Basic " + token))
            .andExpect(status().isOk())
            .andReturn();
        assertEquals("1", result.getResponse().getContentAsString());
    }

    @Test
    public void cannotReadTheTotalNumberOfTeamsWithoutAuthorization() throws Exception {
        String token = getToken("notAdmin", "notAdminPassword");
        mockMvc.perform(get("/api/admin/metrics/team/count")
                .header("Authorization", "Basic " + token))
            .andExpect(status().isUnauthorized());
    }

    @Test
    public void canGetFeedbackCount() throws Exception {
        String token = getToken(adminUsername, adminPassword);

        Feedback feedback = new Feedback();
        feedbackRepository.save(feedback);

        MvcResult result = mockMvc.perform(get("/api/admin/metrics/feedback/count")
                .header("Authorization", "Basic " + token))
            .andExpect(status().isOk())
            .andReturn();
        assertEquals("1", result.getResponse().getContentAsString());
    }

    @Test
    public void cannotGetFeedbackWithoutAuthorization() throws Exception {
        String token = getToken("notAdmin", "notAdminPassword");
        mockMvc.perform(get("/api/admin/metrics/feedback/count")
                .header("Authorization", "Basic " + token))
            .andExpect(status().isUnauthorized());
    }

    @Test
    public void canGetAverageFeedbackAverageAsAdmin() throws Exception {

        Feedback feedback1 = new Feedback();
        feedback1.setStars(4);
        Feedback feedback2 = new Feedback();
        feedback2.setStars(2);
        feedbackRepository.save(asList(feedback1, feedback2));

        String token = getToken(adminUsername, adminPassword);

        MvcResult result = mockMvc.perform(get("/api/admin/metrics/feedback/average")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Basic " + token))
                .andExpect(status().isOk())
                .andReturn();
        assertEquals("3.0", result.getResponse().getContentAsString());
    }

    @Test
    public void cannotGetAverageFeedbackAsUserThatIsNotAdmin() throws Exception {
        String token = getToken("notadmin", "notadminpassword");
        mockMvc.perform(get("/api/metrics/admin/feedback/adverage")
                .header("Authorization", "Basic " + token))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void averageFeedbackIgnoresStartsWithAZeroValue() throws Exception {

        Feedback feedback1 = new Feedback();
        feedback1.setStars(4);
        Feedback feedback2 = new Feedback();
        feedback2.setStars(0);
        feedbackRepository.save(asList(feedback1, feedback2));

        String token = getToken(adminUsername, adminPassword);

        MvcResult result = mockMvc.perform(get("/api/admin/metrics/feedback/average")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Basic " + token))
                .andExpect(status().isOk())
                .andReturn();
        assertEquals("4.0", result.getResponse().getContentAsString());
    }

    private String getToken(String adminUsername, String adminPassword) {
        return Base64.getEncoder().encodeToString((adminUsername + ":"+ adminPassword).getBytes());
    }
}
