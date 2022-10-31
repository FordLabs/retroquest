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
import com.ford.labs.retroquest.column.ColumnService;
import com.ford.labs.retroquest.thought.Thought;
import com.ford.labs.retroquest.thought.ThoughtService;
import com.ford.labs.retroquest.websocket.events.WebsocketEndRetroEvent;
import com.ford.labs.retroquest.websocket.WebsocketService;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.domain.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class BoardServiceTest {
    private final BoardRepository boardRepository = mock(BoardRepository.class);
    private final ColumnService columnService = mock(ColumnService.class);
    private final ThoughtService thoughtService = mock(ThoughtService.class);
    private final ActionItemService actionItemService = mock(ActionItemService.class);
    private final WebsocketService websocketService = mock(WebsocketService.class);

    private final BoardService boardService = new BoardService(boardRepository, columnService, thoughtService, actionItemService, websocketService);

    @Test
    void getPaginatedBoardList_ShouldReturnPagedBoardsSortedByDateInDescendingOrder() {
        var pageSize = 2;
        var pageIndex = 3;
        final PageRequest pageRequest = PageRequest.of(
                pageIndex,
                pageSize,
            Sort.by(Sort.Direction.DESC, "dateCreated")
        );

        var expectedBoard = Board.builder()
                .teamId("team1")
                .dateCreated(LocalDate.of(2012, 12, 12))
                .id(1L)
                .thoughts(List.of())
                .build();

        when(boardRepository.findAllByTeamId("team1", pageRequest)).thenReturn(new PageImpl(List.of(expectedBoard)));

        List<Board> actualBoards = boardService.getPaginatedBoardList("team1", pageIndex, pageSize, "dateCreated", "DESC");
        assertThat(actualBoards).containsExactly(expectedBoard);
    }

    @Test
    void getPaginatedBoardList_ShouldReturnPagedBoardsSortedByDateInAscendingOrder() {
        var pageSize = 2;
        var pageIndex = 0;
        final PageRequest pageRequest = PageRequest.of(
                pageIndex,
                pageSize,
                Sort.by(Sort.Direction.ASC, "dateCreated")
        );

        var expectedBoard = Board.builder()
                .teamId("team1")
                .dateCreated(LocalDate.of(2012, 12, 12))
                .id(1L)
                .thoughts(List.of())
                .build();

        when(boardRepository.findAllByTeamId("team1", pageRequest)).thenReturn(new PageImpl(List.of(expectedBoard)));

        List<Board> actualBoards = boardService.getPaginatedBoardList("team1", pageIndex, pageSize, "dateCreated", "ASC");
        assertThat(actualBoards).containsExactly(expectedBoard);
    }

    @Test
    void createBoard() {
        var expectedTeamId = "team1";
        long expectedBoardId = 1234L;

        when(boardRepository.save(any(Board.class))).thenAnswer(a -> {
            var board = a.<Board>getArgument(0);
            board.setId(expectedBoardId);
            return board;
        });

        var returnedBoard = boardService.createBoard(expectedTeamId);

        assertThat(returnedBoard.getId()).isEqualTo(expectedBoardId);
        assertThat(returnedBoard.getTeamId()).isEqualTo(expectedTeamId);
        assertThat(returnedBoard.getDateCreated()).isEqualTo(LocalDate.now());
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
                    false,
                    expectedTeamId,
                    expectedBoardId,
                    null
                )
            )
        );

        when(thoughtService.fetchAllActiveThoughts(eq(expectedTeamId))).thenReturn(
            List.of(
                new Thought(
                    4321L,
                    expectedMessage,
                    0,
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

    @Test
    public void endRetro_emitsEndRetroEvent() {
        var expectedTeamId = "team1";
        var expectedEvent = new WebsocketEndRetroEvent(expectedTeamId);
        when(thoughtService.fetchAllActiveThoughts(eq(expectedTeamId))).thenReturn(new ArrayList<>());

        boardService.endRetro(expectedTeamId);

        verify(websocketService).publishEvent(expectedEvent);
    }
}
