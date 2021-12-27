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

package com.ford.labs.retroquest.columntitle;

import com.ford.labs.retroquest.websocket.WebsocketColumnTitleEvent;
import com.ford.labs.retroquest.websocket.WebsocketService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.util.List;

import static com.ford.labs.retroquest.websocket.WebsocketEventType.UPDATE;

@RestController
@Tag(name = "Column Title Controller", description = "The controller that manages the titles of each column on a retro board")
public class ColumnTitleController {

    private final ColumnTitleRepository columnTitleRepository;
    private final WebsocketService websocketService;

    public ColumnTitleController(ColumnTitleRepository columnTitleRepository, WebsocketService websocketService) {
        this.columnTitleRepository = columnTitleRepository;
        this.websocketService = websocketService;
    }

    @GetMapping("/api/team/{teamId}/columns")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Gets a the column titles on a retro board for a given team id", description = "getColumnTitlesForTeam")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    public List<ColumnTitle> getColumnTitlesForTeam(@PathVariable("teamId") String teamId) {
        return columnTitleRepository.findAllByTeamId(teamId);
    }

    @Transactional
    @PutMapping("/api/team/{teamId}/column/{columnId}/title")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Updates the title of a column of a retro board given a team id and column id", description = "updateTitleOfColumn")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    public void updateTitleOfColumn(@PathVariable("teamId") String teamId, @RequestBody UpdateColumnTitleRequest request, @PathVariable("columnId") Long columnId) {
        var returnedColumnTitle = columnTitleRepository.findById(columnId).orElseThrow();
        returnedColumnTitle.setTitle(request.getTitle());
        var updatedColumnTitle = columnTitleRepository.save(returnedColumnTitle);
        websocketService.publishEvent(new WebsocketColumnTitleEvent(teamId, UPDATE, updatedColumnTitle));
    }
}
