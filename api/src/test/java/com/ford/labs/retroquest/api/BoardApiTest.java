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
import com.ford.labs.retroquest.board.CreateBoardRequest;
import com.ford.labs.retroquest.thought.CreateThoughtRequest;
import com.ford.labs.retroquest.thought.Thought;
import com.ford.labs.retroquest.thought.ThoughtRepository;
import com.ford.labs.retroquest.thought.ThoughtService;
import org.assertj.core.util.Lists;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Tag("api")
class BoardApiTest extends ApiTestBase {

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private ThoughtRepository thoughtRepository;

    @Autowired
    private ThoughtService thoughtService;

    @AfterEach
    void teardown() {
        boardRepository.deleteAllInBatch();
        thoughtRepository.deleteAllInBatch();

        assertThat(boardRepository.count()).isZero();
        assertThat(thoughtRepository.count()).isZero();
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

    @Test
    void should_save_a_board_with_thoughts() throws Exception {

        Thought savedThought = thoughtService.createThought(teamId, new CreateThoughtRequest(-1L, "TEST_MESSAGE", 0, "happy", false, teamId, -1L));
        CreateBoardRequest request = new CreateBoardRequest(teamId, Lists.emptyList());

        mockMvc.perform(post("/api/team/" + teamId + "/board")
                .content(objectMapper.writeValueAsString(request))
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", getBearerAuthToken()))
                .andExpect(status().isOk());

        assertThat(boardRepository.count()).isEqualTo(1);
        assertThat(thoughtService.fetchAllThoughtsByTeam(teamId)).containsExactly(savedThought);
    }

    @Test
    void should_save_a_board_with_thoughts_and_clear_away_the_thoughts_without_a_board_id() throws Exception {

        Thought savedThought = thoughtService.createThought(teamId, new CreateThoughtRequest(
                -1L,
                "TEST_MESSAGE",
                0,
                "happy",
                false,
                teamId,
                -1L)
        );

        CreateBoardRequest request = new CreateBoardRequest(teamId, Collections.singletonList(
                new CreateThoughtRequest(
                        savedThought.getId(),
                        savedThought.getMessage(),
                        savedThought.getHearts(),
                        savedThought.getTopic(),
                        savedThought.isDiscussed(),
                        savedThought.getTeamId(),
                        -1L
                )
        ));

        mockMvc.perform(post("/api/team/" + teamId + "/board")
                .content(objectMapper.writeValueAsString(request))
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", getBearerAuthToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.thoughts[0].id", Matchers.notNullValue()))
                .andExpect(jsonPath("$.thoughts[0].message", Matchers.is(savedThought.getMessage())))
                .andExpect(jsonPath("$.thoughts[0].hearts", Matchers.is(savedThought.getHearts())))
                .andExpect(jsonPath("$.thoughts[0].discussed", Matchers.is(savedThought.isDiscussed())))
                .andExpect(jsonPath("$.thoughts[0].teamId", Matchers.is(savedThought.getTeamId())))
                .andExpect(jsonPath("$.thoughts[0].boardId", Matchers.notNullValue()));


        assertThat(boardRepository.count()).isEqualTo(1);
        assertThat(thoughtService.fetchAllThoughtsByTeam(teamId)).isEmpty();
    }
}
