package com.ford.labs.retroquest.metrics;

import com.ford.labs.retroquest.feedback.FeedbackRepository;
import com.ford.labs.retroquest.team.TeamRepository;
import org.springframework.jmx.export.annotation.ManagedAttribute;
import org.springframework.jmx.export.annotation.ManagedResource;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.util.Optional;

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
        return (int) getTeamCount(null, null);
    }

    public long getTeamCount(LocalDate startDate, LocalDate endDate) {
        if (startDate == null && endDate == null) {
            return teamRepository.count();
        } else if (endDate == null) {
            return teamRepository.countAllByDateCreatedAfterAndDateCreatedIsNotNull(startDate);
        }
        return teamRepository.countAllByDateCreatedBetweenAndDateCreatedNotNull(startDate, endDate);
    }

    @ManagedAttribute
    public int getFeedbackCount() {
        return getFeedbackCount(null, null);
    }

    public int getFeedbackCount(LocalDate startTime, LocalDate endTime) {
        LocalDateTime finalEndTime = Optional.ofNullable(endTime)
            .map(LocalDate::atStartOfDay)
            .orElseGet(LocalDateTime::now);
        LocalDateTime finalStartTime = Optional.ofNullable(startTime)
            .map(LocalDate::atStartOfDay)
            .orElseGet(() -> LocalDateTime.of(1900, Month.JANUARY, 1, 0, 0));

        return (int) feedbackRepository.countByDateCreatedGreaterThanEqualAndDateCreatedLessThanEqual(finalStartTime, finalEndTime);
    }

    @ManagedAttribute
    public double getAverageRating() {
        return getAverageRating(null, null);
    }

    public double getAverageRating(LocalDate startTime, LocalDate endTime) {
        LocalDateTime finalEndTime = Optional.ofNullable(endTime)
            .map(LocalDate::atStartOfDay)
            .orElseGet(LocalDateTime::now);
        LocalDateTime finalStartTime = Optional.ofNullable(startTime)
            .map(LocalDate::atStartOfDay)
            .orElseGet(() -> LocalDateTime.of(1900, Month.JANUARY, 1, 0, 0));

        return feedbackRepository.getAverageRating(finalStartTime, finalEndTime);
    }

    public int getTeamLogins() {
        return getTeamLogins(null, null);
    }

    public int getTeamLogins(LocalDate startDate, LocalDate endDate) {
        LocalDate finalEndDate = Optional.ofNullable(endDate).orElseGet(LocalDate::now);
        LocalDate finalStartDate = Optional.ofNullable(startDate).orElseGet(() -> LocalDate.of(1900, Month.JANUARY, 1));
        return (int) teamRepository.countByLastLoginDateBetween(finalStartDate, finalEndDate);
    }
}