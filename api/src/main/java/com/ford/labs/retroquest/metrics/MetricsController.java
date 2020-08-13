package com.ford.labs.retroquest.metrics;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/metrics")
public class MetricsController {

    private final Metrics metrics;

    public MetricsController(Metrics metrics) {
        this.metrics = metrics;
    }

    @GetMapping("/team/count")
    public ResponseEntity<Long> getTeamCount(
            @RequestParam(name = "start", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                    LocalDate startDate,
            @RequestParam(name = "end", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                    LocalDate endDate
    ) {
        return ResponseEntity.ok(metrics.getTeamCount(startDate, endDate));
    }

    @GetMapping("/feedback/count")
    public ResponseEntity<Integer> getFeedbackCount(
            @RequestParam(name = "start", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                    LocalDate startDate,
            @RequestParam(name = "end", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                    LocalDate endDate
    ) {
        return ResponseEntity.ok(metrics.getFeedbackCount(startDate, endDate));
    }

    @GetMapping("/feedback/average")
    public ResponseEntity<Double> getAverageRating(
            @RequestParam(name = "start", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                    LocalDate startDate,
            @RequestParam(name = "end", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                    LocalDate endDate
    ) {
        return ResponseEntity.ok(metrics.getAverageRating(startDate, endDate));
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
