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

package com.ford.labs.retroquest.deprecated_tests;

import com.ford.labs.retroquest.board.Board;
import com.ford.labs.retroquest.board.BoardRepository;
import com.ford.labs.retroquest.board.BoardService;
import com.ford.labs.retroquest.thought.Thought;
import com.ford.labs.retroquest.thought.ThoughtRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class BoardServiceTest {
    @Mock
    private BoardRepository boardRepository;

    @Mock
    private ThoughtRepository thoughtRepository;

    private BoardService boardService;

    @BeforeEach
    public void setUp() {
        boardService = new BoardService(boardRepository, thoughtRepository);
    }

    @Test
    public void getBoardsForTeamId() {
        Board expectedBoard = Board.builder()
                .teamId("team1")
                .dateCreated(LocalDate.of(2012, 12, 12))
                .id(1L)
                .build();

        Board savedBoard = Board.builder()
                .teamId("team1")
                .dateCreated(LocalDate.of(2012, 12, 12))
                .id(1L)
                .build();

        boardService.pageSize = 2;

        final PageRequest pageRequest = PageRequest.of(
                0,
                boardService.pageSize,
                Sort.by(Sort.Order.desc("dateCreated"))
        );


        when(boardRepository.findAllByTeamIdOrderByDateCreatedDesc("team1", pageRequest))
                .thenReturn(Collections.singletonList(savedBoard));

        List<Board> actualBoards = boardService.getBoardsForTeamId("team1", 0);

        assertEquals(Collections.singletonList(expectedBoard), actualBoards);
    }


    @Test
    public void getBoardsForTeamId_shouldReturnAPagedResult() {

        boardService.pageSize = 5;

        final PageRequest pageRequest = PageRequest.of(
                0,
                boardService.pageSize,
                Sort.by(Sort.Order.desc("dateCreated"))
        );

        boardService.getBoardsForTeamId("team1", 0);

        verify(boardRepository).findAllByTeamIdOrderByDateCreatedDesc("team1", pageRequest);
    }

    @Test
    public void saveBoard() {
        Board boardToSave = Board.builder()
                .teamId("team1")
                .thoughts(Collections.singletonList(Thought.builder().message("hello").build()))
                .build();

        Board savedBoard = Board.builder()
                .id(1L)
                .teamId("team1")
                .dateCreated(LocalDate.now())
                .thoughts(Collections.singletonList(Thought.builder().message("hello").build()))
                .build();

        when(boardRepository.save(boardToSave)).thenReturn(savedBoard);

        Board returnedBoard = boardService.saveBoard(boardToSave);
        assertEquals(savedBoard, returnedBoard);
    }
}
