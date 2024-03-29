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
import com.ford.labs.retroquest.thought.Thought;

import java.time.LocalDate;
import java.util.List;

public record Retro(
    Long id,
    String teamId,
    LocalDate dateCreated,
    List<Thought> thoughts,
    List<Column> columns
) {
    public static Retro from(Board board, List<Column> columns) {
        return new Retro(
            board.getId(),
            board.getTeamId(),
            board.getDateCreated(),
            board.getThoughts(),
            columns.stream().sorted().toList()
        );
    }
}
