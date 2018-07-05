package com.ford.labs.retroquest.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ford.labs.retroquest.feedback.Feedback;
import com.ford.labs.retroquest.feedback.FeedbackRepository;
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

import java.util.Base64;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
public class FeedbackApiTest extends AbstractTransactionalJUnit4SpringContextTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private FeedbackRepository feedbackRepository;

    private ObjectMapper mapper = new ObjectMapper();

    @Value("${com.retroquest.adminUsername}")
    private String adminUsername;

    @Value("${com.retroquest.adminPassword}")
    private String adminPassword;

    @Test
    public void canGetAllTheFeedbackAsAdmin() throws Exception {
        Feedback feedback = new Feedback();
        feedbackRepository.save(feedback);

        int size = feedbackRepository.findAll().size();

        String token = Base64.getEncoder().encodeToString((adminUsername + ":"+ adminPassword).getBytes());

        mockMvc.perform(get("/api/feedback/all").contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", "Basic " + token)).andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(size)));
    }

    @Test
    public void cannotGetFeedbackWithoutAuth() throws Exception {
        Feedback feedback = new Feedback();
        feedbackRepository.save(feedback);

        int size = feedbackRepository.findAll().size();

        String token = Base64.getEncoder().encodeToString("notadmin:pass".getBytes());

        mockMvc.perform(get("/api/feedback/all").contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Basic " + token))
                .andExpect(status().isUnauthorized());
    }
}