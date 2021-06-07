package com.ford.labs.retroquest.metrics;

import com.ford.labs.retroquest.feedback.FeedbackRepository;
import com.ford.labs.retroquest.team.TeamRepository;
import org.springframework.jmx.export.annotation.ManagedAttribute;
import org.springframework.jmx.export.annotation.ManagedResource;

import java.time.LocalDate;

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
        return getTeamCount(null, null);
    }

    public int getTeamCount(LocalDate startDate, LocalDate endDate) {
        var dateRange = DateTimeRange.fromStartAndEnd(startDate, endDate);

        return (int) teamRepository
            .countAllByDateCreatedBetweenAndDateCreatedNotNull(
                dateRange.getStartDate(),
                dateRange.getEndDate()
            );
    }

    @ManagedAttribute
    public int getFeedbackCount() {
        return getFeedbackCount(null, null);
    }

    public int getFeedbackCount(LocalDate startDate, LocalDate endDate) {
        var dateRange = DateTimeRange.fromStartAndEnd(startDate, endDate);

        return (int) feedbackRepository
            .countByDateCreatedGreaterThanEqualAndDateCreatedLessThanEqual(
                dateRange.getStartDateTime(),
                dateRange.getEndDateTime()
            );
    }

    @ManagedAttribute
    public double getAverageRating() {
        return getAverageRating(null, null);
    }

    public double getAverageRating(LocalDate startDate, LocalDate endDate) {
        var dateRange = DateTimeRange.fromStartAndEnd(startDate, endDate);

        return feedbackRepository
            .getAverageRating(
                dateRange.getStartDateTime(),
                dateRange.getEndDateTime()
            );
    }

    public int getTeamLogins() {
        return getTeamLogins(null, null);
    }

    public int getTeamLogins(LocalDate startDate, LocalDate endDate) {
        var dateRange = DateTimeRange.fromStartAndEnd(startDate, endDate);

        return (int) teamRepository.countByLastLoginDateBetween(
            dateRange.getStartDate(),
            dateRange.getEndDate()
        );
    }
}