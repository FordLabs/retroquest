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

package com.ford.labs.retroquest.deprecated_tests;

import com.ford.labs.retroquest.board.Board;
import com.ford.labs.retroquest.board.BoardRepository;
import com.ford.labs.retroquest.board.BoardService;
import com.ford.labs.retroquest.board.CreateBoardRequest;
import com.ford.labs.retroquest.thought.CreateThoughtRequest;
import com.ford.labs.retroquest.thought.Thought;
import com.ford.labs.retroquest.thought.ThoughtService;
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

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BoardServiceTest {
    @Mock
    private BoardRepository boardRepository;

    @Mock
    private ThoughtService thoughtService;

    private BoardService boardService;

    @BeforeEach
    void setUp() {
        var pageSize = 2;
        boardService = new BoardService(boardRepository, thoughtService, pageSize);
    }

    @Test
    void getBoardsForTeamId() {
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

        final PageRequest pageRequest = PageRequest.of(
            0,
            2,
            Sort.by(Sort.Order.desc("dateCreated"))
        );


        when(boardRepository.findAllByTeamIdOrderByDateCreatedDesc("team1", pageRequest))
            .thenReturn(Collections.singletonList(savedBoard));

        List<Board> actualBoards = boardService.getBoardsForTeamId("team1", 0);

        assertEquals(Collections.singletonList(expectedBoard), actualBoards);
    }


    @Test
    void getBoardsForTeamId_shouldReturnAPagedResult() {
        var pageSize = 5;
        boardService = new BoardService(boardRepository, thoughtService, pageSize);

        final PageRequest pageRequest = PageRequest.of(
            0,
            pageSize,
            Sort.by(Sort.Order.desc("dateCreated"))
        );

        boardService.getBoardsForTeamId("team1", 0);

        verify(boardRepository).findAllByTeamIdOrderByDateCreatedDesc("team1", pageRequest);
    }

    @Test
    void saveBoard() {
        var expectedTeamId = "team1";
        var expectedMessage = "hello";
        var boardToSave = new CreateBoardRequest(
            expectedTeamId,
            List.of(
                new CreateThoughtRequest(
                        0L,
                    expectedMessage,
                    0,
                    null,
                    false,
                    null,
                    null
                )
            )
        );

        when(boardRepository.save(any(Board.class))).thenAnswer(a -> {
            var board = a.<Board>getArgument(0);
            board.setId(1234L);
            return board;
        });
        when(thoughtService.createThought(anyString(), anyLong(), any(CreateThoughtRequest.class)))
            .thenAnswer(a -> {
                var teamId = a.<String>getArgument(0);
                var boardId = a.<Long>getArgument(1);
                var request = a.<CreateThoughtRequest>getArgument(2);
                return new Thought(
                    4321L,
                    request.getMessage(),
                    request.getHearts(),
                    request.getTopic(),
                    request.isDiscussed(),
                    teamId,
                    null,
                    boardId
                );
            });

        var returnedBoard = boardService.createBoard(boardToSave);

        assertThat(returnedBoard.getId()).isEqualTo(1234L);
        assertThat(returnedBoard.getTeamId()).isEqualTo(expectedTeamId);
        assertThat(returnedBoard.getThoughts()).hasSize(1);
        assertThat(returnedBoard.getThoughts().get(0).getBoardId()).isEqualTo(1234L);
    }
}
