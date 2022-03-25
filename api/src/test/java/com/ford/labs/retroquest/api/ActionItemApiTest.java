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

package com.ford.labs.retroquest.api;

import com.ford.labs.retroquest.actionitem.*;
import com.ford.labs.retroquest.api.setup.ApiTestBase;
import com.ford.labs.retroquest.websocket.events.WebsocketActionItemEvent;
import com.ford.labs.retroquest.websocket.WebsocketService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;

import java.util.List;

import static com.ford.labs.retroquest.websocket.events.WebsocketEventType.DELETE;
import static com.ford.labs.retroquest.websocket.events.WebsocketEventType.UPDATE;
import static java.lang.String.format;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Tag("api")
class ActionItemApiTest extends ApiTestBase {

    private String BASE_API_URL;

    @Autowired
    private ActionItemRepository actionItemRepository;

    @MockBean
    private WebsocketService websocketService;

    @BeforeEach
    void setup() {
        BASE_API_URL = format("/api/team/%s/action-item", teamId);
        actionItemRepository.deleteAllInBatch();
    }

    @Test
    public void should_create_action_item() throws Exception {
        ActionItem sentActionItem = ActionItem.builder()
                .task("do the thing")
                .build();

        mockMvc.perform(post(BASE_API_URL)
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsBytes(sentActionItem))
                .header("Authorization", getBearerAuthToken()))
                .andExpect(status().isCreated());


        assertThat(actionItemRepository.count()).isEqualTo(1);
        var actual = actionItemRepository.findAll().get(0);

