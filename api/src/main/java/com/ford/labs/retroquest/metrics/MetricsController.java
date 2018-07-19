package com.ford.labs.retroquest.metrics;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/metrics")
public class MetricsController {

    private final Metrics metrics;

    public MetricsController(Metrics metrics) {
        this.metrics = metrics;
    }

    @GetMapping("/team/count")
    public int getTeamCount() {
        return metrics.getTeamCount();
    }

    @GetMapping("/feedback/count")
    public int getFeedbackCount() {
        return metrics.getFeedbackCount();
    }

    @GetMapping("/feedback/average")
    public double getAverageRating() {
        return metrics.getAverageRating();
    }
}
