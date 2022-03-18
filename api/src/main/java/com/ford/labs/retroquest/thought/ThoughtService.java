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

import com.ford.labs.retroquest.column.ColumnTitleRepository;
import com.ford.labs.retroquest.exception.ColumnTitleNotFoundException;
import com.ford.labs.retroquest.exception.ThoughtNotFoundException;
import com.ford.labs.retroquest.websocket.WebsocketService;
import com.ford.labs.retroquest.websocket.WebsocketThoughtEvent;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.ford.labs.retroquest.websocket.WebsocketEventType.DELETE;
import static com.ford.labs.retroquest.websocket.WebsocketEventType.UPDATE;

@Service
public class ThoughtService {

    private final ThoughtRepository thoughtRepository;
    private final ColumnTitleRepository columnTitleRepository;
    private final WebsocketService websocketService;

    public ThoughtService(ThoughtRepository thoughtRepository,
                          ColumnTitleRepository columnTitleRepository,
                          WebsocketService websocketService) {

        this.thoughtRepository = thoughtRepository;
        this.columnTitleRepository = columnTitleRepository;
        this.websocketService = websocketService;
    }

    public Thought fetchThought(Long thoughtId) throws ThoughtNotFoundException {
        return thoughtRepository.findById(thoughtId).orElseThrow(() -> new ThoughtNotFoundException(thoughtId));
    }

    public List<Thought> fetchAllActiveThoughts(String teamId) {
        return thoughtRepository.findAllByTeamIdAndBoardIdIsNull(teamId);
    }

    public Thought likeThought(Long thoughtId) {
        thoughtRepository.incrementHeartCount(thoughtId);
        var thought = fetchThought(thoughtId);
        websocketService.publishEvent(new WebsocketThoughtEvent(thought.getTeamId(), UPDATE, thought));
        return thought;
    }

    public Thought discussThought(Long thoughtId, boolean discussed) {
        var thought = fetchThought(thoughtId);
        thought.setDiscussed(discussed);
        var savedThought = thoughtRepository.save(thought);
        websocketService.publishEvent(new WebsocketThoughtEvent(savedThought.getTeamId(), UPDATE, savedThought));
        return savedThought;
    }

    public Thought updateColumn(Long thoughtId, long columnId) {
        var columnTitle = columnTitleRepository.findById(columnId).orElseThrow(ColumnTitleNotFoundException::new);
        var thought = fetchThought(thoughtId);
        thought.setTopic(columnTitle.getTopic());
        var savedThought = thoughtRepository.save(thought);
        websocketService.publishEvent(new WebsocketThoughtEvent(savedThought.getTeamId(), UPDATE, savedThought));
        return savedThought;
    }

    public Thought updateThoughtMessage(Long thoughtId, String updatedMessage) {
        var returnedThought = fetchThought(thoughtId);
        returnedThought.setMessage(updatedMessage);
        var savedThought = thoughtRepository.save(returnedThought);
        websocketService.publishEvent(new WebsocketThoughtEvent(savedThought.getTeamId(), UPDATE, savedThought));
        return savedThought;
    }

    public void deleteThought(String teamId, Long thoughtId) {
        thoughtRepository.deleteThoughtByTeamIdAndId(teamId, thoughtId);
        websocketService.publishEvent(new WebsocketThoughtEvent(teamId, DELETE, Thought.builder().id(thoughtId).build()));
    }

    public Thought createThought(String teamId, CreateThoughtRequest request) {
        Thought createdThought = createThought(teamId, null, request);
        websocketService.publishEvent(new WebsocketThoughtEvent(teamId, UPDATE, createdThought));
        return createdThought;
    }

    public Thought createThought(String teamId, Long boardId, CreateThoughtRequest request) {
        var thought = new Thought();
        thought.setId(request.id());
        thought.setMessage(request.message());
        thought.setHearts(request.hearts());
        thought.setTopic(request.topic());
        thought.setDiscussed(request.discussed());
        thought.setTeamId(teamId);
        thought.setBoardId(boardId);

        var columnTitle = columnTitleRepository.findByTeamIdAndTopic(teamId, thought.getTopic());
        thought.setColumnTitle(columnTitle);
        return thoughtRepository.save(thought);
    }
}