        assertThat(sentActionItem.getTask()).isEqualTo(actual.getTask());
        verify(websocketService).publishEvent(new WebsocketActionItemEvent(teamId, UPDATE, actual));
    }

    @Test
    void getActionItems_WithoutQueryParameter_ReturnsAllActionItems() throws Exception {
        var createdActionItems = createThreeActionItems(teamId);
        actionItemRepository.saveAll(createdActionItems);

        mockMvc.perform(get(BASE_API_URL)
            .header("Authorization", getBearerAuthToken()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(3))
            .andExpect(jsonPath("$.[0].task").value("Some Action"))
            .andExpect(jsonPath("$.[0].teamId").value(teamId))
            .andExpect(jsonPath("$.[1].task").value("Another Action"))
            .andExpect(jsonPath("$.[1].teamId").value(teamId))
            .andExpect(jsonPath("$.[2].task").value("A Third Action"))
            .andExpect(jsonPath("$.[2].teamId").value(teamId));
    }

    @Test
    public void getActionItems_WithArchivedTrue_ReturnsOnlyArchivedActionItems() throws Exception {
        var createdActionItems = createThreeActionItems(teamId);
        actionItemRepository.saveAll(createdActionItems);

        mockMvc.perform(get(BASE_API_URL + "?archived=true")
                .header("Authorization", getBearerAuthToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$.[0].task").value("A Third Action"))
                .andExpect(jsonPath("$.[0].teamId").value(teamId));
    }

    @Test
    public void getActionItems_WithArchivedFalse_ReturnsOnlyUnarchivedActionItems() throws Exception {
        var createdActionItems = createThreeActionItems(teamId);
        actionItemRepository.saveAll(createdActionItems);

        mockMvc.perform(get(BASE_API_URL + "?archived=false")
                .header("Authorization", getBearerAuthToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$.[0].task").value("Some Action"))
                .andExpect(jsonPath("$.[0].teamId").value(teamId))
                .andExpect(jsonPath("$.[1].task").value("Another Action"))
                .andExpect(jsonPath("$.[1].teamId").value(teamId));
    }

    @Test
    void should_set_action_item_as_completed() throws Exception {
        ActionItem savedActionItem = actionItemRepository.save(ActionItem.builder().teamId(teamId).completed(true).build());

        var request = new UpdateActionItemCompletedRequest(false);

        mockMvc.perform(put(format(BASE_API_URL + "/%d/completed", savedActionItem.getId()))
            .content(objectMapper.writeValueAsBytes(request))
            .contentType(MediaType.APPLICATION_JSON)
            .header("Authorization", getBearerAuthToken()))
            .andExpect(status().isOk());

        assertThat(actionItemRepository.count()).isEqualTo(1);
        var actual = actionItemRepository.findAll().get(0);
        assertThat(actual.getTask()).isEqualTo(actual.getTask());
        assertThat(actual.isCompleted()).isFalse();
        verify(websocketService).publishEvent(new WebsocketActionItemEvent(teamId, UPDATE, actual));
    }

    @Test
    void should_delete_action_items_for_team_in_token() throws Exception {
        var actionItem1 = actionItemRepository.save(ActionItem.builder().teamId(teamId).build());
        var actionItem2 = actionItemRepository.save(ActionItem.builder()
            .teamId(teamId)
            .task("Please don't be deleted")
            .build());

        mockMvc.perform(delete(format(BASE_API_URL + "/%d", actionItem1.getId()))
            .header("Authorization", getBearerAuthToken()))
            .andExpect(status().isOk());

        var expectedItem = ActionItem.builder().id(actionItem1.getId()).build();
        var savedActionItems = actionItemRepository.findAll();
        assertThat(savedActionItems).hasSize(1);
        assertThat(savedActionItems.get(0)).usingRecursiveComparison().isEqualTo(actionItem2);
        verify(websocketService).publishEvent(new WebsocketActionItemEvent(teamId, DELETE, expectedItem));
    }

    @Test
    void should_edit_action_item_task() throws Exception {
        ActionItem expectedActionItem = actionItemRepository.save(ActionItem.builder()
            .task("I AM A TEMPORARY TASK")
            .teamId(teamId)
            .build()
        );
        expectedActionItem.setTask("I am updated");

        var request = new UpdateActionItemTaskRequest("I am updated");

        mockMvc.perform(put(format(BASE_API_URL + "/%d/task", expectedActionItem.getId()))
            .content(objectMapper.writeValueAsBytes(request))
            .contentType(MediaType.APPLICATION_JSON)
            .header("Authorization", getBearerAuthToken()))
            .andExpect(status().isOk());

        assertThat(actionItemRepository.count()).isEqualTo(1);
        var actual = actionItemRepository.findAll().get(0);
        assertThat(actual).usingRecursiveComparison().isEqualTo(expectedActionItem);
        verify(websocketService).publishEvent(new WebsocketActionItemEvent(teamId, UPDATE, actual));
    }

    @Test
    void should_add_assignee_to_action_item() throws Exception {
        ActionItem actionItem = actionItemRepository.save(ActionItem.builder()
            .task(teamId)
            .teamId("suchateam")
            .build()
        );

        var request = new UpdateActionItemAssigneeRequest("heyo!");

        mockMvc.perform(put(format(BASE_API_URL + "/%d/assignee", actionItem.getId()))
            .content(objectMapper.writeValueAsBytes(request))
            .contentType(MediaType.APPLICATION_JSON)
            .header("Authorization", getBearerAuthToken()))
            .andExpect(status().isOk());

        assertThat(actionItemRepository.count()).isEqualTo(1);
        var actual = actionItemRepository.findAll().get(0);
        assertThat(actual.getAssignee()).isEqualTo("heyo!");
        verify(websocketService).publishEvent(new WebsocketActionItemEvent(teamId, UPDATE, actual));
    }

    @Test
    public void should_archive_action_item() throws Exception{
        var request = new UpdateActionItemArchivedRequest(true);
        ActionItem actionItem = actionItemRepository.save(ActionItem.builder()
                .task(teamId)
                .teamId("suchateam")
                .build()
        );

        mockMvc.perform(put(format(BASE_API_URL + "/%d/archived", actionItem.getId()))
                .content(objectMapper.writeValueAsBytes(request))
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", getBearerAuthToken()))
                .andExpect(status().isOk());

        assertThat(actionItemRepository.count()).isEqualTo(1);
        var actual = actionItemRepository.findAll().get(0);
        assertThat(actual.isArchived()).isTrue();
        verify(websocketService).publishEvent(new WebsocketActionItemEvent(teamId, UPDATE, actual));
    }

    @Test
    void should_authenticate_all_action_item_endpoints_properly() throws Exception {
        String unauthorizedTeamJwt = jwtBuilder.buildJwt("not-beach-bums");
        String authorizationHeader = format("Bearer %s", unauthorizedTeamJwt);

        ActionItem savedActionItem = actionItemRepository.save(ActionItem.builder()
            .task("Some Action")
            .teamId("beach-bums")
            .build());

        mockMvc.perform(get("/api/team/beach-bums/action-item")
            .header("Authorization", authorizationHeader))
            .andExpect(status().isForbidden());

        mockMvc.perform(post("/api/team/beach-bums/action-item")
            .header("Authorization", authorizationHeader)
            .content("{}")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isForbidden());

        mockMvc.perform(put("/api/team/beach-bums/action-item/1/task")
            .header("Authorization", authorizationHeader)
            .content("{}")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isForbidden());

        mockMvc.perform(put("/api/team/beach-bums/action-item/1/assignee")
                .header("Authorization", authorizationHeader)
                .content("{}")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

        mockMvc.perform(put("/api/team/beach-bums/action-item/1/completed")
            .header("Authorization", authorizationHeader)
            .content("{}")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isForbidden());

        mockMvc.perform(put("/api/team/beach-bums/action-item/1/archived")
                .header("Authorization", authorizationHeader)
                .content("{}")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

        mockMvc.perform(delete("/api/team/beach-bums/action-item/1")
            .header("Authorization", authorizationHeader))
            .andExpect(status().isForbidden());

        assertThat(actionItemRepository.count()).isEqualTo(1);
        assertThat(savedActionItem).isEqualTo(actionItemRepository.findAll().get(0));
    }

    private List<ActionItem> createThreeActionItems(String teamId) {
        ActionItem activeItem = ActionItem.builder()
                .task("Some Action")
                .teamId(teamId)
                .build();

        ActionItem completedItem = ActionItem.builder()
                .task("Another Action")
                .teamId(teamId)
                .completed(true)
                .build();

        ActionItem archivedItem = ActionItem.builder()
                .task("A Third Action")
                .teamId(teamId)
                .completed(true)
                .archived(true)
                .build();

        return List.of(activeItem, completedItem, archivedItem);
    }

}
