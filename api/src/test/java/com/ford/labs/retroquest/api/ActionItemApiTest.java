package com.ford.labs.retroquest.api;

import com.ford.labs.retroquest.actionitem.ActionItem;
import com.ford.labs.retroquest.actionitem.ActionItemRepository;
import com.ford.labs.retroquest.api.setup.ApiTest;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Tag("api")
public class ActionItemApiTest extends ApiTest {

    @Autowired
    private ActionItemRepository actionItemRepository;

    private String BASE_SUB_URL;
    private String BASE_ENDPOINT_URL;

    @BeforeEach
    public void setup() {
        BASE_SUB_URL = "/topic/" + teamId + "/action-items";
        BASE_ENDPOINT_URL = "/app/" + teamId + "/action-item";
    }

    @AfterEach
    public void teardown() {
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

        session.send(BASE_ENDPOINT_URL + "/create", objectMapper.writeValueAsBytes(sentActionItem));

        ActionItem returnedActionItem = takeObjectInSocket(ActionItem.class);

        assertThat(actionItemRepository.count()).isEqualTo(1);
        assertThat(actionItemRepository.findAll().get(0)).isEqualTo(returnedActionItem);

        assertThat(sentActionItem.getTask()).isEqualTo(returnedActionItem.getTask());
    }

    @Test
    public void should_not_create_action_item_when_unauthorized() throws Exception {
        ActionItem sentActionItem = ActionItem.builder()
                .task("do the thing")
                .build();

        StompSession session = getUnauthorizedSession();
        subscribe(session, BASE_SUB_URL);

        session.send(BASE_ENDPOINT_URL + "/create", objectMapper.writeValueAsBytes(sentActionItem));

        assertThat(takeObjectInSocket(ActionItem.class)).isNull();
    }

    @Test
    public void should_get_edited_action_item() throws Exception {
        ActionItem sentActionItem = ActionItem.builder()
                .task("do the thing")
                .build();

        StompSession session = getAuthorizedSession();
        subscribe(session, BASE_SUB_URL);

        session.send(BASE_ENDPOINT_URL + "/create", objectMapper.writeValueAsBytes(sentActionItem));

        ActionItem savedActionItem = takeObjectInSocket(ActionItem.class);

        ActionItem sentUpdatedActionItem = savedActionItem;
        sentUpdatedActionItem.setTask("edited the thing");

        session.send(BASE_ENDPOINT_URL + "/" + savedActionItem.getId() + "/edit",
                objectMapper.writeValueAsBytes(sentUpdatedActionItem));

        ActionItem returnedUpdatedActionItem = takeObjectInSocket(ActionItem.class);

        assertThat(actionItemRepository.count()).isEqualTo(1);
        assertThat(actionItemRepository.findAll().get(0)).isEqualTo(returnedUpdatedActionItem);

        assertThat(sentUpdatedActionItem.getTask()).isEqualTo(returnedUpdatedActionItem.getTask());
    }

    @Test
    public void should_delete_all_action_items_attached_to_team() throws Exception {
        StompSession session = getAuthorizedSession();
        subscribe(session, BASE_SUB_URL);

        List<ActionItem> savedActionItems = actionItemRepository.saveAll(Arrays.asList(
                ActionItem.builder()
                        .teamId(teamId)
                        .task("do the thing")
                        .build(),
                ActionItem.builder()
                        .teamId("team2")
                        .task("do the thing")
                        .build()
        ));

        ActionItem sameTeamSavedActionItem = savedActionItems.get(0);

        session.send(BASE_ENDPOINT_URL + "/" + sameTeamSavedActionItem.getId() + "/delete", null);

        Long returnActionItemId = takeObjectInSocket(Long.class);

        assertThat(returnActionItemId).isEqualTo(sameTeamSavedActionItem.getId());

        assertThat(actionItemRepository.count()).isEqualTo(1);
        assertThat(actionItemRepository.findAll().get(0)).isEqualTo(savedActionItems.get(1));
    }

