package com.ford.labs.retroquest.api;

import com.ford.labs.retroquest.api.setup.ApiTest;
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
class BoardApiTest extends ApiTest {

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
