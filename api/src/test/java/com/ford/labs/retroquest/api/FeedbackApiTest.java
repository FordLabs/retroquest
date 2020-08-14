package com.ford.labs.retroquest.api;

import com.ford.labs.retroquest.api.setup.ApiTest;
import com.ford.labs.retroquest.feedback.Feedback;
import com.ford.labs.retroquest.feedback.FeedbackRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Tag("api")
public class FeedbackApiTest extends ApiTest {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @AfterEach
    public void tearDown() {
        feedbackRepository.deleteAllInBatch();
        assertThat(feedbackRepository.count()).isZero();
    }

    @Test
    public void should_get_all_feedback_as_an_admin() throws Exception {
        feedbackRepository.save(Feedback.builder().build());

        mockMvc.perform(
                get("/api/admin/feedback/all")
                        .contentType(MediaType.APPLICATION_JSON)
                        .with(httpBasic(getAdminUsername(), getAdminPassword())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    public void should_not_get_all_feedback_being_unauthorized() throws Exception {
        mockMvc.perform(get("/api/admin/feedback/all").contentType(MediaType.APPLICATION_JSON)
                .with(httpBasic("foo", "bar")))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void should_not_get_all_feedback_without_basic_auth_token() throws Exception {
        mockMvc.perform(get("/api/admin/feedback/all")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }
}
