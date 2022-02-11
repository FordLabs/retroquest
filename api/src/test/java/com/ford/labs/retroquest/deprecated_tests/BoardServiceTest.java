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

import com.ford.labs.retroquest.actionitem.ActionItemService;
import com.ford.labs.retroquest.board.Board;
import com.ford.labs.retroquest.board.BoardRepository;
import com.ford.labs.retroquest.board.BoardService;
import com.ford.labs.retroquest.thought.Thought;
import com.ford.labs.retroquest.thought.ThoughtService;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class BoardServiceTest {
    private final BoardRepository boardRepository = mock(BoardRepository.class);
    private final ThoughtService thoughtService = mock(ThoughtService.class);
    private final ActionItemService actionItemService = mock(ActionItemService.class);
    private final int pageSize = 2;

    private final BoardService boardService = new BoardService(boardRepository, thoughtService, actionItemService, pageSize);

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
        var subject = new BoardService(boardRepository, thoughtService, actionItemService, pageSize);

        final PageRequest pageRequest = PageRequest.of(
            0,
            pageSize,
            Sort.by(Sort.Order.desc("dateCreated"))
        );

        subject.getBoardsForTeamId("team1", 0);

        verify(boardRepository).findAllByTeamIdOrderByDateCreatedDesc("team1", pageRequest);
    }

    @Test
    void saveBoard() {
        var expectedTeamId = "team1";
        long expectedBoardId = 1234L;
        var expectedMessage = "hello";

        when(thoughtService.fetchAllActiveThoughts(eq(expectedTeamId))).thenReturn(
            List.of(
                new Thought(
                    4321L,
                    expectedMessage,
                    0,
                    null,
                    false,
                    expectedTeamId,
                    null,
                    null
                )
            )
        );

        when(boardRepository.save(any(Board.class))).thenAnswer(a -> {
            var board = a.<Board>getArgument(0);
            board.setId(expectedBoardId);
            return board;
        });

        var returnedBoard = boardService.createBoard(expectedTeamId);

        assertThat(returnedBoard.getId()).isEqualTo(expectedBoardId);
        assertThat(returnedBoard.getTeamId()).isEqualTo(expectedTeamId);
        assertThat(returnedBoard.getDateCreated()).isEqualTo(LocalDate.now());
        assertThat(returnedBoard.getThoughts()).hasSize(1);
        assertThat(returnedBoard.getThoughts().get(0).getBoardId()).isEqualTo(expectedBoardId);
    }


    @Test
    public void endRetro_ShouldSaveAllUnboardedThoughtsOnBoard() {
        var expectedTeamId = "team1";
        var expectedBoardId = 1234L;
        var expectedMessage = "hello";
        var expectedBoard = new Board(
            expectedBoardId,
            expectedTeamId,
            LocalDate.now(),
            List.of(
                new Thought(
                    4321L,
                    expectedMessage,
                    0,
                    null,
                    false,
                    expectedTeamId,
                    null,
                    expectedBoardId
                )
            )
        );

        when(thoughtService.fetchAllActiveThoughts(eq(expectedTeamId))).thenReturn(
                List.of(
                        new Thought(
                                4321L,
                                expectedMessage,
                                0,
                                null,
                                false,
                                expectedTeamId,
                                null,
                                null
                        )
                )
        );

        when(boardRepository.save(any(Board.class))).thenAnswer(a -> {
            var board = a.<Board>getArgument(0);
            board.setId(expectedBoardId);
            return board;
        });

        boardService.endRetro(expectedTeamId);

        var boardCaptor = ArgumentCaptor.forClass(Board.class);
        verify(boardRepository, times(2)).save(boardCaptor.capture());
        assertThat(boardCaptor.getValue()).usingRecursiveComparison().isEqualTo(expectedBoard);
    }

    @Test
    public void endRetro_DoesNotCreateBoardIfNoUnboardedThoughts() {
        var expectedTeamId = "team1";
        when(thoughtService.fetchAllActiveThoughts(eq(expectedTeamId))).thenReturn(new ArrayList<>());

        boardService.endRetro(expectedTeamId);

        verify(boardRepository, times(0)).save(any());
    }

    @Test
    public void endRetro_ArchivesCompletedActionItems() {
        var expectedTeamId = "team1";
        when(thoughtService.fetchAllActiveThoughts(eq(expectedTeamId))).thenReturn(new ArrayList<>());

        boardService.endRetro(expectedTeamId);

        verify(actionItemService).archiveCompletedActionItems(expectedTeamId);
    }
}
