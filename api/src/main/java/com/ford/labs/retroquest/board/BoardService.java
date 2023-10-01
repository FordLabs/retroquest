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

package com.ford.labs.retroquest.board;

import com.ford.labs.retroquest.actionitem.ActionItemService;
import com.ford.labs.retroquest.column.Column;
import com.ford.labs.retroquest.column.ColumnService;
import com.ford.labs.retroquest.retro.Retro;
import com.ford.labs.retroquest.thought.ThoughtService;
import com.ford.labs.retroquest.websocket.WebsocketService;
import com.ford.labs.retroquest.websocket.events.WebsocketEndRetroEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class BoardService {
    private final BoardRepository boardRepository;
    private final ColumnService columnService;
    private final ThoughtService thoughtService;
    private final ActionItemService actionItemService;
    private final WebsocketService websocketService;

    public BoardService(
        BoardRepository boardRepository,
        ColumnService columnService,
        ThoughtService thoughtService,
        ActionItemService actionItemService,
        WebsocketService websocketService
    ) {
        this.boardRepository = boardRepository;
        this.columnService = columnService;
        this.thoughtService = thoughtService;
        this.actionItemService = actionItemService;
        this.websocketService = websocketService;
    }

    public List<Board> getPaginatedBoardList(String teamId, Integer pageIndex, Integer pageSize, String sortBy, String sortOrder) {
        Sort.Direction orderBy = Sort.DEFAULT_DIRECTION;
        if ("ASC".equals(sortOrder)) orderBy = Sort.Direction.ASC;
        if ("DESC".equals(sortOrder)) orderBy = Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(pageIndex, pageSize, Sort.by(orderBy, sortBy));

        Page<Board> pagedResult = this.boardRepository.findAllByTeamId(teamId, pageable);

        if(pagedResult.hasContent()) {
            return pagedResult.getContent();
        } else {
            return new ArrayList<>();
        }
    }

    public ResponseEntity<List<Board>> getPaginatedBoardListWithHeaders(String teamId, Integer pageIndex, Integer pageSize, String sortBy, String sortOrder) {
        List<Board> pageOfBoards = this.getPaginatedBoardList(teamId, pageIndex, pageSize, sortBy, sortOrder);
        Integer totalBoardCount = this.boardRepository.findAllByTeamId(teamId).size();

        var headers = new HttpHeaders();
        headers.add(
                "Access-Control-Expose-Headers",
                "Sort-Order,Sort-By,Page-Index,Page-Size,Total-Board-Count,Total-Pages,Page-Range"
        );
        headers.set("Sort-Order", String.valueOf(sortOrder));
        headers.set("Sort-By", String.valueOf(sortBy));
        headers.set("Page-Index", String.valueOf(pageIndex));
        headers.set("Page-Size", String.valueOf(pageSize));

        var start = pageIndex * pageSize + 1;
        var end = (start - 1) + pageOfBoards.size();
        headers.set("Page-Range", start + "-" + end);
        headers.set("Total-Board-Count", String.valueOf(totalBoardCount));
        int totalPages = (int) Math.ceil((double) totalBoardCount / pageSize);
        headers.set("Total-Pages",  String.valueOf(totalPages));

        return ResponseEntity.ok()
                .headers(headers)
                .body(pageOfBoards);
    }

    public Retro getArchivedRetroForTeam(String teamId, Long boardId) {
        List<Column> columns = columnService.getColumns(teamId);
        Board board = this.boardRepository.findByIdAndTeamId(boardId, teamId);
        return Retro.from(board, columns);
    }

    public Board createBoard(String teamId) {
        var board = new Board();
        board.setTeamId(teamId);
        board.setDateCreated(LocalDate.now());
        return this.boardRepository.save(board);
    }

    public void endRetro(String teamId) {
        if (this.thoughtService.fetchAllActiveThoughts(teamId).size() > 0) {
            var createdBoard = createBoard(teamId);
            var thoughts = this.thoughtService.fetchAllActiveThoughts(teamId);
            thoughts.forEach(thought -> thought.setBoardId(createdBoard.getId()));
            createdBoard.setThoughts(thoughts);
            this.boardRepository.save(createdBoard);
        }
        actionItemService.archiveCompletedActionItems(teamId);
        websocketService.publishEvent(new WebsocketEndRetroEvent(teamId));
    }

    public void deleteBoard(String teamId, Long boardId) {
        boardRepository.deleteBoardByTeamIdAndId(teamId, boardId);
    }

    public void deleteBoards(String teamId, List<Long> boardIds) {
        boardRepository.deleteBoardsByTeamIdAndIdIn(teamId, boardIds);
    }
}
