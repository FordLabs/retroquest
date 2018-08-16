package com.ford.labs.retroquest.api;

import com.ford.labs.retroquest.feedback.Feedback;
import com.ford.labs.retroquest.feedback.FeedbackRepository;
import org.junit.After;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;

import java.util.Base64;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class FeedbackApiTest extends ControllerTest {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @After
    public void tearDown() {
        feedbackRepository.deleteAll();
    }

    @Test
    public void canGetAllTheFeedbackAsAdmin() throws Exception {
        Feedback feedback = new Feedback();
        feedbackRepository.save(feedback);

        final int size = feedbackRepository.findAll().size();

        mockMvc.perform(
                get("/api/admin/feedback/all").contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", getBasicAuthToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(size)));
    }

    @Test
    public void cannotGetFeedbackWithBadAuth() throws Exception {
        final String token = Base64.getEncoder().encodeToString("notadmin:pass".getBytes());

        mockMvc.perform(get("/api/admin/feedback/all").contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Basic " + token))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void cannotGetFeedbackWithNoAuth() throws Exception {

        mockMvc.perform(get("/api/admin/feedback/all")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }
}