/*
 * Copyright (c) 2021 Ford Motor Company
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.ford.labs.retroquest.metrics;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/metrics")
@Tag(name = "Metrics Controller", description = "The controller that manages metrics")
public class MetricsController {

    private final Metrics metrics;

    public MetricsController(Metrics metrics) {
        this.metrics = metrics;
    }

    @GetMapping("/team/count")
    @Operation(summary = "Gets the number of teams between a start and end date", description = "getTeamCount")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    public ResponseEntity<Integer> getTeamCount(
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
    @Operation(summary = "Gets the number of feedback entries between a start and end date", description = "saveFeedback")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
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
    @Operation(summary = "Returns the average app rating between a start and end date", description = "saveFeedback")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
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
    @Operation(summary = "Returns the number of logins given a start and end date", description = "saveFeedback")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
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
