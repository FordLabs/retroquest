package com.ford.labs.retroquest.metrics;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/metrics")
@Api(tags = {"Metrics Controller"}, description = "The controller that manages metrics")
public class MetricsController {

    private final Metrics metrics;

    public MetricsController(Metrics metrics) {
        this.metrics = metrics;
    }

    @GetMapping("/team/count")
    @ApiOperation(value = "Gets the number of teams between a start and end date", notes = "getTeamCount")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "OK", response = Long.class)})
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
    @ApiOperation(value = "Gets the number of feedback entries between a start and end date", notes = "saveFeedback")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "OK", response = Long.class)})
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
    @ApiOperation(value = "Returns the average app rating between a start and end date", notes = "saveFeedback")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "OK", response = Double.class)})
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
    @ApiOperation(value = "Returns the number of logins given a start and end date", notes = "saveFeedback")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "OK", response = Integer.class)})
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
