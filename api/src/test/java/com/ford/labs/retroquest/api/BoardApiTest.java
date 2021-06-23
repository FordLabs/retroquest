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

package com.ford.labs.retroquest.api;

import com.ford.labs.retroquest.api.setup.ApiTestBase;
import com.ford.labs.retroquest.board.Board;
import com.ford.labs.retroquest.board.BoardRepository;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Tag("api")
class BoardApiTest extends ApiTestBase {

    @Autowired
    private BoardRepository boardRepository;

    @AfterEach
    void teardown() {
        boardRepository.deleteAllInBatch();

        assertThat(boardRepository.count()).isZero();
    }

    @Test
    void should_get_boards_assigned_to_requested_team_with_newest_boards_first() throws Exception {
        Board oldBoard = Board.builder()
                .dateCreated(LocalDate.of(2018, 1, 1))
                .teamId(teamId)
                .thoughts(Collections.emptyList())
                .build();

        Board newBoard = Board.builder()
                .dateCreated(LocalDate.of(2018, 2, 2))
                .teamId(teamId)
                .thoughts(Collections.emptyList())
                .build();

        boardRepository.save(oldBoard);
        boardRepository.save(newBoard);

        mockMvc.perform(get("/api/team/" + teamId + "/boards")
                .header("Authorization", getBearerAuthToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].dateCreated", Matchers.is("2018-02-02")))
                .andExpect(jsonPath("$[1].dateCreated", Matchers.is("2018-01-01")));
    }
}
