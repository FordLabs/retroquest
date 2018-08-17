package com.ford.labs.retroquest.metrics;

import com.ford.labs.retroquest.feedback.Feedback;
import com.ford.labs.retroquest.feedback.FeedbackRepository;
import com.ford.labs.retroquest.team.Team;
import com.ford.labs.retroquest.team.TeamRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;

import static java.util.Arrays.asList;
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
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
    public void returnsTheTotalNumberOfTeams_whenGivenOnlyAStartDate() {
        Team team1 = new Team();
        team1.setDateCreated(LocalDate.of(2018, 1, 1));
        Team team2 = new Team();
        team2.setDateCreated(LocalDate.of(2018, 3, 3));
        when(mockTeamRepository.findAll()).thenReturn(asList(team1, team2));
        assertEquals(1, metrics.getTeamCount(LocalDate.of(2018, 2, 2), null));
    }

    @Test
    public void returnsTheTotalNumberOfTeams_whenGivenOnlyAnEndDate() {
        Team team1 = new Team();
        team1.setDateCreated(LocalDate.of(2018, 1, 1));
        Team team2 = new Team();
        team2.setDateCreated(LocalDate.of(2018, 3, 3));
        when(mockTeamRepository.findAll()).thenReturn(asList(team1, team2));
        assertEquals(1, metrics.getTeamCount(null, LocalDate.of(2018, 2, 2)));
    }

    @Test
    public void returnsTheTotalNumberOfTeams_whenGivenBothAStartAndEndDate() {
        Team team1 = new Team();
        team1.setDateCreated(LocalDate.of(2018, 1, 1));
        Team team2 = new Team();
        team2.setDateCreated(LocalDate.of(2018, 3, 3));
        Team team3 = new Team();
        team3.setDateCreated(LocalDate.of(2018, 5, 5));
        when(mockTeamRepository.findAll()).thenReturn(asList(team1, team2, team3));
        assertEquals(1, metrics.getTeamCount(LocalDate.of(2018, 2, 2), LocalDate.of(2018, 4, 4)));
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
}