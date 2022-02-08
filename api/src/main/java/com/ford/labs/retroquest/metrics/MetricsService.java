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
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;

@Service
public class MetricsService {
    private final TeamRepository teamRepository;
    private final FeedbackRepository feedbackRepository;

    public MetricsService(TeamRepository teamRepository, FeedbackRepository feedbackRepository) {
        this.teamRepository = teamRepository;
        this.feedbackRepository = feedbackRepository;
    }

    public long getTeamCount() {
        return teamRepository.count();
    }

    public long getFeedbackCount() {
        return feedbackRepository.count();
    }

    public double getAverageRating() {
        return feedbackRepository.getAverageRating();
    }

    public long getActiveTeams() {
        return teamRepository.countByLastLoginDateBetween(
            LocalDate.now().minus(Period.ofMonths(3)),
            LocalDate.now()
        );
    }
}