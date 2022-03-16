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

import com.ford.labs.retroquest.column.ColumnTitle;
import com.ford.labs.retroquest.thought.Thought;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

import static com.ford.labs.retroquest.column.Column.fromColumnTitle;
import static org.assertj.core.api.Assertions.assertThat;

public class RetroTest {

    @Test
    public void fromBoard_returnsAllExpectedBoardFields() {
        var columnTitle = new ColumnTitle(3L, "topic", "title", "teamId");
        var thought = new Thought(2L, "A message", 0, "topic", false, "teamId", columnTitle, 1L);
        var board = new Board(1L, "teamId", LocalDate.now(), List.of(thought));
        var retro = Retro.fromBoard(board);

        assertThat(retro.getId()).isEqualTo(board.getId());
        assertThat(retro.getTeamId()).isEqualTo(board.getTeamId());
        assertThat(retro.getDateCreated()).isEqualTo(board.getDateCreated());
        assertThat(retro.getThoughts()).isEqualTo(board.getThoughts());
    }

    @Test
    public void fromBoard_returnsDistinctColumnsFromThoughts() {
        var columnTitle1 = new ColumnTitle(3L, "topic", "title", "teamId");
        var thought1 = new Thought(2L, "A message", 0, "topic", false, "teamId", columnTitle1, 1L);
        var thought2 = new Thought(4L, "A message", 0, "topic", false, "teamId", columnTitle1, 1L);
        var board = new Board(1L, "teamId", LocalDate.now(), List.of(thought1, thought2));
        var retro = Retro.fromBoard(board);

        assertThat(retro.getColumns()).isEqualTo(List.of(fromColumnTitle(columnTitle1)));
    }

    @Test
    public void fromBoard_returnsColumnsInSavedOrder() {
        var columnTitle1 = new ColumnTitle(2L, "topic", "title", "teamId");
        var columnTitle2 = new ColumnTitle(3L, "topic", "title", "teamId");
        var thought1 = new Thought(4L, "A message", 0, "topic", false, "teamId", columnTitle2, 1L);
        var thought2 = new Thought(5L, "A message", 0, "topic", false, "teamId", columnTitle1, 1L);
        var board = new Board(1L, "teamId", LocalDate.now(), List.of(thought1, thought2));
        var retro = Retro.fromBoard(board);

        assertThat(retro.getColumns()).isEqualTo(List.of(fromColumnTitle(columnTitle1), fromColumnTitle(columnTitle2)));
    }

}
