/*
 * Copyright © 2018 Ford Motor Company
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


import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping(value = "/api")
public class BoardController {

    private final BoardService boardService;

    public BoardController (BoardService boardService) {
        this.boardService = boardService;
    }

    @GetMapping("/team/{teamId}/boards")
    @PreAuthorize("#teamId == authentication.principal")
    public List<Board> getBoardsForTeamId(@PathVariable("teamId") String teamId) {
        return this.boardService.getBoardsForTeamId(teamId);
    }

    @PostMapping("/team/{teamId}/board")
    @PreAuthorize("#teamId == authentication.principal")
    public Board saveBoard(@PathVariable("teamId") String teamId, @RequestBody @Valid Board board) {
        return this.boardService.saveBoard(board);
    }

    @Transactional
    @DeleteMapping("/team/{teamId}/board/{boardId}")
    @PreAuthorize("#teamId == authentication.principal")
    public void deleteBoard(@PathVariable("teamId") String teamId, @PathVariable("boardId") Long boardId) {
        this.boardService.deleteBoard(teamId, boardId);
    }
}
