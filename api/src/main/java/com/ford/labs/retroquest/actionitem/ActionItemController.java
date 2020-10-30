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

package com.ford.labs.retroquest.actionitem;


import com.ford.labs.retroquest.api.authorization.ApiAuthorization;
import com.ford.labs.retroquest.websocket.WebsocketDeleteResponse;
import com.ford.labs.retroquest.websocket.WebsocketPutResponse;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
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
@Api(tags = {"Action Item Controller"}, description = "The controller that manages action items to a board given a team id")
public class ActionItemController {

    private final ActionItemRepository actionItemRepository;
    private final ApiAuthorization apiAuthorization;

    public ActionItemController(ActionItemRepository actionItemRepository,
                                ApiAuthorization apiAuthorization) {
        this.actionItemRepository = actionItemRepository;
        this.apiAuthorization = apiAuthorization;
    }

    @PutMapping("/api/team/{teamId}/action-item/{thoughtId}/complete")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @ApiOperation(value = "Marks a thought as complete for a given team id", notes = "completeActionItem")
    @ApiResponses(value = {@ApiResponse(code = 204, message = "No Content")})
    public void completeActionItem(@PathVariable("thoughtId") Long id, @PathVariable("teamId") String teamId) {
        final ActionItem actionItem = actionItemRepository.findById(id).orElseThrow();
        actionItem.toggleCompleted();
        actionItemRepository.save(actionItem);
    }

    @PutMapping("/api/team/{teamId}/action-item/{thoughtId}/task")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @ApiOperation(value = "Updates an action item given a thought id and a team id", notes = "updateActionItemTask")
    @ApiResponses(value = {@ApiResponse(code = 204, message = "No Content")})
    public void updateActionItemTask(@PathVariable("thoughtId") Long actionItemId, @PathVariable("teamId") String teamId, @RequestBody ActionItem updatedActionItem) {
        ActionItem savedActionItem = actionItemRepository.findById(actionItemId).orElseThrow();
        savedActionItem.setTask(updatedActionItem.getTask());
        actionItemRepository.save(savedActionItem);
    }

    @PutMapping("/api/team/{teamId}/action-item/{thoughtId}/assignee")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @ApiOperation(value = "Updates an action item assignee a thought id and a team id", notes = "updateActionItemAssignee")
    @ApiResponses(value = {@ApiResponse(code = 204, message = "No Content")})
    public void updateActionItemAssignee(@PathVariable("thoughtId") Long actionItemId, @PathVariable("teamId") String teamId, @RequestBody ActionItem updatedActionItem) {
        ActionItem savedActionItem = actionItemRepository.findById(actionItemId).orElseThrow();
        savedActionItem.setAssignee(updatedActionItem.getAssignee());
        actionItemRepository.save(savedActionItem);
    }

    @GetMapping("/api/team/{teamId}/action-items")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @ApiOperation(value = "Retrieves all action items given a team id", notes = "getActionItemsForTeam")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "OK", response = ActionItem.class, responseContainer = "List")})
    public List<ActionItem> getActionItemsForTeam(@PathVariable("teamId") String teamId) {
        return actionItemRepository.findAllByTeamId(teamId);
    }

    @GetMapping("/api/team/{teamId}/action-items/archived")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @ApiOperation(value = "Retrieves all archived action items given a team id", notes = "getArchivedActionItemsForTeam")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "OK", response = ActionItem.class, responseContainer = "List")})
    public List<ActionItem> getArchivedActionItemsForTeam(@PathVariable("teamId") String teamId) {
        return actionItemRepository.findAllByTeamIdAndArchivedIsTrue(teamId);
    }

    @PostMapping("/api/team/{teamId}/action-item")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @ApiOperation(value = "Creates an action item given a team id", notes = "createActionItemForTeam")
    @ApiResponses(value = {@ApiResponse(code = 201, message = "Created", response = ResponseEntity.class)})
    public ResponseEntity createActionItemForTeam(@PathVariable("teamId") String teamId, @RequestBody ActionItem actionItem) throws URISyntaxException {
        actionItem.setTeamId(teamId);
        ActionItem savedActionItem = actionItemRepository.save(actionItem);
        URI savedActionItemUri = new URI("/api/team/" + teamId + "/action-item/" + savedActionItem.getId());
        return ResponseEntity.created(savedActionItemUri).build();
    }

    @MessageMapping("/{teamId}/action-item/create")
    @SendTo("/topic/{teamId}/action-items")
    public WebsocketPutResponse<ActionItem> createActionItemWebsocket(@DestinationVariable("teamId") String teamId, ActionItem actionItem, Authentication authentication) {
        if (!apiAuthorization.requestIsAuthorized(authentication, teamId)) {
            return null;
        }
        actionItem.setTeamId(teamId);
        ActionItem savedActionItem = actionItemRepository.save(actionItem);
        return new WebsocketPutResponse<>(savedActionItem);
    }

    @MessageMapping("/{teamId}/action-item/{actionItemId}/edit")
    @SendTo("/topic/{teamId}/action-items")
    public WebsocketPutResponse<ActionItem> editActionItemWebsocket(@DestinationVariable("teamId") String teamId, @DestinationVariable("actionItemId") Long actionItemId, ActionItem updatedActionItem, Authentication authentication) {
        if (!apiAuthorization.requestIsAuthorized(authentication, teamId)) {
            return null;
        }

        ActionItem savedActionItem = actionItemRepository.findById(actionItemId).orElseThrow();
        savedActionItem.setTask(updatedActionItem.getTask());
        savedActionItem.setAssignee(updatedActionItem.getAssignee());
        savedActionItem.setCompleted(updatedActionItem.isCompleted());
        savedActionItem.setArchived(updatedActionItem.isArchived());
        actionItemRepository.save(savedActionItem);
        return new WebsocketPutResponse<>(savedActionItem);
    }

    @Transactional
    @MessageMapping("/{teamId}/action-item/{actionItemId}/delete")
    @SendTo("/topic/{teamId}/action-items")
    public WebsocketDeleteResponse<Long> deleteActionItemWebsocket(@DestinationVariable("teamId") String teamId, @DestinationVariable("actionItemId") Long actionItemId, Authentication authentication) {
        if (!apiAuthorization.requestIsAuthorized(authentication, teamId)) {
            return null;
        }
        actionItemRepository.deleteActionItemByTeamIdAndId(teamId, actionItemId);
        return new WebsocketDeleteResponse<>(actionItemId);
    }

    @Transactional
    @MessageMapping("/{teamId}/action-item/delete")
    @SendTo("/topic/{teamId}/action-items")
    public WebsocketDeleteResponse<ActionItem> deleteActionItem(@DestinationVariable("teamId") String teamId, ActionItem actionItem, Authentication authentication) {
        if (!apiAuthorization.requestIsAuthorized(authentication, teamId)) {
            return null;
        }
        actionItemRepository.deleteActionItemByTeamIdAndId(teamId, actionItem.getId());
        return new WebsocketDeleteResponse<>(actionItem);
    }

    @Transactional
    @DeleteMapping("/api/team/{teamId}/action-item/{id}")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    public void deleteActionItemByTeamIdAndId(@PathVariable("teamId") String teamId, @PathVariable("id") Long id) {
        actionItemRepository.deleteActionItemByTeamIdAndId(teamId, id);
    }
}
