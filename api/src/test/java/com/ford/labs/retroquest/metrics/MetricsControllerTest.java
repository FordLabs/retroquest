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

import java.util.Arrays;
import java.util.Collections;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class MetricsControllerTest {

    @Mock
    private FeedbackRepository mockFeedbackRepository;

    @Mock
    private TeamRepository mockTeamRepository;

    @InjectMocks
    private MetricsController metricsController;


    @Test
    public void returnsTheTotalNumberOfTeamsCreated() {
        when(mockTeamRepository.findAll()).thenReturn(Arrays.asList(new Team(), new Team()));
        assertEquals(2, metricsController.getTeamCount());
    }

    @Test
    public void returnsTheFeedbackCount() {
        when(mockFeedbackRepository.findAll()).thenReturn(Arrays.asList(new Feedback(), new Feedback()));
        assertEquals(2, metricsController.getFeedbackCount());
    }

    @Test
    public void returnsTheAverageFeedback() {
        Feedback twoStarFeeback = new Feedback();
        twoStarFeeback.setStars(2);
        Feedback threeStarFeedback = new Feedback();
        threeStarFeedback.setStars(3);

        when(mockFeedbackRepository.findAllByStarsIsGreaterThanEqual(1)).thenReturn(Arrays.asList(twoStarFeeback, threeStarFeedback));
        assertEquals(2.5, metricsController.getAverageRating(), 0);
    }

    @Test
    public void returnsZeroWhenNoFeedbackIsPresent() {
        when(mockFeedbackRepository.findAllByStarsIsGreaterThanEqual(1)).thenReturn(Collections.emptyList());
        assertEquals(0.0, metricsController.getAverageRating(), 0);
    }
}