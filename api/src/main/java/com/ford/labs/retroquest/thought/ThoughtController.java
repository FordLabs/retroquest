/*
 * Copyright © 2018 Ford Motor Company
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
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
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
@Api(tags = {"Thought Controller"}, description = "The controller that manages thoughts on a team board")
public class ThoughtController {

    private ThoughtService thoughtService;
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
    @ApiOperation(value = "adds a like to a thought given a thought and team id", notes = "likeThought")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Created", response = Integer.class)})
    public int likeThought(@PathVariable("thoughtId") String thoughtId, @PathVariable("teamId") String teamId) {
        return thoughtService.likeThought(thoughtId);
    }

    @PutMapping("/api/team/{teamId}/thought/{thoughtId}/discuss")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @ApiOperation(value = "toggles between a thought being discussed or not discussed", notes = "discussThought")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "OK")})
    public ResponseEntity<Void> discussThought(@PathVariable("thoughtId") String thoughtId, @PathVariable("teamId") String teamId) {
        thoughtService.discussThought(thoughtId);

        return ResponseEntity.ok().build();
    }

    @Transactional
    @PutMapping("/api/team/{teamId}/thought/{id}/message")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @ApiOperation(value = "Updates the content of a thought given a thought and team id", notes = "updateThoughtMessage")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "OK")})
    public void updateThoughtMessage(@PathVariable("id") Long id, @RequestBody Thought thought, @PathVariable("teamId") String teamId) {
        thoughtService.updateThoughtMessage(String.valueOf(id), thought.getMessage());
    }

    @GetMapping("/api/team/{teamId}/thoughts")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @ApiOperation(value = "Returns all thoughts given a team id", notes = "getThoughtsForTeam")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "OK", response = Thought.class, responseContainer = "List")})
    public List<Thought> getThoughtsForTeam(@PathVariable("teamId") String teamId) {
        return thoughtService.fetchAllThoughtsByTeam(teamId);
    }

    @Transactional
    @DeleteMapping("/api/team/{teamId}/thoughts")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @ApiOperation(value = "Removes all thoughts given a team id", notes = "clearThoughtsForTeam")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "OK")})
    public void clearThoughtsForTeam(@PathVariable("teamId") String teamId) {
        thoughtService.deleteAllThoughtsByTeamId(teamId);
    }

    @Transactional
    @DeleteMapping("/api/team/{teamId}/thought/{thoughtId}")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @ApiOperation(value = "Removes a thought given a team id and thought id", notes = "clearIndividualThoughtForTeam")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "OK")})
    public void clearIndividualThoughtForTeam(@PathVariable("teamId") String teamId, @PathVariable("thoughtId") Long id) {
        thoughtService.deleteThought(teamId, id);
    }

    @PostMapping("/api/team/{teamId}/thought")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @ApiOperation(value = "Creates a thought given a team id and thought", notes = "createThoughtForTeam")
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "Created"),
            @ApiResponse(code = 400, message = "Path to saved thought is not a valid URI")
    })
    public ResponseEntity<Void> createThoughtForTeam(@PathVariable("teamId") String teamId, @RequestBody Thought thought) throws URISyntaxException {
        URI savedThoughtUri = new URI(thoughtService.createThoughtAndReturnURI(teamId, thought));
        return ResponseEntity.created(savedThoughtUri).build();
    }

    @MessageMapping("/{teamId}/thought/create")
    @SendTo("/topic/{teamId}/thoughts")
    public WebsocketPutResponse<Thought> createThoughtWebsocket(@DestinationVariable("teamId") String teamId, Thought thought, Authentication authentication) {
        if (apiAuthorization.requestIsAuthorized(authentication, teamId)) {
            thought.setTeamId(teamId);
            Thought savedThought = thoughtRepository.save(thought);
            return new WebsocketPutResponse<>(thoughtService.fetchThought(savedThought.getId()));
        }
        return null;
    }

    @MessageMapping("/{teamId}/thought/{thoughtId}/edit")
    @SendTo("/topic/{teamId}/thoughts")
    public WebsocketPutResponse<Thought> moveThoughtWebsocket(@DestinationVariable("teamId") String teamId, @DestinationVariable("thoughtId") Long thoughtId, Thought thought, Authentication authentication) {
        if (apiAuthorization.requestIsAuthorized(authentication, teamId)) {
            Thought savedThought = thoughtRepository.findById(thoughtId).orElseThrow();
            savedThought.setMessage(thought.getMessage());
            savedThought.setDiscussed(thought.isDiscussed());
            savedThought.setHearts(thought.getHearts());
            thoughtRepository.save(savedThought);
            return new WebsocketPutResponse<>(savedThought);
        }
        return null;
    }

    @MessageMapping("/{teamId}/thought/{thoughtId}/move")
    @SendTo("/topic/{teamId}/thoughts")
    public WebsocketPutResponse<Thought> editThoughtWebsocket(@DestinationVariable("teamId") String teamId, @DestinationVariable("thoughtId") Long thoughtId, Thought thought, Authentication authentication) {
        if (apiAuthorization.requestIsAuthorized(authentication, teamId)) {
            Thought savedThought = thoughtRepository.findById(thoughtId).orElseThrow();
            savedThought.setTopic(thought.getTopic());
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

    @Transactional
    @MessageMapping("/v2/{teamId}/thought/delete")
    @SendTo("/topic/{teamId}/thoughts")
    public WebsocketDeleteResponse<Thought> deleteThoughtWebsocket(@DestinationVariable("teamId") String teamId, Thought thought, Authentication authentication) {
        if (!apiAuthorization.requestIsAuthorized(authentication, teamId)) {
            return null;
        }
        thoughtRepository.deleteThoughtByTeamIdAndId(teamId, thought.getId());
        return new WebsocketDeleteResponse<>(thought);
    }

    @Transactional
    @MessageMapping("/v2/{teamId}/thought/deleteAll")
    @SendTo("/topic/{teamId}/thoughts")
    public WebsocketDeleteResponse<Thought> deleteAllThoughtsWebsocket(@DestinationVariable("teamId") String teamId, Authentication authentication) {
        if (!apiAuthorization.requestIsAuthorized(authentication, teamId)) {
            return null;
        }

        thoughtRepository.deleteAllByTeamId(teamId);
        return new WebsocketDeleteResponse<>(Thought.builder().id(-1L).build());
    }
}
