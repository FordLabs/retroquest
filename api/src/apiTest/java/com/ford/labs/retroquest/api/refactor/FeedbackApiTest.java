package com.ford.labs.retroquest.api.refactor;

import com.ford.labs.retroquest.api.refactor.setup.ApiTest;
import com.ford.labs.retroquest.feedback.Feedback;
import com.ford.labs.retroquest.feedback.FeedbackRepository;
import org.junit.After;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;

import java.util.Base64;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class FeedbackApiTest extends ApiTest {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @After
    public void tearDown() {
        feedbackRepository.deleteAll();
        assertThat(feedbackRepository.count()).isEqualTo(0);
    }

    @Test
    public void should_get_all_feedback_as_an_admin() throws Exception {
        feedbackRepository.save(Feedback.builder().build());

        mockMvc.perform(
                get("/api/admin/feedback/all")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", getBasicAuthToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    public void should_not_get_all_feedback_being_unauthorized() throws Exception {
        final String token = Base64.getEncoder().encodeToString("notadmin:pass".getBytes());

        mockMvc.perform(get("/api/admin/feedback/all").contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Basic " + token))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void should_not_get_all_feedback_without_basic_auth_token() throws Exception {
        mockMvc.perform(get("/api/admin/feedback/all")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }
}