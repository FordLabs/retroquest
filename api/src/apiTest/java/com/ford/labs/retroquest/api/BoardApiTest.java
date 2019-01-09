package com.ford.labs.retroquest.api;

import com.ford.labs.retroquest.board.Board;
import com.ford.labs.retroquest.board.BoardRepository;
import org.hamcrest.Matchers;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.util.Collections;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class BoardApiTest extends ControllerTest {

    @Autowired
    private BoardRepository boardRepository;

    @Test
    public void getBoardsReturnsTeamsBoardsWithNewestFirst() throws Exception {
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

        mockMvc.perform(get("/api/team/"+ teamId + "/boards")
                .header("Authorization", getBearerAuthToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].dateCreated", Matchers.is("2018-02-02")))
                .andExpect(jsonPath("$[1].dateCreated", Matchers.is("2018-01-01")));
    }
}
