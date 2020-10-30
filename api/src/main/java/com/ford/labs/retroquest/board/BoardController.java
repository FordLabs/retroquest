/*
 * Copyright © 2020 Ford Motor Company
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


import com.ford.labs.retroquest.api.authorization.ApiAuthorization;
import com.ford.labs.retroquest.feedback.Feedback;
import com.ford.labs.retroquest.thought.Thought;
import com.ford.labs.retroquest.websocket.WebsocketPutResponse;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping(value = "/api")
@Api(tags = {"Board Controller"}, description = "The controller that manages the retro board")
public class BoardController {

    private final BoardService boardService;
    private final ApiAuthorization apiAuthorization;

    public BoardController(BoardService boardService, ApiAuthorization apiAuthorization) {
        this.boardService = boardService;
        this.apiAuthorization = apiAuthorization;
    }

    @GetMapping("/team/{teamId}/boards")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @ApiOperation(value = "Gets a retro board given a team id and page index", notes = "getBoardsForTeamId")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "OK", response = Board.class, responseContainer = "List")})
    public List<Board> getBoardsForTeamId(@PathVariable("teamId") String teamId,
                                          @RequestParam(value = "pageIndex", defaultValue = "0") Integer pageIndex) {
        return this.boardService.getBoardsForTeamId(teamId, pageIndex);
    }

    @PostMapping("/team/{teamId}/board")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @ApiOperation(value = "Saves a board given a team id", notes = "saveBoard")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "OK", response = Board.class)})
    public Board saveBoard(@PathVariable("teamId") String teamId, @RequestBody @Valid Board board) {
        return this.boardService.saveBoard(board);
    }

    @Transactional
    @DeleteMapping("/team/{teamId}/board/{boardId}")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @ApiOperation(value = "deletes a board for a team id", notes = "deleteBoard")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "OK")})
    public void deleteBoard(@PathVariable("teamId") String teamId, @PathVariable("boardId") Long boardId) {
        this.boardService.deleteBoard(teamId, boardId);
    }

    @GetMapping("/team/{teamId}/board/{boardId}/thoughts")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @ApiOperation(value = "Gets all thoughts for a team id and board id", notes = "getThoughtsForBoard")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "OK", response = Thought.class, responseContainer = "List")})
    public List<Thought> getThoughtsForBoard(@PathVariable("teamId") String teamId, @PathVariable("boardId") Long boardId) {
        return this.boardService.getThoughtsForTeamIdAndBoardId(teamId, boardId);
    }

    @MessageMapping("/{teamId}/end-retro")
    @SendTo("/topic/{teamId}/end-retro")
    public WebsocketPutResponse<Object> endRetroWebsocket(@DestinationVariable("teamId") String teamId, Authentication authentication) {
        if (!apiAuthorization.requestIsAuthorized(authentication, teamId)) {
            return null;
        }
        return new WebsocketPutResponse<>(null);
    }
}
