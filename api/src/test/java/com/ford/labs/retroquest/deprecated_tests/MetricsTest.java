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

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.any;

@ExtendWith(MockitoExtension.class)
public class MetricsTest {

    @Mock
    private FeedbackRepository mockFeedbackRepository;

    @Mock
    private TeamRepository mockTeamRepository;

    @InjectMocks
    private Metrics metrics;


    @Test
    public void returnsTheTotalNumberOfTeamsCreated() {
        given(mockTeamRepository.count()).willReturn(2L);
        assertEquals(2, metrics.getTeamCount());
    }

    @Test
    public void noStartOrEndDateReturnsAllCountOfTeams() {
        given(mockTeamRepository.count()).willReturn(2L);
        long teamCount = metrics.getTeamCount(null, null);
        then(mockTeamRepository).should().count();
        assertThat(teamCount).isEqualTo(2L);
    }

    @Test
    public void callsDateCreatedAfter_whenGivenOnlyAStartDate() {
        given(mockTeamRepository.countAllByDateCreatedAfterAndDateCreatedIsNotNull(any())).willReturn(1L);
        metrics.getTeamCount(LocalDate.of(2018, 2, 2), null);
        then(mockTeamRepository).should().countAllByDateCreatedAfterAndDateCreatedIsNotNull(any());
    }

    @Test
    public void callsDateCreatedBetween_whenGivenBothAStartAndEndDate() {
        given(mockTeamRepository.countAllByDateCreatedBetweenAndDateCreatedNotNull(any(), any())).willReturn(1L);
        metrics.getTeamCount(LocalDate.of(2018, 2, 2), LocalDate.of(2018, 4, 4));
        then(mockTeamRepository).should().countAllByDateCreatedBetweenAndDateCreatedNotNull(any(), any());
    }

    @Test
    public void returnsTheFeedbackCount() {
        given(mockFeedbackRepository.countByDateCreatedGreaterThanEqualAndDateCreatedLessThanEqual(any(), any())).willReturn(2L);
        assertEquals(2, metrics.getFeedbackCount());
    }

    @Test
    public void returnsTheAverageFeedback() {
        given(mockFeedbackRepository.getAverageRating(any(), any())).willReturn(2.5);
        assertEquals(2.5, metrics.getAverageRating(), 0);
    }
}
