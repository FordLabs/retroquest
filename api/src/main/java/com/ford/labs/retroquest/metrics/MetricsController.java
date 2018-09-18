package com.ford.labs.retroquest.metrics;

import com.ford.labs.retroquest.team.TeamService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/metrics")
public class MetricsController {

    private final Metrics metrics;

    private final TeamService teamService;

    public MetricsController(Metrics metrics, TeamService teamService) {
        this.metrics = metrics;
        this.teamService = teamService;
    }

    @GetMapping("/team/count")
    public long getTeamCount() {
        return teamService.getTeamCount();
    }

    @GetMapping("/feedback/count")
    public int getFeedbackCount(
            @RequestParam(name = "start", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                    LocalDate startDate,
            @RequestParam(name = "end", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                    LocalDate endDate
    ) {
        return metrics.getFeedbackCount(startDate, endDate);
    }

    @GetMapping("/feedback/average")
    public double getAverageRating(
            @RequestParam(name = "start", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                    LocalDate startDate,
            @RequestParam(name = "end", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                    LocalDate endDate
    ) {
        return metrics.getAverageRating(startDate, endDate);
    }

    @GetMapping("/team/logins")
    public int getLogins(
            @RequestParam(name = "start", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                    LocalDate startDate,
            @RequestParam(name = "end", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                    LocalDate endDate
    ) {
        return metrics.getTeamLogins(startDate, endDate);
    }
}
