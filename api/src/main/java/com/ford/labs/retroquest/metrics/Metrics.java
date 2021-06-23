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