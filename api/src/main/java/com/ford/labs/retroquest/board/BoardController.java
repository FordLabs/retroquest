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

package com.ford.labs.retroquest.board;


import com.ford.labs.retroquest.security.ApiAuthorization;
import com.ford.labs.retroquest.thought.Thought;
import com.ford.labs.retroquest.websocket.WebsocketPutResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping(value = "/api")
@Tag(name = "Board Controller", description = "The controller that manages the retro board")
public class BoardController {

    private final BoardService boardService;
    private final ApiAuthorization apiAuthorization;

    public BoardController(BoardService boardService, ApiAuthorization apiAuthorization) {
        this.boardService = boardService;
        this.apiAuthorization = apiAuthorization;
    }

    @GetMapping("/team/{teamId}/boards")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Gets a retro board given a team id and page index", description = "getBoardsForTeamId")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    public List<Board> getBoardsForTeamId(@PathVariable("teamId") String teamId,
                                          @RequestParam(value = "pageIndex", defaultValue = "0") Integer pageIndex) {
        return this.boardService.getBoardsForTeamId(teamId, pageIndex);
    }

    @PostMapping("/team/{teamId}/board")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Saves a board given a team id", description = "saveBoard")
    @ApiResponses(value = {@ApiResponse(responseCode = "201", description = "Created")})
    public ResponseEntity<Void> createBoard(@PathVariable("teamId") String teamId) throws URISyntaxException {
        var board = this.boardService.createBoard(teamId);
        var uri = new URI(String.format("/api/team/%s/board/%s", board.getTeamId(), board.getId()));
        return ResponseEntity.created(uri).build();
    }

    @Transactional
    @DeleteMapping("/team/{teamId}/board/{boardId}")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "deletes a board for a team id", description = "deleteBoard")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    public void deleteBoard(@PathVariable("teamId") String teamId, @PathVariable("boardId") Long boardId) {
        this.boardService.deleteBoard(teamId, boardId);
    }

    @GetMapping("/team/{teamId}/board/{boardId}/thoughts")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Gets all thoughts for a team id and board id", description = "getThoughtsForBoard")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    public List<Thought> getThoughtsForBoard(@PathVariable("teamId") String teamId, @PathVariable("boardId") Long boardId) {
        return this.boardService.getThoughtsForTeamIdAndBoardId(teamId, boardId);
    }

    @PutMapping("/team/{teamId}/end-retro")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Ends a retro for a given team", description = "endTeamRetro")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    public void endRetro(@PathVariable("teamId") String teamId) {
        this.boardService.endRetro(teamId);
    }
}
