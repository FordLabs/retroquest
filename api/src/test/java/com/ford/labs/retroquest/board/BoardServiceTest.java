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
public class BoardServiceTest {
    @Mock
    private BoardRepository boardRepository;

    @InjectMocks
    private BoardService boardService;

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

        when(boardRepository.findAllByTeamId("team1")).thenReturn(Arrays.asList(savedBoard));

        List<Board> actualBoards = boardService.getBoardsForTeamId("team1");

        assertEquals(Arrays.asList(expectedBoard), actualBoards);
    }

    @Test
    public void saveBoard() {
        Board boardToSave = Board.builder()
                .teamId("team1")
                .thoughts(Arrays.asList(Thought.builder().message("hello").build()))
                .build();

        Board savedBoard = Board.builder()
                .id(1L)
                .teamId("team1")
                .dateCreated(LocalDate.now())
                .thoughts(Arrays.asList(Thought.builder().message("hello").build()))
                .build();

        when(boardRepository.save(boardToSave)).thenReturn(savedBoard);

        Board returnedBoard = boardService.saveBoard(boardToSave);
        assertEquals(savedBoard, returnedBoard);
    }
}
