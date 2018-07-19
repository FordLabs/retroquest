package com.ford.labs.retroquest.metrics;

import com.ford.labs.retroquest.feedback.Feedback;
import com.ford.labs.retroquest.feedback.FeedbackRepository;
import com.ford.labs.retroquest.team.TeamRepository;
import org.springframework.jmx.export.annotation.ManagedAttribute;
import org.springframework.jmx.export.annotation.ManagedResource;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;
import java.util.OptionalDouble;

@ManagedResource
public class Metrics {
    private final TeamRepository teamRepository;
    private final FeedbackRepository feedbackRepository;

    public Metrics(TeamRepository teamRepository, FeedbackRepository feedbackRepository) {
        this.teamRepository = teamRepository;
        this.feedbackRepository = feedbackRepository;
    }

    @ManagedAttribute
    public int getTeamCount() {
        return teamRepository.findAll().size();
    }

    @ManagedAttribute
    public int getFeedbackCount() {
        return feedbackRepository.findAll().size();
    }

    @ManagedAttribute
    public double getAverageRating() {
        List<Feedback> allFeedback = feedbackRepository.findAllByStarsIsGreaterThanEqual(1);
        OptionalDouble average = allFeedback.stream().mapToDouble(Feedback::getStars).average();
        return average.isPresent() ? average.getAsDouble() : 0.0;
    }
}