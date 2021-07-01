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
import com.ford.labs.retroquest.board.BoardController;
import com.ford.labs.retroquest.board.BoardService;
import com.ford.labs.retroquest.board.CreateBoardRequest;
import com.ford.labs.retroquest.thought.CreateThoughtRequest;
import com.ford.labs.retroquest.thought.Thought;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BoardControllerTest {
    @Mock
    private BoardService boardService;

    @InjectMocks
    private BoardController controller;

    @Test
    void returnsAllBoardsForTeamWithoutThoughts() {
        var expectedBoard = Board.builder()
                .dateCreated(LocalDate.of(2012, 12, 25))
                .teamId("team-id")
                .id(1L)
                .build();
        var expectedResponse = List.of(expectedBoard);

        when(boardService.getBoardsForTeamId("team-id", 0)).thenReturn(expectedResponse);

        var response = controller.getBoardsForTeamId("team-id", 0);
        assertEquals(expectedResponse, response);
    }

    @Test
    void saveBoardReturnsSavedBoard() {
        var boardToSave = new CreateBoardRequest(
            "team-id",
            List.of(
                new CreateThoughtRequest(
                        -1L,
                    "hello",
                    0,
                    null,
                    false,
                    null,
                    null
                )
            )
        );

        var savedBoard = Board.builder()
                .id(1L)
                .teamId("team-id")
                .dateCreated(LocalDate.now())
                .thoughts(Collections.singletonList(Thought.builder().message("hello").build()))
                .build();

        when(boardService.createBoard(boardToSave)).thenReturn(savedBoard);

        var returnedBoard = controller.saveBoard("team-id", boardToSave);
        assertEquals(savedBoard, returnedBoard);
    }
}
