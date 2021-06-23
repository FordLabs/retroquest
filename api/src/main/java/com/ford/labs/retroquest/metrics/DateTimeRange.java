/*
 * Copyright (c) 2021 Ford Motor Company
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
