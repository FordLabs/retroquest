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

package com.ford.labs.retroquest.board;

import com.ford.labs.retroquest.thought.Thought;
import com.ford.labs.retroquest.thought.ThoughtRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class BoardService {
    private final BoardRepository boardRepository;
    private final ThoughtRepository thoughtRepository;

    public BoardService(
            BoardRepository boardRepository,
            ThoughtRepository thoughtRepository
    ) {
        this.boardRepository = boardRepository;
        this.thoughtRepository = thoughtRepository;
    }


    public List<Board> getBoardsForTeamId(String teamId) {
        return this.boardRepository.findAllByTeamId(teamId);
    }

    public Board saveBoard(Board board) {
        board.setDateCreated(LocalDate.now());
        board = this.boardRepository.save(board);
        for (Thought thought: board.getThoughts()) {
            thought.setBoardId(board.getId());
            thoughtRepository.save(thought);
        }
        return board;
    }
}
