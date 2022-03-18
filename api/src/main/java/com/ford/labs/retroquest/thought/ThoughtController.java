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

package com.ford.labs.retroquest.thought;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@Tag(name = "Thought Controller", description = "The controller that manages thoughts on a team board")
public class ThoughtController {

    private final ThoughtService thoughtService;

    public ThoughtController(ThoughtService thoughtService) {
        this.thoughtService = thoughtService;
    }

    @Transactional
    @PutMapping("/api/team/{teamId}/thought/{thoughtId}/heart")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "adds a like to a thought given a thought and team id", description = "likeThought")
    @ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Created") })
    public void likeThought(@PathVariable("thoughtId") Long thoughtId, @PathVariable("teamId") String teamId) {
        thoughtService.likeThought(thoughtId);
    }

    @PutMapping("/api/team/{teamId}/thought/{thoughtId}/discuss")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "toggles between a thought being discussed or not discussed", description = "discussThought")
    @ApiResponses(value = { @ApiResponse(responseCode = "200", description = "OK") })
    public void discussThought(
        @PathVariable("thoughtId") Long thoughtId,
        @PathVariable("teamId") String teamId,
        @RequestBody UpdateThoughtDiscussedRequest request
    ) {
        thoughtService.discussThought(thoughtId, request.discussed());
    }

    @Transactional
    @PutMapping("/api/team/{teamId}/thought/{thoughtId}/topic")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Updates the topic of a thought given a thought and team id", description = "moveThought")
    @ApiResponses(value = { @ApiResponse(responseCode = "200", description = "OK") })
    public void moveThought(
        @PathVariable String teamId,
        @PathVariable Long thoughtId,
        @RequestBody MoveThoughtRequest request
    ) {
        thoughtService.updateColumn(thoughtId, request.columnId());
    }

    @Transactional
    @PutMapping("/api/team/{teamId}/thought/{id}/message")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(
        summary = "Updates the content of a thought given a thought and team id",
        description = "updateThoughtMessage"
    )
    @ApiResponses(value = { @ApiResponse(responseCode = "200", description = "OK") })
    public void updateThoughtMessage(@PathVariable("id") Long id, @RequestBody UpdateThoughtMessageRequest request,
                                     @PathVariable("teamId") String teamId) {
        thoughtService.updateThoughtMessage(id, request.message());
    }

    @GetMapping("/api/team/{teamId}/thoughts")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Returns all thoughts given a team id", description = "getThoughtsForTeam")
    @ApiResponses(value = { @ApiResponse(responseCode = "200", description = "OK") })
    public List<Thought> getThoughtsForTeam(@PathVariable("teamId") String teamId) {
        return thoughtService.fetchAllActiveThoughts(teamId);
    }

    @Transactional
    @DeleteMapping("/api/team/{teamId}/thought/{thoughtId}")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Removes a thought given a team id and thought id", description = "clearIndividualThoughtForTeam")
    @ApiResponses(value = { @ApiResponse(responseCode = "200", description = "OK") })
    public void clearIndividualThoughtForTeam(@PathVariable("teamId") String teamId, @PathVariable("thoughtId") Long id) {
        thoughtService.deleteThought(teamId, id);
    }

    @PostMapping("/api/team/{teamId}/thought")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Creates a thought given a team id and thought", description = "createThoughtForTeam")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Created"),
        @ApiResponse(responseCode = "400", description = "Path to saved thought is not a valid URI")
    })
    public ResponseEntity<Void> createThoughtForTeam(
        @PathVariable("teamId") String teamId,
        @RequestBody CreateThoughtRequest request
    ) throws URISyntaxException {
        var thought = thoughtService.createThought(teamId, request);
        var uri = new URI(String.format("/api/team/%s/thought/%s", thought.getTeamId(), thought.getId()));
        return ResponseEntity.created(uri).build();
    }
}
