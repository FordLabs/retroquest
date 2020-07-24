package com.ford.labs.retroquest.deprecated_tests;

import com.ford.labs.retroquest.feedback.Feedback;
import com.ford.labs.retroquest.feedback.FeedbackRepository;
import com.ford.labs.retroquest.metrics.Metrics;
import com.ford.labs.retroquest.team.Team;
import com.ford.labs.retroquest.team.TeamRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;

import static java.util.Arrays.asList;
import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
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
        when(mockTeamRepository.findAll()).thenReturn(asList(new Team(), new Team()));
        assertEquals(2, metrics.getTeamCount());
    }

    @Test
    public void callsDateCreatedAfter_whenGivenOnlyAStartDate() {
        when(mockTeamRepository.countAllByDateCreatedAfterAndDateCreatedIsNotNull(any())).thenReturn(1L);
        metrics.getTeamCount(LocalDate.of(2018, 2, 2), null);
        verify(mockTeamRepository, times(1)).countAllByDateCreatedAfterAndDateCreatedIsNotNull(any());
    }

    @Test
    public void callsDateCreatedBetween_whenGivenBothAStartAndEndDate() {
        when(mockTeamRepository.countAllByDateCreatedBetweenAndDateCreatedNotNull(any(), any())).thenReturn(1L);
        metrics.getTeamCount(LocalDate.of(2018, 2, 2), LocalDate.of(2018, 4, 4));
        verify(mockTeamRepository, times(1)).countAllByDateCreatedBetweenAndDateCreatedNotNull(any(), any());
    }

    @Test
    public void returnsTheFeedbackCount() {
        when(mockFeedbackRepository.findAll()).thenReturn(asList(new Feedback(), new Feedback()));
        assertEquals(2, metrics.getFeedbackCount());
    }

    @Test
    public void returnsTheAverageFeedback() {
        Feedback twoStarFeeback = new Feedback();
        twoStarFeeback.setStars(2);
        Feedback threeStarFeedback = new Feedback();
        threeStarFeedback.setStars(3);

        when(mockFeedbackRepository.findAllByStarsIsGreaterThanEqual(1)).thenReturn(asList(twoStarFeeback, threeStarFeedback));
        assertEquals(2.5, metrics.getAverageRating(), 0);
    }

    @Test
    public void returnsZeroWhenNoFeedbackIsPresent() {
        when(mockFeedbackRepository.findAllByStarsIsGreaterThanEqual(1)).thenReturn(Collections.emptyList());
        assertEquals(0.0, metrics.getAverageRating(), 0);
    }

    @Test
    public void returnsAppropriateFeedbackCount_whenOnlyStartDateIsProvided() {
        Feedback feedback1 = new Feedback();
        feedback1.setDateCreated(LocalDateTime.of(2018, 1, 1, 1, 1));
        Feedback feedback2 = new Feedback();
        feedback2.setDateCreated(LocalDateTime.of(2018, 3, 3 ,3, 3));
        when(mockFeedbackRepository.findAll()).thenReturn(asList(feedback1, feedback2));

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
        when(mockFeedbackRepository.findAll()).thenReturn(asList(feedback1, feedback2));

        assertEquals(1, metrics.getFeedbackCount(LocalDate.of(2018, 2, 2), LocalDate.of(2018, 4, 4)));
    }

    @Test
    public void returnsAppropriateFeedbackCount_whenOnlyGivenAndEndDate() {
        Feedback feedback1 = new Feedback();
        feedback1.setDateCreated(LocalDateTime.of(2018, 1, 1, 1, 1));
        Feedback feedback2 = new Feedback();
        feedback2.setDateCreated(LocalDateTime.of(2018, 3, 3 ,3, 3));
        when(mockFeedbackRepository.findAll()).thenReturn(asList(feedback1, feedback2));

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
        when(mockFeedbackRepository.findAllByStarsIsGreaterThanEqual(1)).thenReturn(asList(feedback1, feedback2));

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
        when(mockFeedbackRepository.findAllByStarsIsGreaterThanEqual(1)).thenReturn(asList(feedback1, feedback2));

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
        when(mockFeedbackRepository.findAllByStarsIsGreaterThanEqual(1)).thenReturn(asList(feedback1, feedback2));

        assertEquals(1.0, metrics.getAverageRating(null, LocalDate.of(2018, 4, 4)), .001);
    }

    @Test
    public void nullStartDate_becomesDefaultStatDate() {
        metrics.getTeamLogins(null, LocalDate.of(2018, 1, 1));
        verify(mockTeamRepository).findAllByLastLoginDateBetween(LocalDate.of(1900, 1, 1), LocalDate.of(2018, 1, 1));
    }

    @Test
    public void nullEndDate_becomesDefaulEndDate() {
        metrics.getTeamLogins(LocalDate.of(2018, 1, 1), null);
        verify(mockTeamRepository).findAllByLastLoginDateBetween(LocalDate.of(2018, 1, 1), LocalDate.now());
    }
}