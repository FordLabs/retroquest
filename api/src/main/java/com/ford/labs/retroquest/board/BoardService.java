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

package com.ford.labs.retroquest.board;

import com.ford.labs.retroquest.actionitem.ActionItemService;
import com.ford.labs.retroquest.thought.Thought;
import com.ford.labs.retroquest.thought.ThoughtService;
import com.ford.labs.retroquest.websocket.events.WebsocketEndRetroEvent;
import com.ford.labs.retroquest.websocket.WebsocketService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BoardService {
    private final BoardRepository boardRepository;
    private final ThoughtService thoughtService;
    private final ActionItemService actionItemService;
    private final WebsocketService websocketService;
    private final int pageSize;

    public BoardService(
        BoardRepository boardRepository,
        ThoughtService thoughtService,
        ActionItemService actionItemService,
        WebsocketService websocketService,
        @Value("${app.archive.thought.pageSize}") int pageSize
    ) {
        this.boardRepository = boardRepository;
        this.thoughtService = thoughtService;
        this.actionItemService = actionItemService;
        this.websocketService = websocketService;
        this.pageSize = pageSize;
    }

    public List<Retro> getBoardsForTeamId(String teamId, Integer pageIndex) {
        return this.boardRepository.findAllByTeamIdOrderByDateCreatedDesc(teamId,
                PageRequest.of(
                        pageIndex,
                        pageSize,
                        Sort.by(Sort.Order.desc("dateCreated"))
                )
        ).stream().map(Retro::fromBoard).collect(Collectors.toList());
    }

    public Board createBoard(String teamId) {
        var board = new Board();
        board.setTeamId(teamId);
        board.setDateCreated(LocalDate.now());
        return this.boardRepository.save(board);
    }

    public void endRetro(String teamId) {
        if(this.thoughtService.fetchAllActiveThoughts(teamId).size() > 0) {
            var createdBoard = createBoard(teamId);
            var thoughts = this.thoughtService.fetchAllActiveThoughts(teamId);
            thoughts.forEach(thought -> thought.setBoardId(createdBoard.getId()));
            createdBoard.setThoughts(thoughts);
            this.boardRepository.save(createdBoard);
        }
        actionItemService.archiveCompletedActionItems(teamId);
        websocketService.publishEvent(new WebsocketEndRetroEvent(teamId));
    }
}
