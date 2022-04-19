/*
 * Copyright (c) 2022 Ford Motor Company
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

package com.ford.labs.retroquest.column;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.transaction.Transactional;
import java.util.List;

@RestController
@RequestMapping
@Tag(name = "Column Controller", description = "The controller that manages the columns of a retro")
public class ColumnController {

    private final ColumnService columnService;

    public ColumnController(ColumnService columnService) {
        this.columnService = columnService;
    }

    @GetMapping("/api/team/{teamId}/columns")
    @PreAuthorize("@teamAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Gets all columns of a retro board for a given Team ID", description = "getColumns")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "OK"),
        @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public List<Column> getColumns(@PathVariable String teamId) {
        return columnService.getColumns(teamId);
    }

    @Transactional
    @PutMapping("/api/team/{teamId}/column/{columnId}/title")
    @PreAuthorize("@teamAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(
        summary = "Updates the title of a column of a retro board given a team id and column id",
        description = "updateTitleOfColumn"
    )
    @ApiResponses(value = { @ApiResponse(responseCode = "200", description = "OK") })
    public void updateTitleOfColumn(
        @PathVariable("teamId") String teamId,
        @RequestBody UpdateColumnTitleRequest request,
        @PathVariable("columnId") Long columnId
    ) {
        columnService.editTitle(columnId, request.title(), teamId);
    }
}
