package com.ford.labs.retroquest.api;

import com.ford.labs.retroquest.api.setup.ApiTest;
import com.ford.labs.retroquest.feedback.Feedback;
import com.ford.labs.retroquest.feedback.FeedbackRepository;
import com.ford.labs.retroquest.team.Team;
import com.ford.labs.retroquest.team.TeamRepository;
import org.hamcrest.Matchers;
import org.junit.After;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Base64;

import static java.util.Arrays.asList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class MetricsApiTest extends ApiTest {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @After
    public void teardown() {
        teamRepository.deleteAll();
        feedbackRepository.deleteAll();

        assertThat(teamRepository.count()).isEqualTo(0);
        assertThat(feedbackRepository.count()).isEqualTo(0);
    }

    @Test
    public void canReadTheTotalNumberOfTeamsCreated() throws Exception {
        Team team = new Team();
        String teamUri = "teamUri";
        team.setUri(teamUri);
        team.setDateCreated(LocalDate.now());
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
        feedback.setDateCreated(LocalDateTime.now());
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
        feedback1.setDateCreated(LocalDateTime.now());
        Feedback feedback2 = new Feedback();
        feedback2.setStars(2);
        feedback2.setDateCreated(LocalDateTime.now());
        feedbackRepository.saveAll(asList(feedback1, feedback2));


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
        feedback1.setDateCreated(LocalDateTime.now());
        Feedback feedback2 = new Feedback();
        feedback2.setStars(0);
        feedback2.setDateCreated(LocalDateTime.now());
        feedbackRepository.saveAll(asList(feedback1, feedback2));

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

    @Test
    public void whenGettingTheTotalNumberofReviews_providingOnlyAStartDate_getsAllFromThatDateUntilNow() throws Exception {

        Feedback feedback1 = new Feedback();
        feedback1.setDateCreated(LocalDateTime.of(2018, 1, 1, 1, 1));
        Feedback feedback2 = new Feedback();
        feedback2.setDateCreated(LocalDateTime.of(2018, 3, 3, 3, 3));

        feedbackRepository.saveAll(asList(feedback1, feedback2));

        mockMvc.perform(get("/api/admin/metrics/feedback/count?start=2018-02-02")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", getBasicAuthToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", Matchers.is(1)));
    }

    @Test
    public void whenGettingTheTotalNumberofReviews_providingOnlyAnEndDate_getsAllFromNowToThatDate() throws Exception {

        Feedback feedback1 = new Feedback();
        feedback1.setDateCreated(LocalDateTime.of(2018, 1, 1, 1, 1));
        Feedback feedback2 = new Feedback();
        feedback2.setDateCreated(LocalDateTime.of(2018, 3, 3, 3, 3));

        feedbackRepository.saveAll(asList(feedback1, feedback2));

        mockMvc.perform(get("/api/admin/metrics/feedback/count?end=2018-02-02")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", getBasicAuthToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", Matchers.is(1)));
    }

    @Test
    public void whenGettingTheTotalNumberofReviews_providingOnlyStartAndEndDate_getsAllBetweenThoseDates() throws Exception {

        Feedback feedback1 = new Feedback();
        feedback1.setDateCreated(LocalDateTime.of(2018, 4, 1, 1, 1));
        Feedback feedback2 = new Feedback();
        feedback2.setDateCreated(LocalDateTime.of(2018, 10, 31, 1, 1));
        Feedback feedback3 = new Feedback();
        feedback3.setDateCreated(LocalDateTime.of(2018, 12, 25, 1, 1));

        feedbackRepository.saveAll(asList(feedback1, feedback2, feedback3));

        mockMvc.perform(get("/api/admin/metrics/feedback/count?start=2018-05-01&end=2018-12-01")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", getBasicAuthToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", Matchers.is(1)));
    }

    @Test
    public void whenGettingTheAverageRating_providingAStartAndEndDate_getsTheBetweenDates() throws Exception {

        Feedback feedback1 = new Feedback();
        feedback1.setDateCreated(LocalDateTime.of(2018, 4, 1, 1, 1));
        feedback1.setStars(1);
        Feedback feedback2 = new Feedback();
        feedback2.setDateCreated(LocalDateTime.of(2018, 10, 31, 1, 1));
        feedback2.setStars(2);
        Feedback feedback3 = new Feedback();
        feedback3.setDateCreated(LocalDateTime.of(2018, 12, 25, 1, 1));
        feedback3.setStars(1);

        feedbackRepository.saveAll(asList(feedback1, feedback2, feedback3));

        mockMvc.perform(get("/api/admin/metrics/feedback/average?start=2018-05-01&end=2018-12-01")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", getBasicAuthToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", Matchers.is(2.0)));
    }

    @Test
    public void whenGettingTheAverageRating_providingOnlyAStartDate_getsAllFromThatDateUntilNow() throws Exception {

        Feedback feedback1 = new Feedback();
        feedback1.setDateCreated(LocalDateTime.of(2018, 1, 1, 1, 1));
        feedback1.setStars(1);
        Feedback feedback2 = new Feedback();
        feedback2.setDateCreated(LocalDateTime.of(2018, 3, 3, 3, 3));
        feedback2.setStars(3);

        feedbackRepository.saveAll(asList(feedback1, feedback2));

        mockMvc.perform(get("/api/admin/metrics/feedback/average?start=2018-02-02")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", getBasicAuthToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", Matchers.is(3.0)));
    }

    @Test
    public void whenGettingTheAverageRating_providingOnlyAnEndDate_getsAllFromNowToThatDate() throws Exception {

        Feedback feedback1 = new Feedback();
        feedback1.setStars(3);
        feedback1.setDateCreated(LocalDateTime.of(2018, 1, 1, 1, 1));
        Feedback feedback2 = new Feedback();
        feedback2.setStars(1);
        feedback2.setDateCreated(LocalDateTime.of(2018, 3, 3, 3, 3));

        feedbackRepository.saveAll(asList(feedback1, feedback2));

        mockMvc.perform(get("/api/admin/metrics/feedback/average?end=2018-02-02")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", getBasicAuthToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", Matchers.is(3.0)));
    }

    @Test
    public void whenGettingTeamCount_providingOnlyAStartDate_getsAllFromNowToThatDate() throws Exception {

        Team team1 = new Team();
        team1.setUri("team" + LocalDate.now().toEpochDay());
        team1.setDateCreated(LocalDate.of(2018, 2, 2));
        Team team2 = new Team();
        team2.setUri("team" + (LocalDate.now().toEpochDay() + 1));
        team2.setDateCreated(LocalDate.of(2018, 4, 4));
        teamRepository.saveAll(asList(team1, team2));

        mockMvc.perform(get("/api/admin/metrics/team/count?start=2018-03-03")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", getBasicAuthToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", Matchers.is(1)));
    }

    @Test
    public void whenGettingTeamLogins_providingOnlyAStartDate_getsAllFromThenToNow() throws Exception {
        Team team1 = new Team();
        team1.setUri("teamLoginOnlyStartDate1");
        team1.setLastLoginDate(LocalDate.of(2018, 1, 1));
        Team team2 = new Team();
        team2.setUri("teamLoginOnlyStartDate2");
        team2.setLastLoginDate(LocalDate.of(2018, 3, 3));
        teamRepository.saveAll(asList(team1, team2));

        mockMvc.perform(get("/api/admin/metrics/team/logins?start=2018-02-02")
                .header("Authorization", getBasicAuthToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", Matchers.is(1)));
    }

    @Test
    public void whenGettingTeamLogins_providingOnlyAnEndDate_getsAllFromTheBegginingOfTimeToThatDate() throws Exception {
        Team team1 = new Team();
        team1.setUri("teamLoginsOnlyEndDate1");
        team1.setLastLoginDate(LocalDate.of(2018, 1, 1));
        Team team2 = new Team();
        team2.setUri("teamLoginsOnlyEndDate2");
        team2.setLastLoginDate(LocalDate.of(2018, 3, 3));
        teamRepository.saveAll(asList(team1, team2));

        mockMvc.perform(get("/api/admin/metrics/team/logins?end=2018-02-02")
                .header("Authorization", getBasicAuthToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", Matchers.is(1)));
    }

    @Test
    public void whenGettingTeamLogins_providingAStartAndEndDate_getsAllBetweenThem() throws Exception {
        Team team1 = new Team();
        team1.setUri("teamLoginStartAndEndDate1");
        team1.setName("teamLoginStartAndEndDate1");
        team1.setLastLoginDate(LocalDate.of(2018, 1, 1));
        Team team2 = new Team();
        team2.setUri("teamLoginStartAndEndDate2");
        team2.setName("teamLoginStartAndEndDate2");
        team2.setLastLoginDate(LocalDate.of(2018, 3, 3));
        Team team3 = new Team();
        team3.setUri("teamLoginStartAndEndDate3");
        team3.setName("teamLoginStartAndEndDate3");
        team3.setLastLoginDate(LocalDate.of(2018, 5, 5));
        teamRepository.saveAll(asList(team1, team2, team3));

        mockMvc.perform(get("/api/admin/metrics/team/logins?start=2018-02-02&end=2018-04-04")
                .header("Authorization", getBasicAuthToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", Matchers.is(1)));
    }

    private String getToken(String adminUsername, String adminPassword) {
        return Base64.getEncoder().encodeToString((adminUsername + ":" + adminPassword).getBytes());
    }
}
