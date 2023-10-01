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

import com.ford.labs.retroquest.column.Column;
import com.ford.labs.retroquest.retro.Retro;
import com.ford.labs.retroquest.thought.Thought;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public class RetroTest {
    @Test
    public void from_returnsAllExpectedBoardFields() {
        var column = new Column(3L, "topic", "title", "teamId");
        var thought = new Thought(2L, "A message", 0, false, "teamId", 1L, 3L);
        var board = new Board(1L, "teamId", LocalDate.now(), List.of(thought));
        var retro = Retro.from(board, List.of(column));

        assertThat(retro.id()).isEqualTo(board.getId());
        assertThat(retro.teamId()).isEqualTo(board.getTeamId());
        assertThat(retro.dateCreated()).isEqualTo(board.getDateCreated());
        assertThat(retro.thoughts()).isEqualTo(board.getThoughts());
    }

    @Test
    public void from_returnsColumnsInSavedOrder() {
        var column1 = new Column(2L, "topic", "title", "teamId");
        var column2 = new Column(3L, "topic", "title", "teamId");
        var board = new Board(1L, "teamId", LocalDate.now(), List.of());
        var retro = Retro.from(board, List.of(column2, column1));

        assertThat(retro.columns()).isEqualTo(List.of(column1, column2));
    }
}
