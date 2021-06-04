package com.ford.labs.retroquest;

import com.ford.labs.retroquest.feedback.FeedbackRepository;
import com.ford.labs.retroquest.metrics.Metrics;
import com.ford.labs.retroquest.team.TeamRepository;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class ApplicationConfig {
    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder.build();
    }

    @Bean
    public Metrics metrics(TeamRepository teamRepository, FeedbackRepository feedbackRepository) {
        return new Metrics(teamRepository, feedbackRepository);
    }
}
