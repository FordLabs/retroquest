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

package com.ford.labs.retroquest.actionitem;


import com.ford.labs.retroquest.websocket.events.WebsocketActionItemEvent;
import com.ford.labs.retroquest.websocket.WebsocketService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

import static com.ford.labs.retroquest.websocket.events.WebsocketEventType.DELETE;
import static com.ford.labs.retroquest.websocket.events.WebsocketEventType.UPDATE;
import static java.lang.String.format;

@RestController
@Tag(name = "Action Item Controller", description = "The controller that manages action items to a board given a team id")
@ApiResponses(value = {
        @ApiResponse(responseCode = "403", description = "Forbidden"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
})
public class ActionItemController {

    private final ActionItemRepository actionItemRepository;
    private final WebsocketService websocketService;

    public ActionItemController(ActionItemRepository actionItemRepository, WebsocketService websocketService) {
        this.actionItemRepository = actionItemRepository;
        this.websocketService = websocketService;
    }

    @PutMapping("/api/team/{teamId}/action-item/{thoughtId}/completed")
    @PreAuthorize("@teamAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Marks a thought as complete for a given team id", description = "completeActionItem")
    @ApiResponses(value = {@ApiResponse(responseCode = "204", description = "No Content")})
    public void completeActionItem(
            @PathVariable("thoughtId") Long id,
            @PathVariable("teamId") String teamId,
            @RequestBody UpdateActionItemCompletedRequest request
    ) {
        var actionItem = actionItemRepository.findById(id).orElseThrow();
        actionItem.setCompleted(request.completed());
        var updatedActionItem = actionItemRepository.save(actionItem);
        websocketService.publishEvent(new WebsocketActionItemEvent(teamId, UPDATE, updatedActionItem));
    }

    @PutMapping("/api/team/{teamId}/action-item/{thoughtId}/task")
    @PreAuthorize("@teamAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Updates an action item given a thought id and a team id", description = "updateActionItemTask")
    @ApiResponses(value = {@ApiResponse(responseCode = "204", description = "No Content")})
    public void updateActionItemTask(
        @PathVariable("thoughtId") Long actionItemId,
        @PathVariable("teamId") String teamId,
        @RequestBody UpdateActionItemTaskRequest request
    ) {
        var savedActionItem = actionItemRepository.findById(actionItemId).orElseThrow();
        savedActionItem.setTask(request.task());
        var updatedActionItem = actionItemRepository.save(savedActionItem);
        websocketService.publishEvent(new WebsocketActionItemEvent(teamId, UPDATE, updatedActionItem));
    }

    @PutMapping("/api/team/{teamId}/action-item/{thoughtId}/assignee")
    @PreAuthorize("@teamAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Updates an action item assignee a thought id and a team id", description = "updateActionItemAssignee")
    @ApiResponses(value = {@ApiResponse(responseCode = "204", description = "No Content")})
    public void updateActionItemAssignee(
        @PathVariable("thoughtId") Long actionItemId,
        @PathVariable("teamId") String teamId,
        @RequestBody UpdateActionItemAssigneeRequest request
    ) {
        var savedActionItem = actionItemRepository.findById(actionItemId).orElseThrow();
        savedActionItem.setAssignee(request.assignee());
        var updatedActionItem = actionItemRepository.save(savedActionItem);
        websocketService.publishEvent(new WebsocketActionItemEvent(teamId, UPDATE, updatedActionItem));
    }

    @PutMapping("/api/team/{teamId}/action-item/{actionItemId}/archived")
    @PreAuthorize("@teamAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Updates an action item's archived status with a thought id and a team id", description = "updateActionItemArchivedStatus")
    @ApiResponses(value = {@ApiResponse(responseCode = "204", description = "No Content")})
    public void updateActionItemArchivedStatus(
            @PathVariable String teamId,
            @PathVariable Long actionItemId,
            @RequestBody UpdateActionItemArchivedRequest request
    ) {
        var savedActionItem = actionItemRepository.findById(actionItemId).orElseThrow();
        savedActionItem.setArchived(request.archived());
        var updatedActionItem = actionItemRepository.save(savedActionItem);
        websocketService.publishEvent(new WebsocketActionItemEvent(teamId, UPDATE, updatedActionItem));
    }

    @GetMapping("/api/team/{teamId}/action-item")
    @PreAuthorize("@teamAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Retrieves all action items given a team id", description = "getActionItemsForTeam", parameters = {
        @Parameter(name = "archived", description = "The archived status of the action items")
    })
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    public List<ActionItem> getActionItemsForTeam(@PathVariable("teamId") String teamId, @RequestParam(required = false) Boolean archived) {
        if(archived != null) return actionItemRepository.findAllByTeamIdAndArchived(teamId, archived);
        else return actionItemRepository.findAllByTeamId(teamId);
    }

    @PostMapping("/api/team/{teamId}/action-item")
    @PreAuthorize("@teamAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Creates an action item given a team id", description = "createActionItemForTeam")
    @ApiResponses(value = {@ApiResponse(responseCode = "201", description = "Created")})
    public ResponseEntity<URI> createActionItemForTeam(
        @PathVariable("teamId") String teamId,
        @RequestBody CreateActionItemRequest request
    ) throws URISyntaxException {
        var actionItem = createActionItem(teamId, request);
        var actionItemUri = new URI(format("/api/team/%s/action-item/%d", teamId, actionItem.getId()));
        websocketService.publishEvent(new WebsocketActionItemEvent(teamId, UPDATE, actionItem));
        return ResponseEntity.created(actionItemUri).build();
    }

    @Transactional
    @DeleteMapping("/api/team/{teamId}/action-item/{id}")
    @PreAuthorize("@teamAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Deletes an action item given a team id and action item id", description = "deleteActionItem")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    public void deleteActionItemByTeamIdAndId(@PathVariable("teamId") String teamId, @PathVariable("id") Long id) {
        actionItemRepository.deleteActionItemByTeamIdAndId(teamId, id);
        websocketService.publishEvent(new WebsocketActionItemEvent(teamId, DELETE, ActionItem.builder().id(id).build()));
    }

    private ActionItem createActionItem(String teamId, CreateActionItemRequest request) {
        var actionItem = request.toActionItem();
        actionItem.setTeamId(teamId);
        return actionItemRepository.save(actionItem);
    }
}
