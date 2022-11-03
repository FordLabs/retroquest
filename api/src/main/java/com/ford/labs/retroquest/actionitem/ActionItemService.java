/*
 * Copyright (c) 2022 Ford Motor Company
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

import com.ford.labs.retroquest.exception.ActionItemDoesNotExistException;
import com.ford.labs.retroquest.websocket.WebsocketService;
import com.ford.labs.retroquest.websocket.events.WebsocketActionItemEvent;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static com.ford.labs.retroquest.websocket.events.WebsocketEventType.DELETE;
import static com.ford.labs.retroquest.websocket.events.WebsocketEventType.UPDATE;

@Service
public class ActionItemService {
    private final ActionItemRepository actionItemRepository;
    private final WebsocketService websocketService;

    public ActionItemService(ActionItemRepository actionItemRepository, WebsocketService websocketService) {
        this.actionItemRepository = actionItemRepository;
        this.websocketService = websocketService;
    }

    public ActionItem createActionItem(String teamId, CreateActionItemRequest request) {
        var actionItem = request.toActionItem();
        actionItem.setTeamId(teamId);
        var savedActionItem = actionItemRepository.save(actionItem);
        websocketService.publishEvent(new WebsocketActionItemEvent(teamId, UPDATE, savedActionItem));
        return savedActionItem;
    }

    public List<ActionItem> getActionItems(String teamId, Optional<Boolean> archived) {
        if(archived.isPresent()) return actionItemRepository.findAllByTeamIdAndArchived(teamId, archived.get());
        else return actionItemRepository.findAllByTeamId(teamId);
    }

    public void updateCompletedStatus(String teamId, Long actionItemId, UpdateActionItemCompletedRequest request) {
        var savedActionItem = fetchActionItem(teamId, actionItemId);
        savedActionItem.setCompleted(request.completed());
        var updatedActionItem = actionItemRepository.save(savedActionItem);
        websocketService.publishEvent(new WebsocketActionItemEvent(teamId, UPDATE, updatedActionItem));
    }

    public ActionItem updateTask(String teamId, Long actionItemId, UpdateActionItemTaskRequest request) {
        var savedActionItem = fetchActionItem(teamId, actionItemId);
        savedActionItem.setTask(request.task());
        var updatedActionItem = actionItemRepository.save(savedActionItem);
        websocketService.publishEvent(new WebsocketActionItemEvent(teamId, UPDATE, updatedActionItem));
        return updatedActionItem;
    }

    public ActionItem updateAssignee(String teamId, Long actionItemId, UpdateActionItemAssigneeRequest request) {
        var savedActionItem = fetchActionItem(teamId, actionItemId);
        savedActionItem.setAssignee(request.assignee());
        var updatedActionItem = actionItemRepository.save(savedActionItem);
        websocketService.publishEvent(new WebsocketActionItemEvent(teamId, UPDATE, updatedActionItem));
        return updatedActionItem;
    }

    public void updateArchivedStatus(String teamId, Long actionItemId, UpdateActionItemArchivedRequest request) {
        var savedActionItem = fetchActionItem(teamId, actionItemId);
        savedActionItem.setArchived(request.archived());
        var updatedActionItem = actionItemRepository.save(savedActionItem);
        websocketService.publishEvent(new WebsocketActionItemEvent(teamId, UPDATE, updatedActionItem));
    }

    public void deleteOneActionItem(String teamId, Long actionItemId) {
        actionItemRepository.deleteActionItemByTeamIdAndId(teamId, actionItemId);
        websocketService.publishEvent(new WebsocketActionItemEvent(teamId, DELETE, ActionItem.builder().id(actionItemId).build()));
    }

    public void deleteMultipleActionItems(String teamId, List<Long> actionItemIds) {
        actionItemRepository.deleteActionItemByTeamIdAndIdIn(teamId, actionItemIds);
    }

    public void archiveCompletedActionItems(String teamId) {
        var itemsToUpdate = actionItemRepository.findAllByTeamIdAndArchivedIsFalseAndCompletedIsTrue(teamId);
        itemsToUpdate.forEach(item -> item.setArchived(true));
        actionItemRepository.saveAll(itemsToUpdate);
    }

    private ActionItem fetchActionItem(String teamId, Long actionItemId) {
        return actionItemRepository.findByTeamIdAndId(teamId, actionItemId).orElseThrow(ActionItemDoesNotExistException::new);
    }
}
