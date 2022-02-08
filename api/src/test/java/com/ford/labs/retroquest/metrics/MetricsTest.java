package com.ford.labs.retroquest.metrics;

import com.ford.labs.retroquest.feedback.Feedback;
import com.ford.labs.retroquest.feedback.FeedbackRepository;
import com.ford.labs.retroquest.metrics.Metrics;
import com.ford.labs.retroquest.team.Team;
import com.ford.labs.retroquest.team.TeamRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.support.AnnotationConfigContextLoader;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class MetricsTest {

    @Autowired
    TeamRepository teamRepository;

    @Autowired
    FeedbackRepository feedbackRepository;

    @Autowired
    Metrics metrics;

    @BeforeEach
    void setup() {
        teamRepository.deleteAll();
        feedbackRepository.deleteAll();
    }

    @Test
    public void getTeamCount_ReturnsNumberOfTeamsCreated() {
        var teamBuilder = new Team().toBuilder();
        teamRepository.save(teamBuilder.lastLoginDate(LocalDate.now()).uri("something").build());
        teamRepository.save(teamBuilder.lastLoginDate(LocalDate.now().minus(Period.ofMonths(4))).uri("somethingelse").build());
        assertThat(metrics.getTeamCount()).isEqualTo(2);
    }

    @Test
    void getTeamLogins_whenGivenBothAStartAndEndDate_passesDatesToRepository() {
        var teamBuilder = new Team().toBuilder();
        teamRepository.save(teamBuilder.lastLoginDate(LocalDate.now()).uri("something").build());
        teamRepository.save(teamBuilder.lastLoginDate(LocalDate.now().minus(Period.ofMonths(4))).uri("somethingelse").build());
        assertThat(metrics.getActiveTeams()).isEqualTo(1);
    }

    @Test
    public void getFeedbackCount_ReturnsAmountOfFeedbackSubmitted() {
        feedbackRepository.saveAll(List.of(
            Feedback.builder().stars(5).build(),
            Feedback.builder().stars(5).build()
        ));
        assertThat(metrics.getFeedbackCount()).isEqualTo(2);
    }

    @Test
    public void getAverageRating_ReturnsAverageOfFeedbackStars() {
        feedbackRepository.saveAll(List.of(
                Feedback.builder().stars(2).build(),
                Feedback.builder().stars(4).build()
        ));
        assertThat(metrics.getAverageRating()).isEqualTo(3.0);
    }

    @Test
    public void getAverageRating_WithNoFeedback_ReturnsZero() {
        assertThat(metrics.getAverageRating()).isEqualTo(0.0);
    }
}
