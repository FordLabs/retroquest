package com.ford.labs.retroquest.metrics;

import com.ford.labs.retroquest.feedback.Feedback;
import com.ford.labs.retroquest.feedback.FeedbackRepository;
import com.ford.labs.retroquest.team.TeamRepository;
import org.springframework.jmx.export.annotation.ManagedAttribute;
import org.springframework.jmx.export.annotation.ManagedResource;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.OptionalDouble;

import static java.util.stream.Collectors.toList;

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

    int getFeedbackCount(LocalDate startTime, LocalDate endTime) {
        LocalDateTime finalEndTime = endTime == null ? LocalDateTime.now() : endTime.atStartOfDay();
        LocalDateTime finalStartTime = startTime == null ? LocalDateTime.MIN : startTime.atStartOfDay();
        List<Feedback> feedbackList =  feedbackRepository.findAll().stream()
                .filter(feedback -> !feedback.getDateCreated().isBefore(finalStartTime))
                .filter(feedback -> !feedback.getDateCreated().isAfter(finalEndTime))
                .collect(toList());
        return feedbackList.size();
    }

    @ManagedAttribute
    public double getAverageRating() {
        List<Feedback> allFeedback = feedbackRepository.findAllByStarsIsGreaterThanEqual(1);
        OptionalDouble average = allFeedback.stream().mapToDouble(Feedback::getStars).average();
        return average.isPresent() ? average.getAsDouble() : 0.0;
    }
}