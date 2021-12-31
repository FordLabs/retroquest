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


import com.ford.labs.retroquest.api.authorization.ApiAuthorization;
import com.ford.labs.retroquest.websocket.*;
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

import static com.ford.labs.retroquest.websocket.WebsocketEventType.DELETE;
import static com.ford.labs.retroquest.websocket.WebsocketEventType.UPDATE;
import static java.lang.String.format;

@RestController
@Tag(name = "Action Item Controller", description = "The controller that manages action items to a board given a team id")
public class ActionItemController {

    private final ActionItemRepository actionItemRepository;
    private final ApiAuthorization apiAuthorization;
    private final WebsocketService websocketService;

    public ActionItemController(ActionItemRepository actionItemRepository,
                                ApiAuthorization apiAuthorization, WebsocketService websocketService) {
        this.actionItemRepository = actionItemRepository;
        this.apiAuthorization = apiAuthorization;
        this.websocketService = websocketService;
    }

    @PutMapping("/api/team/{teamId}/action-item/{thoughtId}/complete")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Marks a thought as complete for a given team id", description = "completeActionItem")
    @ApiResponses(value = {@ApiResponse(responseCode = "204", description = "No Content")})
    public void completeActionItem(@PathVariable("thoughtId") Long id, @PathVariable("teamId") String teamId) {
        var actionItem = actionItemRepository.findById(id).orElseThrow();
        actionItem.toggleCompleted();
        actionItemRepository.save(actionItem);
    }

    @PutMapping("/api/team/{teamId}/action-item/{thoughtId}/task")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Updates an action item given a thought id and a team id", description = "updateActionItemTask")
    @ApiResponses(value = {@ApiResponse(responseCode = "204", description = "No Content")})
    public void updateActionItemTask(
        @PathVariable("thoughtId") Long actionItemId,
        @PathVariable("teamId") String teamId,
        @RequestBody UpdateActionItemTaskRequest updatedActionItem
    ) {
        var savedActionItem = actionItemRepository.findById(actionItemId).orElseThrow();
        savedActionItem.setTask(updatedActionItem.getTask());
        actionItemRepository.save(savedActionItem);
    }

    @PutMapping("/api/team/{teamId}/action-item/{thoughtId}/assignee")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Updates an action item assignee a thought id and a team id", description = "updateActionItemAssignee")
    @ApiResponses(value = {@ApiResponse(responseCode = "204", description = "No Content")})
    public void updateActionItemAssignee(
        @PathVariable("thoughtId") Long actionItemId,
        @PathVariable("teamId") String teamId,
        @RequestBody UpdateActionItemAssigneeRequest request
    ) {
        var savedActionItem = actionItemRepository.findById(actionItemId).orElseThrow();
        savedActionItem.setAssignee(request.getAssignee());
        var updatedActionItem = actionItemRepository.save(savedActionItem);
        websocketService.publishEvent(new WebsocketActionItemEvent(teamId, UPDATE, updatedActionItem));
    }

    @GetMapping("/api/team/{teamId}/action-items")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Retrieves all action items given a team id", description = "getActionItemsForTeam")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    public List<ActionItem> getActionItemsForTeam(@PathVariable("teamId") String teamId) {
        return actionItemRepository.findAllByTeamId(teamId);
    }

    @GetMapping("/api/team/{teamId}/action-items/archived")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Retrieves all archived action items given a team id", description = "getArchivedActionItemsForTeam")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    public List<ActionItem> getArchivedActionItemsForTeam(@PathVariable("teamId") String teamId) {
        return actionItemRepository.findAllByTeamIdAndArchivedIsTrue(teamId);
    }

    @PostMapping("/api/team/{teamId}/action-item")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
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
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    public void deleteActionItemByTeamIdAndId(@PathVariable("teamId") String teamId, @PathVariable("id") Long id) {
        actionItemRepository.deleteActionItemByTeamIdAndId(teamId, id);
        websocketService.publishEvent(new WebsocketActionItemEvent(teamId, DELETE, ActionItem.builder().id(id).build()));
    }

    @MessageMapping("/{teamId}/action-item/{actionItemId}/edit")
    @SendTo("/topic/{teamId}/action-items")
    public WebsocketPutResponse<ActionItem> editActionItemWebsocket(@DestinationVariable("teamId") String teamId, @DestinationVariable("actionItemId") Long actionItemId, ActionItem updatedActionItem, Authentication authentication) {
        if (!apiAuthorization.requestIsAuthorized(authentication, teamId)) {
            return null;
        }

        var savedActionItem = actionItemRepository.findById(actionItemId).orElseThrow();
        savedActionItem.setTask(updatedActionItem.getTask());
        savedActionItem.setAssignee(updatedActionItem.getAssignee());
        savedActionItem.setCompleted(updatedActionItem.isCompleted());
        savedActionItem.setArchived(updatedActionItem.isArchived());
        actionItemRepository.save(savedActionItem);
        return new WebsocketPutResponse<>(savedActionItem);
    }

    private ActionItem createActionItem(String teamId, CreateActionItemRequest request) {
        var actionItem = request.toActionItem();
        actionItem.setTeamId(teamId);
        return actionItemRepository.save(actionItem);
    }
}
