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

import com.ford.labs.retroquest.apiAuthorization.ApiAuthorization;
import com.ford.labs.retroquest.columntitle.ColumnTitle;
import com.ford.labs.retroquest.columntitle.ColumnTitleRepository;
import com.ford.labs.retroquest.websocket.WebsocketDeleteResponse;
import com.ford.labs.retroquest.websocket.WebsocketPutResponse;
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
public class ThoughtController {

    private final ThoughtRepository thoughtRepository;
    private final ColumnTitleRepository columnTitleRepository;
    private final ApiAuthorization apiAuthorization;

    public ThoughtController(ThoughtRepository thoughtRepository,
                             ColumnTitleRepository columnTitleRepository,
                             ApiAuthorization apiAuthorization) {
        this.thoughtRepository = thoughtRepository;
        this.columnTitleRepository = columnTitleRepository;
        this.apiAuthorization = apiAuthorization;
    }

    @PutMapping("/api/team/{teamId}/thought/{thoughtId}/heart")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    public int likeThought(@PathVariable("thoughtId") String thoughtId, @PathVariable("teamId") String teamId) {
        Thought thought = thoughtRepository.findOne(Long.valueOf(thoughtId));
        thought.incrementHearts();
        return thoughtRepository.save(thought).getHearts();
    }

    @PutMapping("/api/team/{teamId}/thought/{thoughtId}/discuss")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    public ResponseEntity discussThought(@PathVariable("thoughtId") String thoughtId, @PathVariable("teamId") String teamId) {
        Thought thought = thoughtRepository.findOne(Long.valueOf(thoughtId));

        thought.setDiscussed(!thought.isDiscussed());
        thoughtRepository.save(thought);

        return ResponseEntity.ok().build();
    }

    @Transactional
    @PutMapping("/api/team/{teamId}/thought/{id}/message")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    public void updateThought(@PathVariable("id") Long id, @RequestBody Thought thought, @PathVariable("teamId") String teamId) {
        Thought returnedThought = thoughtRepository.findOne(id);
        returnedThought.setMessage(thought.getMessage());
        thoughtRepository.save(returnedThought);
    }

    @GetMapping("/api/team/{teamId}/thoughts")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    public List<Thought> getThoughtsForTeam(@PathVariable("teamId") String teamId) {
        return thoughtRepository.findAllByTeamIdAndBoardIdIsNull(teamId);
    }

    @Transactional
    @DeleteMapping("/api/team/{teamId}/thoughts")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    public void clearThoughtsForTeam(@PathVariable("teamId") String teamId) {
        thoughtRepository.deleteAllByTeamId(teamId);
    }

    @Transactional
    @DeleteMapping("/api/team/{teamId}/thought/{thoughtId}")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    public void clearIndividualThoughtForTeam(@PathVariable("teamId") String teamId, @PathVariable("thoughtId") Long id) {
        thoughtRepository.deleteThoughtByTeamIdAndId(teamId, id);
    }

    @PostMapping("/api/team/{teamId}/thought")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    public ResponseEntity createThoughtForTeam(@PathVariable("teamId") String teamId, @RequestBody Thought thought) throws URISyntaxException {
        thought.setTeamId(teamId);

        ColumnTitle columnTitle = columnTitleRepository.findByTeamIdAndAndTopic(teamId, thought.getTopic());
        thought.setColumnTitle(columnTitle);

        Thought save = thoughtRepository.save(thought);

        URI savedThoughtUri = new URI("/api/team/" + teamId + "/thought/" + save.getId());
        return ResponseEntity.created(savedThoughtUri).build();
    }

    @MessageMapping("/{teamId}/thought/create")
    @SendTo("/topic/{teamId}/thoughts")
    public WebsocketPutResponse<Thought> createThoughtWebsocket(@DestinationVariable("teamId") String teamId, Thought thought, Authentication authentication) {
        if (apiAuthorization.requestIsAuthorized(authentication, teamId)) {
            thought.setTeamId(teamId);
            Thought savedThought = thoughtRepository.save(thought);
            return new WebsocketPutResponse<>(thoughtRepository.findOne(savedThought.getId()));
        }
        return null;
    }

    @MessageMapping("/{teamId}/thought/{thoughtId}/edit")
    @SendTo("/topic/{teamId}/thoughts")
    public WebsocketPutResponse<Thought> editThoughtWebsocket(@DestinationVariable("teamId") String teamId, @DestinationVariable("thoughtId") Long thoughtId, Thought thought, Authentication authentication) {
        if (apiAuthorization.requestIsAuthorized(authentication, teamId)) {
            Thought savedThought = thoughtRepository.findOne(thoughtId);
            savedThought.setMessage(thought.getMessage());
            savedThought.setDiscussed(thought.isDiscussed());
            savedThought.setHearts(thought.getHearts());
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
