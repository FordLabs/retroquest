package com.ford.labs.retroquest.metrics;


import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.util.Optional;

public class DateTimeRange {
    private final LocalDateTime startDateTime;
    private final LocalDateTime endDateTime;

    private DateTimeRange(@NotNull LocalDateTime startDateTime, @NotNull LocalDateTime endDateTime) {
        this.startDateTime = startDateTime;
        this.endDateTime = endDateTime;
    }

    static DateTimeRange fromStartAndEnd(LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = Optional.ofNullable(startDate)
            .map(LocalDate::atStartOfDay)
            .orElseGet(() -> LocalDateTime.of(1900, Month.JANUARY, 1, 0, 0));
        LocalDateTime endDateTime = Optional.ofNullable(endDate)
            .map(LocalDate::atStartOfDay)
            .orElseGet(LocalDateTime::now);

        return new DateTimeRange(startDateTime, endDateTime);
    }

    public LocalDateTime getStartDateTime() {
        return this.startDateTime;
    }

    public LocalDateTime getEndDateTime() {
        return this.endDateTime;
    }

    public LocalDate getStartDate() {
        return startDateTime.toLocalDate();
    }

    public LocalDate getEndDate() {
        return endDateTime.toLocalDate();
    }
}
