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

package com.ford.labs.retroquest;

import com.ford.labs.retroquest.board.Board;
import com.ford.labs.retroquest.board.BoardController;
import com.ford.labs.retroquest.board.BoardService;
import com.ford.labs.retroquest.thought.Thought;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class BoardControllerTest {
    @Mock
    private BoardService boardService;

    @InjectMocks
    private BoardController controller;

    @Test
    public void returnsAllBoardsForTeamWithoutThoughts() {
        Board expectedBoard = Board.builder()
                .dateCreated(LocalDate.of(2012, 12, 25))
                .teamId("team-id")
                .id(1L)
                .build();

        when(boardService.getBoardsForTeamId("team-id", 0)).thenReturn(Arrays.asList(expectedBoard));

        List<Board> response = controller.getBoardsForTeamId("team-id", 0);
        assertEquals(Arrays.asList(expectedBoard), response);
    }

    @Test
    public void saveBoardReturnsSavedBoard() {
        Board boardToSave = Board.builder()
                .teamId("team-id")
                .thoughts(Arrays.asList(Thought.builder().message("hello").build()))
                .build();

        Board savedBoard = Board.builder()
                .id(1L)
                .teamId("team-id")
                .dateCreated(LocalDate.now())
                .thoughts(Arrays.asList(Thought.builder().message("hello").build()))
                .build();

        when(boardService.saveBoard(boardToSave)).thenReturn(savedBoard);

        Board returnedBoard = controller.saveBoard("team-id", boardToSave);
        assertEquals(savedBoard, returnedBoard);
    }
}