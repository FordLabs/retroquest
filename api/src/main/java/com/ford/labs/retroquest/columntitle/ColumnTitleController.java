/*
 * Copyright © 2020 Ford Motor Company
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

import com.ford.labs.retroquest.api.authorization.ApiAuthorization;
import com.ford.labs.retroquest.websocket.WebsocketPutResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.util.List;

@RestController
@Tag(name = "Column Title Controller", description = "The controller that manages the titles of each column on a retro board")
public class ColumnTitleController {

    private final ColumnTitleRepository columnTitleRepository;
    private final ApiAuthorization apiAuthorization;

    public ColumnTitleController(ColumnTitleRepository columnTitleRepository,
                                 ApiAuthorization apiAuthorization) {
        this.columnTitleRepository = columnTitleRepository;
        this.apiAuthorization = apiAuthorization;
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
    public void updateTitleOfColumn(@PathVariable("teamId") String teamId, @RequestBody ColumnTitle columnTitle, @PathVariable("columnId") Long columnId) {
        var returnedColumnTitle = columnTitleRepository.findById(columnId).orElseThrow();
        returnedColumnTitle.setTitle(columnTitle.getTitle());
        columnTitleRepository.save(returnedColumnTitle);
    }

    @MessageMapping("/{teamId}/column-title/{columnId}/edit")
    @SendTo("/topic/{teamId}/column-titles")
    public WebsocketPutResponse<ColumnTitle> editColumnTitleWebsocket(@DestinationVariable("teamId") String teamId, @DestinationVariable("columnId") Long columnId, ColumnTitle columnTitle, Authentication authentication) {
        if (apiAuthorization.requestIsAuthorized(authentication, teamId)) {
            var savedColumnTitle = columnTitleRepository.findById(columnId).orElseThrow();
            savedColumnTitle.setTitle(columnTitle.getTitle());
            columnTitleRepository.save(savedColumnTitle);
            return new WebsocketPutResponse<>(savedColumnTitle);
        }
        return null;
    }
}
