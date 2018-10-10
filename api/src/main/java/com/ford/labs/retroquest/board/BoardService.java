package com.ford.labs.retroquest.board;

import org.springframework.stereotype.Service;

@Service
public class BoardService {
    private final BoardRepository boardRepository;

    public BoardService(
            BoardRepository boardRepository
    ) {
        this.boardRepository = boardRepository;
    }


}
