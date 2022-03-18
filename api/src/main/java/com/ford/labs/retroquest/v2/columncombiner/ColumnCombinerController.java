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

package com.ford.labs.retroquest.v2.columncombiner;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/v2/team")
@Tag(name = "Column Combiner Controller", description = "The controller that aggregates all of the items given a team id")
@Deprecated
public class ColumnCombinerController {

    private final ColumnCombinerService columnCombinerService;

    ColumnCombinerController(ColumnCombinerService columnCombinerService) {
        this.columnCombinerService = columnCombinerService;
    }

    @GetMapping("/{teamId}/columns")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Gets all thoughts for a given team id", description = "getThoughtsForTeam")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "All the thoughts for a team id")})
    public ColumnCombinerResponse getColumnsForTeam(@PathVariable("teamId") String teamId, Authentication authentication) {
        return columnCombinerService.aggregateResponse(teamId);
    }
}
