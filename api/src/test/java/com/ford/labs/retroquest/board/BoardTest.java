package com.ford.labs.retroquest.board;

import org.junit.Test;

import static org.hamcrest.Matchers.typeCompatibleWith;
import static org.junit.Assert.assertThat;

public class BoardTest {
    @Test
    public void shouldBeAbleToCreateABoard() {
        Board board = new Board();
        assertThat(board.getClass(), typeCompatibleWith(Board.class));
    }
}
