/*
 * Copyright (c) 2021 Ford Motor Company
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.ford.labs.retroquest.api;

import com.ford.labs.retroquest.api.setup.ApiTestBase;
import com.ford.labs.retroquest.feedback.Feedback;
import com.ford.labs.retroquest.feedback.FeedbackRepository;
import com.ford.labs.retroquest.team.Team;
import com.ford.labs.retroquest.team.TeamRepository;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static java.util.Arrays.asList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Tag("api")
class MetricsApiTest extends ApiTestBase {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @AfterEach
    void teardown() {
        teamRepository.deleteAllInBatch();
        feedbackRepository.deleteAllInBatch();
    }

    @Test
    void canReadTheTotalNumberOfTeamsCreated() throws Exception {
        Team team = new Team();
        String teamUri = "teamUri";
        team.setUri(teamUri);
        team.setDateCreated(LocalDate.now());
        teamRepository.save(team);

        MvcResult result = mockMvc.perform(get("/api/admin/metrics/team/count")
            .with(httpBasic(getAdminUsername(), getAdminPassword())))
            .andExpect(status().isOk())
            .andReturn();
        assertThat(result.getResponse().getContentAsString()).isEqualTo("1");
    }

    @Test
    void cannotReadTheTotalNumberOfTeamsWithInvalidAuthorization() throws Exception {
        mockMvc.perform(get("/api/admin/metrics/team/count")
            .with(httpBasic("foo", "bar")))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void cannotReadTheTotalNumberOfTeamsWithoutAuthorization() throws Exception {
        mockMvc.perform(get("/api/admin/metrics/team/count"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void canGetFeedbackCount() throws Exception {
        Feedback feedback = new Feedback();
        feedback.setDateCreated(LocalDateTime.now());
        feedbackRepository.save(feedback);

        MvcResult result = mockMvc.perform(get("/api/admin/metrics/feedback/count")
                .with(httpBasic(getAdminUsername(), getAdminPassword())))
                .andExpect(status().isOk())
                .andReturn();
        assertThat(result.getResponse().getContentAsString()).isEqualTo("1");
    }

    @Test
    void cannotGetFeedbackWithInvalidAuthorization() throws Exception {
        mockMvc.perform(get("/api/admin/metrics/feedback/count")
            .with(httpBasic("foo", "bar")))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void cannotGetFeedbackWithoutAuthorization() throws Exception {
        mockMvc.perform(get("/api/admin/metrics/feedback/count"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void canGetAverageRatingAsAdmin() throws Exception {
        Feedback feedback1 = new Feedback();
        feedback1.setStars(4);
        feedback1.setDateCreated(LocalDateTime.now());
        Feedback feedback2 = new Feedback();
        feedback2.setStars(2);
        feedback2.setDateCreated(LocalDateTime.now());
        feedbackRepository.saveAll(asList(feedback1, feedback2));


        MvcResult result = mockMvc.perform(get("/api/admin/metrics/feedback/average")
            .contentType(MediaType.APPLICATION_JSON)
            .with(httpBasic(getAdminUsername(), getAdminPassword())))
            .andExpect(status().isOk())
            .andReturn();
        assertThat(result.getResponse().getContentAsString()).isEqualTo("3.0");
    }

    @Test
    void averageRatingIgnoresStarsWithAZeroValue() throws Exception {

        Feedback feedback1 = new Feedback();
        feedback1.setStars(4);
        feedback1.setDateCreated(LocalDateTime.now());
        Feedback feedback2 = new Feedback();
        feedback2.setStars(0);
        feedback2.setDateCreated(LocalDateTime.now());
        feedbackRepository.saveAll(asList(feedback1, feedback2));

        MvcResult result = mockMvc.perform(get("/api/admin/metrics/feedback/average")
            .contentType(MediaType.APPLICATION_JSON)
            .with(httpBasic(getAdminUsername(), getAdminPassword())))
            .andExpect(status().isOk())
            .andReturn();

        assertThat(result.getResponse().getContentAsString()).isEqualTo("4.0");
    }

    @Test
    void cannotGetAverageRatingWithInvalidAuthorization() throws Exception {
        mockMvc.perform(get("/api/admin/metrics/feedback/average")
            .with(httpBasic("foo", "bar")))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void cannotGetAverageRatingWithoutAuthorization() throws Exception {
        mockMvc.perform(get("/api/admin/metrics/feedback/average"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void whenGettingTheTotalNumberOfReviews_providingOnlyAStartDate_getsAllFromThatDateUntilNow() throws Exception {

        Feedback feedback1 = new Feedback();
        feedback1.setDateCreated(LocalDateTime.of(2018, 1, 1, 1, 1));
        Feedback feedback2 = new Feedback();
        feedback2.setDateCreated(LocalDateTime.of(2018, 3, 3, 3, 3));

        feedbackRepository.saveAll(asList(feedback1, feedback2));

        mockMvc.perform(get("/api/admin/metrics/feedback/count?start=2018-02-02")
            .contentType(MediaType.APPLICATION_JSON)
            .with(httpBasic(getAdminUsername(), getAdminPassword())))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", Matchers.is(1)));
    }

    @Test
    void whenGettingTheTotalNumberOfReviews_providingOnlyAnEndDate_getsAllFromNowToThatDate() throws Exception {

        Feedback feedback1 = new Feedback();
        feedback1.setDateCreated(LocalDateTime.of(2018, 1, 1, 1, 1));
        Feedback feedback2 = new Feedback();
        feedback2.setDateCreated(LocalDateTime.of(2018, 3, 3, 3, 3));

        feedbackRepository.saveAll(asList(feedback1, feedback2));

        mockMvc.perform(get("/api/admin/metrics/feedback/count?end=2018-02-02")
            .contentType(MediaType.APPLICATION_JSON)
            .with(httpBasic(getAdminUsername(), getAdminPassword())))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", Matchers.is(1)));
    }

    @Test
    void whenGettingTheTotalNumberOfReviews_providingOnlyStartAndEndDate_getsAllBetweenThoseDates() throws Exception {

        Feedback feedback1 = new Feedback();
        feedback1.setDateCreated(LocalDateTime.of(2018, 4, 1, 1, 1));
        Feedback feedback2 = new Feedback();
        feedback2.setDateCreated(LocalDateTime.of(2018, 10, 31, 1, 1));
        Feedback feedback3 = new Feedback();
        feedback3.setDateCreated(LocalDateTime.of(2018, 12, 25, 1, 1));

        feedbackRepository.saveAll(asList(feedback1, feedback2, feedback3));

        mockMvc.perform(get("/api/admin/metrics/feedback/count?start=2018-05-01&end=2018-12-01")
            .contentType(MediaType.APPLICATION_JSON)
            .with(httpBasic(getAdminUsername(), getAdminPassword())))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", Matchers.is(1)));
    }

    @Test
    void whenGettingTheAverageRating_providingAStartAndEndDate_getsTheBetweenDates() throws Exception {

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
            .with(httpBasic(getAdminUsername(), getAdminPassword())))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", Matchers.is(2.0)));
    }

    @Test
    void whenGettingTheAverageRating_providingOnlyAStartDate_getsAllFromThatDateUntilNow() throws Exception {

        Feedback feedback1 = new Feedback();
        feedback1.setDateCreated(LocalDateTime.of(2018, 1, 1, 1, 1));
        feedback1.setStars(1);
        Feedback feedback2 = new Feedback();
        feedback2.setDateCreated(LocalDateTime.of(2018, 3, 3, 3, 3));
        feedback2.setStars(3);

        feedbackRepository.saveAll(asList(feedback1, feedback2));

        mockMvc.perform(get("/api/admin/metrics/feedback/average?start=2018-02-02")
            .contentType(MediaType.APPLICATION_JSON)
            .with(httpBasic(getAdminUsername(), getAdminPassword())))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", Matchers.is(3.0)));
    }

    @Test
    void whenGettingTheAverageRating_providingOnlyAnEndDate_getsAllFromNowToThatDate() throws Exception {

        Feedback feedback1 = new Feedback();
        feedback1.setStars(3);
        feedback1.setDateCreated(LocalDateTime.of(2018, 1, 1, 1, 1));
        Feedback feedback2 = new Feedback();
        feedback2.setStars(1);
        feedback2.setDateCreated(LocalDateTime.of(2018, 3, 3, 3, 3));

        feedbackRepository.saveAll(asList(feedback1, feedback2));

        mockMvc.perform(get("/api/admin/metrics/feedback/average?end=2018-02-02")
            .contentType(MediaType.APPLICATION_JSON)
            .with(httpBasic(getAdminUsername(), getAdminPassword())))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", Matchers.is(3.0)));
    }

    @Test
    void whenGettingTeamCount_providingOnlyAStartDate_getsAllFromNowToThatDate() throws Exception {

        Team team1 = new Team();
        team1.setUri("team" + LocalDate.now().toEpochDay());
        team1.setDateCreated(LocalDate.of(2018, 2, 2));
        Team team2 = new Team();
        team2.setUri("team" + (LocalDate.now().toEpochDay() + 1));
        team2.setDateCreated(LocalDate.of(2018, 4, 4));
        teamRepository.saveAll(asList(team1, team2));

        mockMvc.perform(get("/api/admin/metrics/team/count?start=2018-03-03")
            .contentType(MediaType.APPLICATION_JSON)
            .with(httpBasic(getAdminUsername(), getAdminPassword())))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", Matchers.is(1)));
    }

    @Test
    void whenGettingTeamLogins_providingOnlyAStartDate_getsAllFromThenToNow() throws Exception {
        Team team1 = new Team();
        team1.setUri("teamLoginOnlyStartDate1");
        team1.setLastLoginDate(LocalDate.of(2018, 1, 1));
        Team team2 = new Team();
        team2.setUri("teamLoginOnlyStartDate2");
        team2.setLastLoginDate(LocalDate.of(2018, 3, 3));
        teamRepository.saveAll(asList(team1, team2));

        mockMvc.perform(get("/api/admin/metrics/team/logins?start=2018-02-02")
            .with(httpBasic(getAdminUsername(), getAdminPassword())))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", Matchers.is(1)));
    }

    @Test
    void whenGettingTeamLogins_providingOnlyAnEndDate_getsAllFromTheBeginningOfTimeToThatDate() throws Exception {
        Team team1 = new Team();
        team1.setUri("teamLoginsOnlyEndDate1");
        team1.setLastLoginDate(LocalDate.of(2018, 1, 1));
        Team team2 = new Team();
        team2.setUri("teamLoginsOnlyEndDate2");
        team2.setLastLoginDate(LocalDate.of(2018, 3, 3));
        teamRepository.saveAll(asList(team1, team2));

        mockMvc.perform(get("/api/admin/metrics/team/logins?end=2018-02-02")
            .with(httpBasic(getAdminUsername(), getAdminPassword())))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", Matchers.is(1)));
    }

    @Test
    void whenGettingTeamLogins_providingAStartAndEndDate_getsAllBetweenThem() throws Exception {
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

        mockMvc.perform(
            get("/api/admin/metrics/team/logins?start=2018-02-02&end=2018-04-04")
                .with(httpBasic(getAdminUsername(), getAdminPassword())))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", Matchers.is(1)));
    }
}
