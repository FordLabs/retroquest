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
import com.ford.labs.retroquest.column.Column;
import com.ford.labs.retroquest.column.ColumnRepository;
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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Tag("api")
class BoardApiTest extends ApiTestBase {

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private ThoughtRepository thoughtRepository;

    @Autowired
    private ColumnRepository columnRepository;

    @Autowired
    private ThoughtService thoughtService;

    private Column column;

    @BeforeEach
    void setup() {
        thoughtRepository.deleteAllInBatch();
        columnRepository.deleteAllInBatch();
        boardRepository.deleteAllInBatch();

        column = columnRepository.save(new Column(null, "happy", "Happy", teamId));
    }

    @Test
    void getBoards_ShouldReturnPaginationInfo() throws Exception {
        setupBoards();
        mockMvc.perform(get("/api/team/" + teamId + "/boards?pageIndex=0&pageSize=2")
                        .header("Authorization", getBearerAuthToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", Matchers.is(2)))
                .andExpect(header().string(
                        "Access-Control-Expose-Headers",
                        "Sort-Order,Sort-By,Page-Index,Page-Size,Total-Board-Count,Total-Pages,Page-Range"
                ))
                .andExpect(header().string("Sort-By", "dateCreated"))
                .andExpect(header().string("Sort-Order", "DESC"))
                .andExpect(header().string("Page-Index", "0"))
                .andExpect(header().string("Page-Size", "2"))
                .andExpect(header().string("Page-Range", "1-2"))
                .andExpect(header().string("Total-Board-Count", "3"))
                .andExpect(header().string("Total-Pages", "2"));

    }

    @Test
    void getBoards_ShouldGetBoardsSortedByDescendingDate() throws Exception {
        setupBoards();
        mockMvc.perform(get("/api/team/" + teamId + "/boards")
                .header("Authorization", getBearerAuthToken()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.size()", Matchers.is(3)))
            .andExpect(jsonPath("$[0].dateCreated", Matchers.is("2018-03-03")))
            .andExpect(jsonPath("$[1].dateCreated", Matchers.is("2018-02-02")))
            .andExpect(jsonPath("$[2].dateCreated", Matchers.is("2018-01-01")));
    }

    @Test
    void getBoards_ShouldGetBoardsSortedByAscendingDate() throws Exception {
        setupBoards();
        mockMvc.perform(get("/api/team/" + teamId + "/boards?sortOrder=ASC")
                        .header("Authorization", getBearerAuthToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", Matchers.is(3)))
                .andExpect(jsonPath("$[0].dateCreated", Matchers.is("2018-01-01")))
                .andExpect(jsonPath("$[1].dateCreated", Matchers.is("2018-02-02")))
                .andExpect(jsonPath("$[2].dateCreated", Matchers.is("2018-03-03")));
    }

    @Test
    void getBoards_ShouldGetPaginatedBoards() throws Exception {
        setupBoards();
        mockMvc.perform(get("/api/team/" + teamId + "/boards?pageIndex=1&pageSize=1")
                        .header("Authorization", getBearerAuthToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", Matchers.is(1)))
                .andExpect(jsonPath("$[0].dateCreated", Matchers.is("2018-02-02")));
    }

    @Test
    void getBoard_ShouldGetFullRetroBoardFromTeamIdAndBoardId() throws Exception {
        Board expectedBoard = boardRepository.save(Board.builder()
                .dateCreated(LocalDate.of(2018, 1, 1))
                .teamId(teamId)
                .thoughts(List.of())
                .build());
        Thought expectedThought = thoughtRepository.save(Thought.builder()
                .boardId(expectedBoard.getId())
                .columnId(column.getId())
                .build());

        mockMvc.perform(get("/api/team/" + teamId + "/boards/" + expectedBoard.getId())
                        .header("Authorization", getBearerAuthToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", Matchers.is(expectedBoard.getId().intValue())))
                .andExpect(jsonPath("$.teamId", Matchers.is(expectedBoard.getTeamId())))
                .andExpect(jsonPath("$.dateCreated", Matchers.is("2018-01-01")))
                .andExpect(jsonPath("$.thoughts[0].id", Matchers.is(expectedThought.getId().intValue())))
                .andExpect(jsonPath("$.columns[0].id", Matchers.is(column.getId().intValue())));
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
        Thought savedThought = thoughtService.createThought(
                teamId,
                new CreateThoughtRequest("TEST_MESSAGE", column.getId())
        );

        mockMvc.perform(put(format("/api/team/%s/end-retro", teamId))
                .header("Authorization", getBearerAuthToken()))
            .andExpect(status().isOk());

        assertThat(boardRepository.count()).isEqualTo(1);
        assertThat(boardRepository.findAllByTeamId(teamId).get(0).getThoughts().get(0).getId()).isEqualTo(savedThought.getId());
    }

    @Test
    public void endRetro_ShouldRemoveThoughtsWithoutABoard() throws Exception {
        Thought savedThought = thoughtService.createThought(
                teamId,
                new CreateThoughtRequest("TEST_MESSAGE", column.getId())
        );

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

    public void setupBoards() {
        Board janBoard = Board.builder()
                .dateCreated(LocalDate.of(2018, 1, 1))
                .teamId(teamId)
                .thoughts(List.of())
                .build();

        Board febBoard = Board.builder()
                .dateCreated(LocalDate.of(2018, 2, 2))
                .teamId(teamId)
                .thoughts(List.of())
                .build();
        Board marBoard = Board.builder()
                .dateCreated(LocalDate.of(2018, 3, 3))
                .teamId(teamId)
                .thoughts(List.of())
                .build();

        Board result1 =  boardRepository.save(janBoard);
        Board result2 =  boardRepository.save(febBoard);
        Board result3 =  boardRepository.save(marBoard);

        thoughtRepository.save(Thought.builder()
                .boardId(result1.getId())
                .columnId(column.getId())
                .build());
        thoughtRepository.save(Thought.builder()
                .boardId(result1.getId())
                .columnId(column.getId())
                .build());
        thoughtRepository.save(Thought.builder()
                .boardId(result2.getId())
                .columnId(column.getId())
                .build());
        thoughtRepository.save(Thought.builder()
                .boardId(result2.getId())
                .columnId(column.getId())
                .build());
        thoughtRepository.save(Thought.builder()
                .boardId(result2.getId())
                .columnId(column.getId())
                .build());
        thoughtRepository.save(Thought.builder()
                .boardId(result3.getId())
                .columnId(column.getId())
                .build());
    }
}
