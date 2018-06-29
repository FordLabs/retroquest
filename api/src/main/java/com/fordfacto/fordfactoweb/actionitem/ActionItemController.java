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

package com.fordfacto.fordfactoweb.actionitem;


import com.fordfacto.fordfactoweb.websocket.WebsocketDeleteResponse;
import com.fordfacto.fordfactoweb.websocket.WebsocketPutResponse;
import org.springframework.beans.factory.annotation.Autowired;
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
public class ActionItemController {

    @Autowired
    private ActionItemRepository actionItemRepository;

    @PutMapping("/api/team/{teamId}/action-item/{thoughtId}/complete")
    @PreAuthorize("#teamId == authentication.principal")
    public void completeActionItem(@PathVariable("thoughtId") Long id, @PathVariable("teamId") String teamId) {
        final ActionItem actionItem = actionItemRepository.findOne(id);
        actionItem.toggleCompleted();
        actionItemRepository.save(actionItem);
    }

    @PutMapping("/api/team/{teamId}/action-item/{thoughtId}/task")
    @PreAuthorize("#teamId == authentication.principal")
    public void updateActionItemTask(@PathVariable("thoughtId") Long actionItemId, @PathVariable("teamId") String teamId, @RequestBody ActionItem updatedActionItem) {
        ActionItem savedActionItem = actionItemRepository.findOne(actionItemId);
        savedActionItem.setTask(updatedActionItem.getTask());
        actionItemRepository.save(savedActionItem);
    }

    @PutMapping("/api/team/{teamId}/action-item/{thoughtId}/assignee")
    @PreAuthorize("#teamId == authentication.principal")
    public void updateActionItemAssignee(@PathVariable("thoughtId") Long actionItemId, @PathVariable("teamId") String teamId, @RequestBody ActionItem updatedActionItem) {
        ActionItem savedActionItem = actionItemRepository.findOne(actionItemId);
        savedActionItem.setAssignee(updatedActionItem.getAssignee());
        actionItemRepository.save(savedActionItem);
    }

    @GetMapping("/api/team/{teamId}/action-items")
    @PreAuthorize("#teamId == authentication.principal")
    public List<ActionItem> getActionItemsForTeam(@PathVariable("teamId") String teamId) {
        return actionItemRepository.findAllByTeamId(teamId);
    }

    @PostMapping("/api/team/{teamId}/action-item")
    @PreAuthorize("#teamId == authentication.principal")
    public ResponseEntity createActionItemForTeam(@PathVariable("teamId") String teamId, @RequestBody ActionItem actionItem) throws URISyntaxException {
        actionItem.setTeamId(teamId);
        ActionItem savedActionItem = actionItemRepository.save(actionItem);
        URI savedActionItemUri = new URI("/api/team/" + teamId + "/action-item/" + savedActionItem.getId());
        return ResponseEntity.created(savedActionItemUri).build();
    }

    @MessageMapping("/{teamId}/action-item/create")
    @SendTo("/topic/{teamId}/action-items")
    public WebsocketPutResponse<ActionItem> createActionItemWebsocket(@DestinationVariable("teamId") String teamId, ActionItem actionItem, Authentication authentication) {
        if (!authentication.getPrincipal().equals(teamId)) {
            return null;
        }
        actionItem.setTeamId(teamId);
        ActionItem savedActionItem = actionItemRepository.save(actionItem);
        return new WebsocketPutResponse<>(savedActionItem);
    }

    @MessageMapping("/{teamId}/action-item/{actionItemId}/edit")
    @SendTo("/topic/{teamId}/action-items")
    public WebsocketPutResponse<ActionItem> editActionItemWebsocket(@DestinationVariable("teamId") String teamId, @DestinationVariable("actionItemId") Long actionItemId, ActionItem updatedActionItem, Authentication authentication) {
        if (!authentication.getPrincipal().equals(teamId)) {
            return null;
        }

        ActionItem savedActionItem = actionItemRepository.findOne(actionItemId);
        savedActionItem.setTask(updatedActionItem.getTask());
        savedActionItem.setAssignee(updatedActionItem.getAssignee());
        savedActionItem.setCompleted(updatedActionItem.isCompleted());
        actionItemRepository.save(savedActionItem);
        return new WebsocketPutResponse<>(savedActionItem);
    }

    @Transactional
    @MessageMapping("/{teamId}/action-item/{actionItemId}/delete")
    @SendTo("/topic/{teamId}/action-items")
    public WebsocketDeleteResponse<Long> deleteActionItemWebsocket(@DestinationVariable("teamId") String teamId, @DestinationVariable("actionItemId") Long actionItemId, Authentication authentication) {
        if (!authentication.getPrincipal().equals(teamId)) {
            return null;
        }
        actionItemRepository.deleteActionItemByTeamIdAndId(teamId, actionItemId);
        return new WebsocketDeleteResponse<>(actionItemId);
    }

    @Transactional
    @DeleteMapping("/api/team/{teamId}/action-item/{id}")
    @PreAuthorize("#teamId == authentication.principal")
    public void deleteActionItemByTeamIdAndId(@PathVariable("teamId") String teamId, @PathVariable("id") Long id) {
        actionItemRepository.deleteActionItemByTeamIdAndId(teamId, id);
    }
}
