package com.ford.labs.retroquest.api;

import org.junit.Test;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class AdminFeedbackControllerTest extends ControllerTest {

    @Test
    public void shouldReturnSuccessfullyWithABasicAuthToken() throws Exception {
        mockMvc.perform(
                get("/api/admin/feedback/all")
                        .header("Authorization", getBasicAuthToken())

        )
                .andExpect(status().isOk())
                .andReturn();
    }

    @Test
    public void shouldReturnAnUnauthorizedStatusWithNoBasicAuthToken() throws Exception {
        mockMvc.perform(
                get("/api/admin/feedback/all")

        )
                .andExpect(status().isUnauthorized())
                .andReturn();
    }
}