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
import java.util.Optional;

import static java.lang.String.format;

@RestController
@Tag(name = "Action Item Controller", description = "The controller that manages action items to a board given a team id")
@ApiResponses(value = {
        @ApiResponse(responseCode = "403", description = "Forbidden"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
})
public class ActionItemController {

    private final ActionItemService actionItemService;

    public ActionItemController(ActionItemService actionItemService) {
        this.actionItemService = actionItemService;
    }

    @PostMapping("/api/team/{teamId}/action-item")
    @PreAuthorize("@teamAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Creates an action item given a team id", description = "createActionItemForTeam")
    @ApiResponses(value = {@ApiResponse(responseCode = "201", description = "Created")})
    public ResponseEntity<URI> createActionItemForTeam(
            @PathVariable("teamId") String teamId,
            @RequestBody CreateActionItemRequest request
    ) throws URISyntaxException {
        var actionItem = actionItemService.createActionItem(teamId, request);
        var actionItemUri = new URI(format("/api/team/%s/action-item/%d", teamId, actionItem.getId()));
        return ResponseEntity.created(actionItemUri).build();
    }

    @GetMapping("/api/team/{teamId}/action-item")
    @PreAuthorize("@teamAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Retrieves all action items given a team id", description = "getActionItemsForTeam", parameters = {
            @Parameter(name = "archived", description = "The archived status of the action items")
    })
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    public List<ActionItem> getActionItemsForTeam(@PathVariable("teamId") String teamId, @RequestParam(required = false) Boolean archived) {
        return actionItemService.getActionItems(teamId, Optional.ofNullable(archived));
    }

    @PutMapping("/api/team/{teamId}/action-item/{actionItemId}/completed")
    @PreAuthorize("@teamAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Marks a thought as complete for a given team id", description = "completeActionItem")
    @ApiResponses(value = {@ApiResponse(responseCode = "204", description = "No Content")})
    public void completeActionItem(
            @PathVariable("teamId") String teamId,
            @PathVariable("actionItemId") Long actionItemId,
            @RequestBody UpdateActionItemCompletedRequest request
    ) {
        actionItemService.updateCompletedStatus(teamId, actionItemId, request);
    }

    @PutMapping("/api/team/{teamId}/action-item/{actionItemId}/task")
    @PreAuthorize("@teamAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Updates an action item given a thought id and a team id", description = "updateActionItemTask")
    @ApiResponses(value = {@ApiResponse(responseCode = "204", description = "No Content")})
    public void updateActionItemTask(
        @PathVariable("teamId") String teamId,
        @PathVariable("actionItemId") Long actionItemId,
        @RequestBody UpdateActionItemTaskRequest request
    ) {
        actionItemService.updateTask(teamId, actionItemId, request);
    }

    @PutMapping("/api/team/{teamId}/action-item/{actionItemId}/assignee")
    @PreAuthorize("@teamAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Updates an action item assignee a thought id and a team id", description = "updateActionItemAssignee")
    @ApiResponses(value = {@ApiResponse(responseCode = "204", description = "No Content")})
    public void updateActionItemAssignee(
        @PathVariable("teamId") String teamId,
        @PathVariable("actionItemId") Long actionItemId,
        @RequestBody UpdateActionItemAssigneeRequest request
    ) {
        actionItemService.updateAssignee(teamId, actionItemId, request);
    }

    @PutMapping("/api/team/{teamId}/action-item/{actionItemId}/archived")
    @PreAuthorize("@teamAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Updates an action item's archived status with a thought id and a team id", description = "updateActionItemArchivedStatus")
    @ApiResponses(value = {@ApiResponse(responseCode = "204", description = "No Content")})
    public void updateActionItemArchivedStatus(
            @PathVariable("teamId") String teamId,
            @PathVariable("actionItemId") Long actionItemId,
            @RequestBody UpdateActionItemArchivedRequest request
    ) {
        actionItemService.updateArchivedStatus(teamId, actionItemId, request);
    }

    @Transactional
    @DeleteMapping("/api/team/{teamId}/action-item/{actionItemId}")
    @PreAuthorize("@teamAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Deletes an action item given a team id and action item id", description = "deleteActionItem")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    public void deleteActionItemByTeamIdAndId(@PathVariable("teamId") String teamId, @PathVariable("actionItemId") Long actionItemId) {
        actionItemService.deleteOneActionItem(teamId, actionItemId);
    }

    @Transactional
    @DeleteMapping("/api/team/{teamId}/action-item")
    @PreAuthorize("@teamAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(description = "Deletes multiple action items given a team id and action item ids")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    public void deleteActionItemsByTeamIdAndIds(@PathVariable("teamId") String teamId, @RequestBody() DeleteActionItemsRequest request) {
        actionItemService.deleteMultipleActionItems(teamId, request.actionItemIds());
    }
}
