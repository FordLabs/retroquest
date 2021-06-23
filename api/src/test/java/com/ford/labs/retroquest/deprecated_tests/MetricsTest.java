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

package com.ford.labs.retroquest.deprecated_tests;

import com.ford.labs.retroquest.feedback.FeedbackRepository;
import com.ford.labs.retroquest.metrics.Metrics;
import com.ford.labs.retroquest.team.TeamRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.any;

@ExtendWith(MockitoExtension.class)
class MetricsTest {

    @Mock
    private FeedbackRepository mockFeedbackRepository;

    @Mock
    private TeamRepository mockTeamRepository;

    @InjectMocks
    private Metrics metrics;

    @Test
    void getTeamCount_whenCalledWithNoArguments_returnsTheTotalNumberOfTeamsCreated() {
        given(mockTeamRepository.countAllByDateCreatedBetweenAndDateCreatedNotNull(any(), any())).willReturn(2L);
        assertEquals(2, metrics.getTeamCount());
    }

    @Test
    void getTeamCount_whenGivenBothAStartAndEndDate_passesDatesToRepository() {
        LocalDate startDate = LocalDate.of(2018, 2, 2);
        LocalDate endDate = LocalDate.of(2018, 4, 4);

        given(mockTeamRepository.countAllByDateCreatedBetweenAndDateCreatedNotNull(any(), any())).willReturn(1L);

        metrics.getTeamCount(startDate, endDate);

        then(mockTeamRepository).should()
            .countAllByDateCreatedBetweenAndDateCreatedNotNull(startDate, endDate);
    }

    @Test
    void getFeedbackCount_whenCalledWithNoArguments_returnsTheTotalFeedbackCount() {
        given(mockFeedbackRepository.countByDateCreatedGreaterThanEqualAndDateCreatedLessThanEqual(any(), any())).willReturn(2L);
        assertEquals(2, metrics.getFeedbackCount());
    }

    @Test
    void getFeedbackCount_whenGivenBothAStartAndEndDate_passesDatesToRepository() {
        LocalDate startDate = LocalDate.of(2018, 2, 2);
        LocalDate endDate = LocalDate.of(2018, 4, 4);

        given(mockFeedbackRepository.countByDateCreatedGreaterThanEqualAndDateCreatedLessThanEqual(any(), any())).willReturn(2L);

        metrics.getFeedbackCount(startDate, endDate);

        then(mockFeedbackRepository).should()
            .countByDateCreatedGreaterThanEqualAndDateCreatedLessThanEqual(
                startDate.atStartOfDay(),
                endDate.atStartOfDay()
            );
    }

    @Test
    void getAverageRating_whenCalledWithNoArguments_returnsTheAverageOfAllFeedback() {
        given(mockFeedbackRepository.getAverageRating(any(), any())).willReturn(2.5);
        assertEquals(2.5, metrics.getAverageRating(), 0);
    }

    @Test
    void getAverageRating_whenGivenBothAStartAndEndDate_passesDatesToRepository() {
        LocalDate startDate = LocalDate.of(2018, 2, 2);
        LocalDate endDate = LocalDate.of(2018, 4, 4);

        given(mockFeedbackRepository.getAverageRating(any(), any())).willReturn(2.5);

        metrics.getAverageRating(startDate, endDate);

        then(mockFeedbackRepository).should()
            .getAverageRating(
                startDate.atStartOfDay(),
                endDate.atStartOfDay()
            );
    }

    @Test
    void getTeamLogins_whenCalledWithNoArguments_returnsTheTotalNumberOfTeamsCreated() {
        given(mockTeamRepository.countByLastLoginDateBetween(any(), any())).willReturn(2L);
        assertEquals(2, metrics.getTeamLogins());
    }

    @Test
    void getTeamLogins_whenGivenBothAStartAndEndDate_passesDatesToRepository() {
        LocalDate startDate = LocalDate.of(2018, 2, 2);
        LocalDate endDate = LocalDate.of(2018, 4, 4);

        given(mockTeamRepository.countByLastLoginDateBetween(any(), any())).willReturn(1L);

        metrics.getTeamLogins(startDate, endDate);

        then(mockTeamRepository).should()
            .countByLastLoginDateBetween(startDate, endDate);
    }
}
