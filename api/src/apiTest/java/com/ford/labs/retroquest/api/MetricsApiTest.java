package com.ford.labs.retroquest.api;

import com.ford.labs.retroquest.feedback.Feedback;
import com.ford.labs.retroquest.feedback.FeedbackRepository;
import com.ford.labs.retroquest.team.Team;
import com.ford.labs.retroquest.team.TeamRepository;
import org.junit.After;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Base64;

import static java.util.Arrays.asList;
import static org.junit.Assert.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class MetricsApiTest extends ControllerTest {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Test
    public void canReadTheTotalNumberOfTeamsCreated() throws Exception {
        Team team = new Team();
        String teamUri = "teamUri";
        team.setUri(teamUri);
        teamRepository.save(team);

        MvcResult result = mockMvc.perform(get("/api/admin/metrics/team/count")
                .header("Authorization", getBasicAuthToken()))
            .andExpect(status().isOk())
            .andReturn();
        assertEquals("1", result.getResponse().getContentAsString());
    }

    @Test
    public void cannotReadTheTotalNumberOfTeamsWithInvalidAuthorization() throws Exception {
        String token = getToken("notAdmin", "notAdminPassword");
        mockMvc.perform(get("/api/admin/metrics/team/count")
                .header("Authorization", "Basic " + token))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void cannotReadTheTotalNumberOfTeamsWithoutAuthorization() throws Exception {
        mockMvc.perform(get("/api/admin/metrics/team/count"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void canGetFeedbackCount() throws Exception {

        Feedback feedback = new Feedback();
        feedbackRepository.save(feedback);

        MvcResult result = mockMvc.perform(get("/api/admin/metrics/feedback/count")
                .header("Authorization", getBasicAuthToken()))
                .andExpect(status().isOk())
                .andReturn();
        assertEquals("1", result.getResponse().getContentAsString());
    }

    @Test
    public void cannotGetFeedbackWithInvalidAuthorization() throws Exception {
        String token = getToken("notAdmin", "notAdminPassword");
        mockMvc.perform(get("/api/admin/metrics/feedback/count")
                .header("Authorization", "Basic " + token))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void cannotGetFeedbackWithoutAuthorization() throws Exception {
        mockMvc.perform(get("/api/admin/metrics/feedback/count"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void canGetAverageRatingAsAdmin() throws Exception {

        Feedback feedback1 = new Feedback();
        feedback1.setStars(4);
        Feedback feedback2 = new Feedback();
        feedback2.setStars(2);
        feedbackRepository.save(asList(feedback1, feedback2));


        MvcResult result = mockMvc.perform(get("/api/admin/metrics/feedback/average")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", getBasicAuthToken()))
                .andExpect(status().isOk())
                .andReturn();
        assertEquals("3.0", result.getResponse().getContentAsString());
    }

    @Test
    public void averageRatingIgnoresStarsWithAZeroValue() throws Exception {

        Feedback feedback1 = new Feedback();
        feedback1.setStars(4);
        Feedback feedback2 = new Feedback();
        feedback2.setStars(0);
        feedbackRepository.save(asList(feedback1, feedback2));

        MvcResult result = mockMvc.perform(get("/api/admin/metrics/feedback/average")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", getBasicAuthToken()))
                .andExpect(status().isOk())
                .andReturn();

        assertEquals("4.0", result.getResponse().getContentAsString());
    }

    @Test
    public void cannotGetAverageRatingWithInvalidAuthorization() throws Exception {
        String token = getToken("notadmin", "notadminpassword");
        mockMvc.perform(get("/api/admin/metrics/feedback/average")
                .header("Authorization", "Basic " + token))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void cannotGetAverageRatingWithoutAuthorization() throws Exception {
        mockMvc.perform(get("/api/admin/metrics/feedback/average"))
                .andExpect(status().isUnauthorized());
    }

    private String getToken(String adminUsername, String adminPassword) {
        return Base64.getEncoder().encodeToString((adminUsername + ":"+ adminPassword).getBytes());
    }

    @After
    public void cleanUpTestData() {
        teamRepository.deleteAll();
        feedbackRepository.deleteAll();
    }
}
