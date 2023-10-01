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

import com.ford.labs.retroquest.retro.Retro;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping(value = "/api")
@Tag(name = "Board Controller", description = "The controller that manages the retro board")
public class BoardController {

    private final BoardService boardService;

    public BoardController(BoardService boardService) {
        this.boardService = boardService;
    }

    @PostMapping("/team/{teamId}/board")
    @PreAuthorize("@teamAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Saves a board given a team id", description = "saveBoard")
    @ApiResponses(value = {@ApiResponse(responseCode = "201", description = "Created")})
    public ResponseEntity<Void> createBoard(@PathVariable("teamId") String teamId) throws URISyntaxException {
        var board = this.boardService.createBoard(teamId);
        var uri = new URI(String.format("/api/team/%s/board/%s", board.getTeamId(), board.getId()));
        return ResponseEntity.created(uri).build();
    }

    @GetMapping("/team/{teamId}/boards")
    @PreAuthorize("@teamAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Gets a retro board metadata list given a team id and page index", description = "getBoardsForTeamId")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    public ResponseEntity<List<Board>> getBoards(
            @PathVariable("teamId") String teamId,
            @RequestParam(value = "pageIndex", defaultValue = "0") Integer pageIndex,
            @RequestParam(value = "pageSize", defaultValue = "30") Integer pageSize,
            @RequestParam(value = "sortBy", defaultValue = "dateCreated") String sortBy,
            @RequestParam(value = "sortOrder", defaultValue = "DESC") String sortOrder
    ) {
        return this.boardService.getPaginatedBoardListWithHeaders(teamId, pageIndex, pageSize, sortBy, sortOrder);
    }

    @GetMapping("/team/{teamId}/boards/{boardId}")
    @PreAuthorize("@teamAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Gets a single retro board given a team id and board id", description = "getBoardsForTeamId")
    public Retro getBoard(@PathVariable("teamId") String teamId, @PathVariable("boardId") Long boardId) {
        return this.boardService.getArchivedRetroForTeam(teamId, boardId);
    }

    @DeleteMapping("/team/{teamId}/board/{boardId}")
    @PreAuthorize("@teamAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(description = "Deletes a single retro board given a team id and board id")
    public void deleteBoard(@PathVariable("teamId") String teamId, @PathVariable("boardId") Long boardId) {
        this.boardService.deleteBoard(teamId, boardId);
    }

    @DeleteMapping("/team/{teamId}/boards")
    @PreAuthorize("@teamAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(description = "Deletes multiple retro boards given a team id and board ids")
    public void deleteBoards(@PathVariable("teamId") String teamId, @RequestBody @Valid DeleteBoardsRequest request) {
        this.boardService.deleteBoards(teamId, request.boardIds());
    }

    @PutMapping("/team/{teamId}/end-retro")
    @PreAuthorize("@teamAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Ends a retro for a given team", description = "endTeamRetro")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    public void endRetro(@PathVariable("teamId") String teamId) {
        this.boardService.endRetro(teamId);
    }
}
