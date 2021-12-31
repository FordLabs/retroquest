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
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Arrays;

import static java.lang.String.format;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Tag("api")
class ActionItemApiTest extends ApiTestBase {

    private static final String BASE_API_URL = "/api/team/BeachBums/action-item";

    @Autowired
    private ActionItemRepository actionItemRepository;

    private String BASE_SUB_URL;

    @BeforeEach
    void setup() {
        BASE_SUB_URL = format("/topic/%s/action-items", teamId);
    }

    @AfterEach
    void teardown() {
        actionItemRepository.deleteAllInBatch();

        assertThat(actionItemRepository.count()).isZero();
    }

    @Test
    public void should_create_action_item() throws Exception {
        StompSession session = getAuthorizedSession();
        subscribe(session, BASE_SUB_URL);

        ActionItem sentActionItem = ActionItem.builder()
                .task("do the thing")
                .build();

        mockMvc.perform(post(BASE_API_URL)
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsBytes(sentActionItem))
                .header("Authorization", getBearerAuthToken()))
                .andExpect(status().isCreated());

        ActionItem returnedActionItem = takeObjectInSocket(ActionItem.class);

        assertThat(actionItemRepository.count()).isEqualTo(1);
        assertThat(actionItemRepository.findAll().get(0)).isEqualTo(returnedActionItem);

        assertThat(sentActionItem.getTask()).isEqualTo(returnedActionItem.getTask());
    }

    @Test
    void should_get_action_items_only_for_team_in_token() throws Exception {
        String jwt = jwtBuilder.buildJwt("beach-bums2");

        ActionItem actionItem1 = ActionItem.builder()
            .task("Some Action")
            .teamId("beach-bums2")
            .build();

        ActionItem actionItem2 = ActionItem.builder()
            .task("Another Action")
            .teamId("beach-bums2")
            .build();

        actionItemRepository.saveAll(Arrays.asList(actionItem1, actionItem2));

        mockMvc.perform(get("/api/team/beach-bums2/action-items")
            .header("Authorization", "Bearer " + jwt))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.[0].task").value("Some Action"))
            .andExpect(jsonPath("$.[0].teamId").value("beach-bums2"))
            .andExpect(jsonPath("$.[1].task").value("Another Action"))
            .andExpect(jsonPath("$.[1].teamId").value("beach-bums2"));

    }

    @Test
    void should_set_action_item_as_completed() throws Exception {
        StompSession session = getAuthorizedSession();
        subscribe(session, BASE_SUB_URL);
        ActionItem savedActionItem = actionItemRepository.save(ActionItem.builder().teamId(teamId).completed(true).build());

        var request = new UpdateActionItemCompletedRequest(false);

        mockMvc.perform(put(format(BASE_API_URL + "/%d/completed", savedActionItem.getId()))
            .content(objectMapper.writeValueAsBytes(request))
            .contentType(MediaType.APPLICATION_JSON)
            .header("Authorization", getBearerAuthToken()))
            .andExpect(status().isOk());
        ActionItem emittedActionItem = takeObjectInSocket(ActionItem.class);

        assertThat(actionItemRepository.count()).isEqualTo(1);
        ActionItem updatedActionItem = actionItemRepository.findAll().get(0);
        assertThat(updatedActionItem.isCompleted()).isFalse();
        assertThat(emittedActionItem).usingRecursiveComparison().isEqualTo(updatedActionItem);
    }

    @Test
    void should_delete_action_items_for_team_in_token() throws Exception {
        StompSession session = getAuthorizedSession();
        subscribe(session, BASE_SUB_URL);
        var actionItem1 = actionItemRepository.save(ActionItem.builder().teamId(teamId).build());

        var actionItem2 = actionItemRepository.save(ActionItem.builder()
            .teamId(teamId)
            .task("Please don't be deleted")
            .build());

        var actionItem3 = actionItemRepository.save(ActionItem.builder().teamId(teamId).build());

        var expectedItem = ActionItem.builder().id(actionItem1.getId()).build();

        mockMvc.perform(delete(format(BASE_API_URL + "/%d", actionItem1.getId()))
            .header("Authorization", getBearerAuthToken()))
            .andExpect(status().isOk());
        var emittedEvent = takeObjectInSocket(ActionItem.class);

        mockMvc.perform(delete(format(BASE_API_URL + "/%d", actionItem3.getId()))
            .header("Authorization", getBearerAuthToken()))
            .andExpect(status().isOk());

        MvcResult returnedActionItems = mockMvc.perform(get(BASE_API_URL + "s")
            .header("Authorization", getBearerAuthToken()))
            .andExpect(status().isOk())
            .andReturn();

        ActionItem[] actionItems = objectMapper.readValue(
            returnedActionItems.getResponse().getContentAsByteArray(),
            ActionItem[].class
        );

        assertThat(actionItems).hasSize(1);
        assertThat(actionItems[0]).isEqualTo(actionItem2);
        assertThat(emittedEvent).usingRecursiveComparison().isEqualTo(expectedItem);
    }

    @Test
    void should_edit_action_item_task() throws Exception {
        StompSession session = getAuthorizedSession();
        subscribe(session, BASE_SUB_URL);
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
        ActionItem emittedActionItem = takeObjectInSocket(ActionItem.class);

        assertThat(actionItemRepository.count()).isEqualTo(1);
        ActionItem updatedActionItem = actionItemRepository.findAll().get(0);
        assertThat(updatedActionItem).isEqualTo(expectedActionItem);
        assertThat(emittedActionItem).usingRecursiveComparison().isEqualTo(updatedActionItem);
    }

    @Test
    void should_add_assignee_to_action_item() throws Exception {
        StompSession session = getAuthorizedSession();
        subscribe(session, BASE_SUB_URL);
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
        ActionItem emittedActionItem = takeObjectInSocket(ActionItem.class);

        assertThat(actionItemRepository.count()).isEqualTo(1);
        ActionItem updatedActionItem = actionItemRepository.findAll().get(0);
        assertThat(updatedActionItem.getAssignee()).isEqualTo("heyo!");
        assertThat(emittedActionItem).usingRecursiveComparison().isEqualTo(updatedActionItem);
    }

    @Test
    public void should_archive_action_item() throws Exception{
        StompSession session = getAuthorizedSession();
        subscribe(session, BASE_SUB_URL);
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
        ActionItem emittedActionItem = takeObjectInSocket(ActionItem.class);

        assertThat(actionItemRepository.count()).isEqualTo(1);
        ActionItem updatedActionItem = actionItemRepository.findAll().get(0);
        assertThat(updatedActionItem.isArchived()).isTrue();
        assertThat(emittedActionItem).usingRecursiveComparison().isEqualTo(updatedActionItem);

    }

    @Test
    void should_authenticate_all_action_item_endpoints_properly() throws Exception {
        String unauthorizedTeamJwt = jwtBuilder.buildJwt("not-beach-bums");
        String authorizationHeader = format("Bearer %s", unauthorizedTeamJwt);

        ActionItem savedActionItem = actionItemRepository.save(ActionItem.builder()
            .task("Some Action")
            .teamId("beach-bums")
            .build());

        mockMvc.perform(get("/api/team/beach-bums/action-items")
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

}
