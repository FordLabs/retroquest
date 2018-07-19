package com.ford.labs.retroquest.metrics;

import com.ford.labs.retroquest.feedback.Feedback;
import com.ford.labs.retroquest.feedback.FeedbackRepository;
import com.ford.labs.retroquest.team.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.OptionalDouble;

@RestController
@RequestMapping("/api/admin/metrics")
public class MetricsController {

    private final TeamRepository teamRepository;

    private final FeedbackRepository feedbackRepository;

    public MetricsController(TeamRepository teamRepository, FeedbackRepository feedbackRepository) {
        this.teamRepository = teamRepository;
        this.feedbackRepository = feedbackRepository;
    }

    @GetMapping("/team/count")
    public int getTeamCount() {
        return teamRepository.findAll().size();
    }

    @GetMapping("/feedback/count")
    public int getFeedbackCount() {
        return feedbackRepository.findAll().size();
    }

    @GetMapping("/feedback/average")
    public double getAverageRating() {
        List<Feedback> allFeedback = feedbackRepository.findAllByStarsIsGreaterThanEqual(1);
        OptionalDouble average = allFeedback.stream().mapToDouble(Feedback::getStars).average();
        return average.isPresent() ? average.getAsDouble() : 0.0;
    }
}