    @Test
    public void should_get_action_items_only_for_team_in_token() throws Exception {
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
    public void should_set_action_item_as_completed() throws Exception {

        ActionItem savedActionItem = actionItemRepository.save(ActionItem.builder().teamId(teamId).build());

        mockMvc.perform(put("/api/team/" + teamId + "/action-item/" + savedActionItem.getId() + "/complete")
                .header("Authorization", getBearerAuthToken()))
                .andExpect(status().isOk());

        MvcResult checkThoughtsRequest = mockMvc.perform(get("/api/team/" + teamId + "/action-items")
                .header("Authorization", getBearerAuthToken()))
                .andReturn();

        ActionItem resultActionItem = objectMapper.readValue(checkThoughtsRequest.getResponse().getContentAsByteArray(),
                ActionItem[].class)[0];

        assertThat(resultActionItem.isCompleted()).isTrue();
    }

    @Test
    public void should_set_action_item_as_incomplete() throws Exception {
        ActionItem savedActionItem = actionItemRepository.save(ActionItem.builder()
                .teamId(teamId)
                .completed(true)
                .build());

        mockMvc.perform(put("/api/team/" + teamId + "/action-item/" + savedActionItem.getId() + "/complete")
                .header("Authorization", getBearerAuthToken()))
                .andExpect(status().isOk());

        MvcResult checkThoughtsRequest = mockMvc.perform(get("/api/team/" + teamId + "/action-items")
                .header("Authorization", getBearerAuthToken()))
                .andReturn();

        ActionItem resultActionItem = objectMapper.readValue(checkThoughtsRequest.getResponse().getContentAsByteArray(), ActionItem[].class)[0];

        assertThat(resultActionItem.isCompleted()).isFalse();
    }

    @Test
    public void should_delete_action_items_for_team_in_token() throws Exception {
        ActionItem actionItem1 = ActionItem.builder().teamId(teamId).build();

        ActionItem actionItem2 = ActionItem.builder()
                .teamId(teamId)
                .task("Please don't be deleted")
                .build();

        ActionItem actionItem3 = ActionItem.builder().teamId(teamId).build();

        actionItemRepository.saveAll(Arrays.asList(actionItem1, actionItem2, actionItem3));

        mockMvc.perform(delete("/api/team/" + teamId + "/action-item/" + actionItem1.getId())
                .header("Authorization", getBearerAuthToken()))
                .andExpect(status().isOk());

        mockMvc.perform(delete("/api/team/" + teamId + "/action-item/" + actionItem3.getId())
                .header("Authorization", getBearerAuthToken()))
                .andExpect(status().isOk());

        MvcResult returnedActionItems = mockMvc.perform(get("/api/team/" + teamId + "/action-items")
                .header("Authorization", getBearerAuthToken()))
                .andExpect(status().isOk())
                .andReturn();

        ActionItem[] actionItems = objectMapper.readValue(returnedActionItems.getResponse().getContentAsByteArray(),
                ActionItem[].class);

        assertThat(actionItems).hasSize(1);
        assertThat(actionItems[0]).isEqualTo(actionItem2);
    }

    @Test
    public void should_edit_action_item() throws Exception {

        ActionItem savedActionItem = actionItemRepository.save(ActionItem.builder()
                .task("I AM A TEMPORARY TASK")
                .teamId(teamId)
                .build());

        ActionItem sentActionItem = savedActionItem;
        sentActionItem.setTask("i am updated");

        mockMvc.perform(put("/api/team/" + teamId + "/action-item/" + savedActionItem.getId() + "/task")
                .content(objectMapper.writeValueAsBytes(sentActionItem))
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", getBearerAuthToken()))
                .andExpect(status().isOk());

        assertThat(actionItemRepository.count()).isEqualTo(1);
        assertThat(actionItemRepository.findAll().get(0)).isEqualTo(sentActionItem);
    }

    @Test
    public void should_add_assignee_to_action_item() throws Exception {
        ActionItem savedActionItem = actionItemRepository.save(ActionItem.builder()
                .task(teamId)
                .teamId("suchateam")
                .build());

        ActionItem sentActionItem = savedActionItem;
        sentActionItem.setAssignee("heyo!");

        mockMvc.perform(put("/api/team/" + teamId + "/action-item/" + savedActionItem.getId() + "/assignee")
                .content(objectMapper.writeValueAsBytes(sentActionItem))
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", getBearerAuthToken()))
                .andExpect(status().isOk())
                .andReturn();

        assertThat(actionItemRepository.count()).isEqualTo(1);
        assertThat(actionItemRepository.findAll().get(0)).isEqualTo(sentActionItem);
    }

    @Test
    public void should_authenticate_all_action_item_endpoints_properly() throws Exception {
        String unauthorizedTeamJwt = jwtBuilder.buildJwt("not-beach-bums");

        ActionItem savedActionItem = actionItemRepository.save(ActionItem.builder()
                .task("Some Action")
                .teamId("beach-bums")
                .build());

        mockMvc.perform(get("/api/team/beach-bums/action-items")
                .header("Authorization", "Bearer " + unauthorizedTeamJwt))
                .andExpect(status().isForbidden());

        mockMvc.perform(post("/api/team/beach-bums/action-item")
                .header("Authorization", "Bearer " + unauthorizedTeamJwt)
                .content("{}")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

        mockMvc.perform(put("/api/team/beach-bums/action-item/1/task")
                .header("Authorization", "Bearer " + unauthorizedTeamJwt)
                .content("{}")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

        mockMvc.perform(put("/api/team/beach-bums/action-item/1/complete")
                .header("Authorization", "Bearer " + unauthorizedTeamJwt)
                .content("{}")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

        mockMvc.perform(delete("/api/team/beach-bums/action-item/1")
                .header("Authorization", "Bearer " + unauthorizedTeamJwt))
                .andExpect(status().isForbidden());

        assertThat(actionItemRepository.count()).isEqualTo(1);
        assertThat(savedActionItem).isEqualTo(actionItemRepository.findAll().get(0));
    }

}
