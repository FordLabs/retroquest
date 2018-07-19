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
    private final TeamRepository teamRepository;
    private final FeedbackRepository feedbackRepository;

    public ApplicationConfig(TeamRepository teamRepository, FeedbackRepository feedbackRepository) {
        this.teamRepository = teamRepository;
        this.feedbackRepository = feedbackRepository;
    }

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder.build();
    }

    @Bean
    public Metrics metrics() {
        return new Metrics(teamRepository, feedbackRepository);
    }
}
