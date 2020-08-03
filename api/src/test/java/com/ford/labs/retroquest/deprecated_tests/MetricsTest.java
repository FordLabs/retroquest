package com.ford.labs.retroquest.deprecated_tests;

import com.ford.labs.retroquest.feedback.Feedback;
import com.ford.labs.retroquest.feedback.FeedbackRepository;
import com.ford.labs.retroquest.metrics.Metrics;
import com.ford.labs.retroquest.team.Team;
import com.ford.labs.retroquest.team.TeamRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.BDDMockito;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;

import static java.util.Arrays.asList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.*;

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
        given(mockTeamRepository.findAll()).willReturn(asList(new Team(), new Team()));
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
        given(mockFeedbackRepository.findAll()).willReturn(asList(new Feedback(), new Feedback()));
        assertEquals(2, metrics.getFeedbackCount());
    }

    @Test
    public void returnsTheAverageFeedback() {
        Feedback twoStarFeeback = new Feedback();
        twoStarFeeback.setStars(2);
        Feedback threeStarFeedback = new Feedback();
        threeStarFeedback.setStars(3);

        given(mockFeedbackRepository.findAllByStarsIsGreaterThanEqual(1)).willReturn(asList(twoStarFeeback, threeStarFeedback));
        assertEquals(2.5, metrics.getAverageRating(), 0);
    }

    @Test
    public void returnsZeroWhenNoFeedbackIsPresent() {
        given(mockFeedbackRepository.findAllByStarsIsGreaterThanEqual(1)).willReturn(Collections.emptyList());
        assertEquals(0.0, metrics.getAverageRating(), 0);
    }

    @Test
    public void returnsAppropriateFeedbackCount_whenOnlyStartDateIsProvided() {
        Feedback feedback1 = new Feedback();
        feedback1.setDateCreated(LocalDateTime.of(2018, 1, 1, 1, 1));
        Feedback feedback2 = new Feedback();
        feedback2.setDateCreated(LocalDateTime.of(2018, 3, 3 ,3, 3));
        given(mockFeedbackRepository.findAll()).willReturn(asList(feedback1, feedback2));

        assertEquals(1, metrics.getFeedbackCount(LocalDate.of(2018, 2, 2), null));
    }

    @Test
    public void returnsAppropriateFeedbackCount_whenGivenAStartAndEndDate() {

        Feedback feedback1 = new Feedback();
        feedback1.setDateCreated(LocalDateTime.of(2018, 1, 1, 1, 1));
        Feedback feedback2 = new Feedback();
        feedback2.setDateCreated(LocalDateTime.of(2018, 3, 3, 3, 3));
        Feedback feedback3 = new Feedback();
        feedback3.setDateCreated(LocalDateTime.of(2018, 5, 5, 5, 5));
        given(mockFeedbackRepository.findAll()).willReturn(asList(feedback1, feedback2));

        assertEquals(1, metrics.getFeedbackCount(LocalDate.of(2018, 2, 2), LocalDate.of(2018, 4, 4)));
    }

    @Test
    public void returnsAppropriateFeedbackCount_whenOnlyGivenAndEndDate() {
        Feedback feedback1 = new Feedback();
        feedback1.setDateCreated(LocalDateTime.of(2018, 1, 1, 1, 1));
        Feedback feedback2 = new Feedback();
        feedback2.setDateCreated(LocalDateTime.of(2018, 3, 3 ,3, 3));
        given(mockFeedbackRepository.findAll()).willReturn(asList(feedback1, feedback2));

        assertEquals(1, metrics.getFeedbackCount(null, LocalDate.of(2018, 2, 2)));
    }

    @Test
    public void returnsAppropriateFeedbackAverage_whenOnlyGivenAStartTime() {
        Feedback feedback1 = new Feedback();
        feedback1.setDateCreated(LocalDateTime.of(2018, 1, 1, 1, 1));
        feedback1.setStars(1);
        Feedback feedback2 = new Feedback();
        feedback2.setDateCreated(LocalDateTime.of(2018, 3, 3, 3, 3));
        feedback2.setStars(1);
        given(mockFeedbackRepository.findAllByStarsIsGreaterThanEqual(1)).willReturn(asList(feedback1, feedback2));

        assertEquals(1.0, metrics.getAverageRating(LocalDate.of(2018, 1, 1), null), .001);
    }

    @Test
    public void returnsAppropriateFeedbackAverage_whenOnlyGivenBothAStartAndEndTime() {
        Feedback feedback1 = new Feedback();
        feedback1.setDateCreated(LocalDateTime.of(2018, 1, 1, 1, 1));
        feedback1.setStars(1);
        Feedback feedback2 = new Feedback();
        feedback2.setDateCreated(LocalDateTime.of(2018, 3, 3, 3, 3));
        feedback2.setStars(1);
        Feedback feedback3 = new Feedback();
        feedback3.setDateCreated(LocalDateTime.of(2018, 3, 3, 3, 3));
        feedback3.setStars(1);
        given(mockFeedbackRepository.findAllByStarsIsGreaterThanEqual(1)).willReturn(asList(feedback1, feedback2));

        assertEquals(1.0, metrics.getAverageRating(LocalDate.of(2018, 2, 2), LocalDate.of(2018, 4, 4)), .001);
    }

    @Test
    public void returnsAppropriateFeedbackAverage_whenOnlyGivenAnEndTime() {
        Feedback feedback1 = new Feedback();
        feedback1.setDateCreated(LocalDateTime.of(2018, 1, 1, 1, 1));
        feedback1.setStars(1);
        Feedback feedback2 = new Feedback();
        feedback2.setDateCreated(LocalDateTime.of(2018, 3, 3, 3, 3));
        feedback2.setStars(1);
        given(mockFeedbackRepository.findAllByStarsIsGreaterThanEqual(1)).willReturn(asList(feedback1, feedback2));

        assertEquals(1.0, metrics.getAverageRating(null, LocalDate.of(2018, 4, 4)), .001);
    }

    @Test
    public void nullStartDate_becomesDefaultStatDate() {
        metrics.getTeamLogins(null, LocalDate.of(2018, 1, 1));
        then(mockTeamRepository).should().findAllByLastLoginDateBetween(LocalDate.of(1900, 1, 1), LocalDate.of(2018, 1, 1));
    }

    @Test
    public void nullEndDate_becomesDefaulEndDate() {
        metrics.getTeamLogins(LocalDate.of(2018, 1, 1), null);
        verify(mockTeamRepository).findAllByLastLoginDateBetween(LocalDate.of(2018, 1, 1), LocalDate.now());
    }
}
