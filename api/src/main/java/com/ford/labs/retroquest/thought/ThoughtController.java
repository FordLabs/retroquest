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

import com.ford.labs.retroquest.api.authorization.ApiAuthorization;
import com.ford.labs.retroquest.websocket.WebsocketDeleteResponse;
import com.ford.labs.retroquest.websocket.WebsocketPutResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@Tag(name = "Thought Controller", description = "The controller that manages thoughts on a team board")
public class ThoughtController {

    private final ThoughtService thoughtService;
    private final ThoughtRepository thoughtRepository;
    private final ApiAuthorization apiAuthorization;

    public ThoughtController(ThoughtService thoughtService,
                             ThoughtRepository thoughtRepository,
                             ApiAuthorization apiAuthorization) {
        this.thoughtService = thoughtService;
        this.thoughtRepository = thoughtRepository;
        this.apiAuthorization = apiAuthorization;
    }

    @PutMapping("/api/team/{teamId}/thought/{thoughtId}/heart")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "adds a like to a thought given a thought and team id", description = "likeThought")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Created")})
    public int likeThought(@PathVariable("thoughtId") Long thoughtId, @PathVariable("teamId") String teamId) {
        return thoughtService.likeThought(thoughtId);
    }

    @PutMapping("/api/team/{teamId}/thought/{thoughtId}/discuss")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "toggles between a thought being discussed or not discussed", description = "discussThought")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    public ResponseEntity<Void> discussThought(@PathVariable("thoughtId") Long thoughtId, @PathVariable("teamId") String teamId) {
        thoughtService.discussThought(thoughtId);

        return ResponseEntity.ok().build();
    }

    @Transactional
    @PutMapping("/api/team/{teamId}/thought/{thoughtId}/topic")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Updates the topic of a thought given a thought and team id", description = "moveThought")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    public Thought moveThought(@PathVariable String teamId, @PathVariable Long thoughtId, @RequestBody MoveThoughtRequest request) {
        return thoughtService.updateTopic(thoughtId, request.getTopic());
    }

    @Transactional
    @PutMapping("/api/team/{teamId}/thought/{id}/message")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Updates the content of a thought given a thought and team id", description = "updateThoughtMessage")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    public void updateThoughtMessage(@PathVariable("id") Long id, @RequestBody UpdateThoughtMessageRequest request, @PathVariable("teamId") String teamId) {
        thoughtService.updateThoughtMessage(id, request.getMessage());
    }

    @GetMapping("/api/team/{teamId}/thoughts")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Returns all thoughts given a team id", description = "getThoughtsForTeam")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    public List<Thought> getThoughtsForTeam(@PathVariable("teamId") String teamId) {
        return thoughtService.fetchAllThoughtsByTeam(teamId);
    }

    @Transactional
    @DeleteMapping("/api/team/{teamId}/thoughts")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Removes all thoughts given a team id", description = "clearThoughtsForTeam")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    public void clearThoughtsForTeam(@PathVariable("teamId") String teamId) {
        thoughtService.deleteAllThoughtsByTeamId(teamId);
    }

    @Transactional
    @DeleteMapping("/api/team/{teamId}/thought/{thoughtId}")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Removes a thought given a team id and thought id", description = "clearIndividualThoughtForTeam")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
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
    public ResponseEntity<Void> createThoughtForTeam(@PathVariable("teamId") String teamId, @RequestBody CreateThoughtRequest request) throws URISyntaxException {
        var thought = thoughtService.createThought(teamId, request);
        var uri = new URI(String.format("/api/team/%s/thought/%s", thought.getTeamId(), thought.getId()));
        return ResponseEntity.created(uri).build();
    }

    @MessageMapping("/{teamId}/thought/create")
    @SendTo("/topic/{teamId}/thoughts")
    public WebsocketPutResponse<Thought> createThoughtWebsocket(@DestinationVariable("teamId") String teamId, CreateThoughtRequest request, Authentication authentication) {
        if (apiAuthorization.requestIsAuthorized(authentication, teamId)) {
            var savedThought = thoughtService.createThought(teamId, request);
            return new WebsocketPutResponse<>(savedThought);
        }
        return null;
    }

    @MessageMapping("/{teamId}/thought/{thoughtId}/edit")
    @SendTo("/topic/{teamId}/thoughts")
    public WebsocketPutResponse<Thought> editThoughtWebsocket(
        @DestinationVariable("teamId") String teamId,
        @DestinationVariable("thoughtId") Long thoughtId,
        EditThoughtRequest request,
        Authentication authentication
    ) {
        if (apiAuthorization.requestIsAuthorized(authentication, teamId)) {
            var savedThought = thoughtRepository.findById(thoughtId).orElseThrow();
            savedThought.setMessage(request.getMessage());
            savedThought.setDiscussed(request.isDiscussed());
            savedThought.setHearts(request.getHearts());

            thoughtRepository.save(savedThought);
            return new WebsocketPutResponse<>(savedThought);
        }
        return null;
    }

    @Transactional
    @MessageMapping("/{teamId}/thought/{thoughtId}/delete")
    @SendTo("/topic/{teamId}/thoughts")
    public WebsocketDeleteResponse<Long> deleteThoughtWebsocket(@DestinationVariable("teamId") String teamId, @DestinationVariable("thoughtId") Long thoughtId, Authentication authentication) {
        if (!apiAuthorization.requestIsAuthorized(authentication, teamId)) {
            return null;
        }
        thoughtRepository.deleteThoughtByTeamIdAndId(teamId, thoughtId);
        return new WebsocketDeleteResponse<>(thoughtId);
    }

    @Transactional
    @MessageMapping("/{teamId}/thought/delete")
    @SendTo("/topic/{teamId}/thoughts")
    public WebsocketDeleteResponse<Long> deleteThoughtWebsocket(@DestinationVariable("teamId") String teamId, Authentication authentication) {
        if (!apiAuthorization.requestIsAuthorized(authentication, teamId)) {
            return null;
        }
        thoughtRepository.deleteAllByTeamId(teamId);
        return new WebsocketDeleteResponse<>(-1L);
    }
}
