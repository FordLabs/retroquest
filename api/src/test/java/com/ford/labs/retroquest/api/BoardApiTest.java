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
import com.ford.labs.retroquest.column.ColumnTitle;
import com.ford.labs.retroquest.column.ColumnTitleRepository;
import com.ford.labs.retroquest.thought.CreateThoughtRequest;
import com.ford.labs.retroquest.thought.Thought;
import com.ford.labs.retroquest.thought.ThoughtRepository;
import com.ford.labs.retroquest.thought.ThoughtService;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.util.List;

import static java.lang.String.format;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Tag("api")
class BoardApiTest extends ApiTestBase {

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private ThoughtRepository thoughtRepository;

    @Autowired
    private ColumnTitleRepository columnTitleRepository;

    @Autowired
    private ThoughtService thoughtService;

    private ColumnTitle columnTitle;

    @BeforeEach
    void setup() {
        thoughtRepository.deleteAllInBatch();
        columnTitleRepository.deleteAllInBatch();
        boardRepository.deleteAllInBatch();

        columnTitle = columnTitleRepository.save(new ColumnTitle(null, "happy", "Happy", teamId));
    }

    @Test
    void should_get_boards_assigned_to_requested_team_with_newest_boards_first() throws Exception {
        Board oldBoard = Board.builder()
            .dateCreated(LocalDate.of(2018, 1, 1))
            .teamId(teamId)
            .thoughts(List.of())
            .build();

        Board newBoard = Board.builder()
            .dateCreated(LocalDate.of(2018, 2, 2))
            .teamId(teamId)
            .thoughts(List.of())
            .build();

        boardRepository.save(oldBoard);
        boardRepository.save(newBoard);

        mockMvc.perform(get("/api/team/" + teamId + "/boards")
                .header("Authorization", getBearerAuthToken()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].dateCreated", Matchers.is("2018-02-02")))
            .andExpect(jsonPath("$[1].dateCreated", Matchers.is("2018-01-01")));
    }

    @Test
    void createBoard_ShouldCreateBoard() throws Exception {
        mockMvc.perform(post(format("/api/team/%s/board", teamId))
                .header("Authorization", getBearerAuthToken()))
            .andExpect(status().isCreated());

        assertThat(boardRepository.count()).isEqualTo(1);
        var savedBoard = boardRepository.findAll().get(0);
        assertThat(savedBoard.getId()).isNotNull();
        assertThat(savedBoard.getTeamId()).isEqualTo(teamId);
        assertThat(savedBoard.getDateCreated()).isEqualTo(LocalDate.now());
    }

    @Test
    public void createBoard_WithUnauthorizedUser_Returns403() throws Exception {
        mockMvc.perform(post(format("/api/team/%s/board", teamId))
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("unauthorized")))
            .andExpect(status().isForbidden());
    }

    @Test
    public void endRetro_ShouldSaveABoardWithThoughts() throws Exception {
        Thought savedThought = thoughtService.createThought(teamId, new CreateThoughtRequest(null, "TEST_MESSAGE", 0,
            "happy", false, teamId, null, columnTitle.getId()));

        mockMvc.perform(put(format("/api/team/%s/end-retro", teamId))
                .header("Authorization", getBearerAuthToken()))
            .andExpect(status().isOk());

        assertThat(boardRepository.count()).isEqualTo(1);
        assertThat(boardRepository.findAllByTeamId(teamId).get(0).getThoughts().get(0).getId()).isEqualTo(savedThought.getId());
    }

    @Test
    public void endRetro_ShouldRemoveThoughtsWithoutABoard() throws Exception {
        Thought savedThought = thoughtService.createThought(teamId, new CreateThoughtRequest(null, "TEST_MESSAGE", 0,
            "happy", false, teamId, null, columnTitle.getId()));

        mockMvc.perform(put(format("/api/team/%s/end-retro", teamId))
                .header("Authorization", getBearerAuthToken()))
            .andExpect(status().isOk());

        assertThat(boardRepository.count()).isEqualTo(1);
        assertThat(boardRepository.findAllByTeamId(teamId).get(0).getThoughts().get(0).getId()).isEqualTo(savedThought.getId());
    }

    @Test
    public void endRetro_WithUnauthorizedUser_Returns403() throws Exception {
        mockMvc.perform(put(format("/api/team/%s/end-retro", teamId))
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("unauthorized")))
            .andExpect(status().isForbidden());
    }
}
