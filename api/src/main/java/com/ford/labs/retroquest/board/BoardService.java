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

import com.ford.labs.retroquest.thought.Thought;
import com.ford.labs.retroquest.thought.ThoughtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class BoardService {
    private final BoardRepository boardRepository;
    private final ThoughtService thoughtService;

    private final int pageSize;

    public BoardService(
        BoardRepository boardRepository,
        ThoughtService thoughtService,
        @Value("${app.archive.thought.pageSize}") int pageSize
    ) {
        this.boardRepository = boardRepository;
        this.thoughtService = thoughtService;
        this.pageSize = pageSize;
    }


    public List<Board> getBoardsForTeamId(String teamId, Integer pageIndex) {
        return this.boardRepository.findAllByTeamIdOrderByDateCreatedDesc(teamId,
                PageRequest.of(
                        pageIndex,
                        pageSize,
                        Sort.by(Sort.Order.desc("dateCreated"))
                )
        );
    }

    public Board createBoard(CreateBoardRequest request) {
        var board = new Board();
        board.setTeamId(request.getTeamId());
        board.setThoughts(new ArrayList<>());
        board.setDateCreated(LocalDate.now());
        board = this.boardRepository.save(board);
        for (var thoughtRequest : request.getThoughts()) {
            var thought = thoughtService.createThought(request.getTeamId(), board.getId(), thoughtRequest);
            board.getThoughts().add(thought);
        }
        board = this.boardRepository.save(board);
        return board;
    }

    public void deleteBoard(String teamId, Long boardId) {
        this.boardRepository.deleteBoardByTeamIdAndId(teamId, boardId);
    }

    public List<Thought> getThoughtsForTeamIdAndBoardId(String teamID, Long boardId) {
        return this.boardRepository.findByTeamIdAndId(teamID, boardId).getThoughts();
    }
}
