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

import com.ford.labs.retroquest.api.setup.ApiTestBase;
import com.ford.labs.retroquest.columntitle.ColumnTitle;
import com.ford.labs.retroquest.columntitle.ColumnTitleRepository;
import com.ford.labs.retroquest.exception.ThoughtNotFoundException;
import com.ford.labs.retroquest.thought.MoveThoughtRequest;
import com.ford.labs.retroquest.thought.Thought;
import com.ford.labs.retroquest.thought.ThoughtRepository;
import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.http.MediaType;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Tag("api")
class ThoughtApiTest extends ApiTestBase {

    @Autowired
    private ThoughtRepository thoughtRepository;

    @Autowired
    private ColumnTitleRepository columnTitleRepository;

    private String BASE_SUB_URL;
    private String BASE_ENDPOINT_URL;
    private String BASE_GET_URL;
    private final Moshi moshi = new Moshi.Builder().build();

    @BeforeEach
    void setup() {
        BASE_SUB_URL = "/topic/" + teamId + "/thoughts";
        BASE_ENDPOINT_URL = "/app/" + teamId + "/thought";
        BASE_GET_URL = "/api/team/" + teamId;
    }

    @AfterEach
    void teardown() {
        thoughtRepository.deleteAllInBatch();
        columnTitleRepository.deleteAllInBatch();
        assertThat(thoughtRepository.count()).isZero();
        assertThat(columnTitleRepository.count()).isZero();
    }

    @Test
    void should_like_thought_on_upvote() throws Exception {
        Thought savedThought = thoughtRepository.save(Thought.builder().teamId(teamId).hearts(1).build());

        mockMvc.perform(put("/api/team/" + teamId + "/thought/" + savedThought.getId() + "/heart")
            .header("Authorization", getBearerAuthToken()))
            .andExpect(status().isOk());

        assertThat(thoughtRepository.findById(savedThought.getId()).orElseThrow(() -> new ThoughtNotFoundException(String.valueOf(savedThought.getId()))).getHearts()).isEqualTo(2);
    }

    @Test
    void should_discuss_not_discussed_thought() throws Exception {
        Thought savedThought = thoughtRepository.save(Thought.builder().teamId(teamId).discussed(false).build());

        mockMvc.perform(put("/api/team/" + teamId + "/thought/" + savedThought.getId() + "/discuss")
            .header("Authorization", getBearerAuthToken()))
            .andExpect(status().isOk());

        assertThat(thoughtRepository.findById(savedThought.getId()).orElseThrow(() -> new ThoughtNotFoundException(String.valueOf(savedThought.getId()))).isDiscussed()).isTrue();
    }

    @Test
    void should_update_thought_message() throws Exception {
        Thought savedThought = thoughtRepository.save(Thought.builder().teamId(teamId).message("hello").build());
        Thought updatedThought = Thought.builder().id(savedThought.getId()).teamId(teamId).message("goodbye").build();

        JsonAdapter<Thought> jsonAdapter = moshi.adapter(Thought.class);

        mockMvc.perform(put("/api/team/" + teamId + "/thought/" + savedThought.getId() + "/message")
            .contentType(MediaType.APPLICATION_JSON)
            .content(jsonAdapter.toJson(updatedThought))
            .header("Authorization", getBearerAuthToken()))
            .andExpect(status().isOk());

        assertThat(thoughtRepository.findById(savedThought.getId()).orElseThrow(() -> new ThoughtNotFoundException(String.valueOf(savedThought.getId()))).getMessage()).isEqualTo("goodbye");
    }

    @Test
    void should_return_all_thoughts_by_team_id() throws Exception {
        List<Thought> expectedThoughts = Arrays.asList(
            Thought.builder().teamId(teamId).message("hello").build(),
            Thought.builder().teamId(teamId).message("goodbye").build());

        List<Thought> persistedExpectedThoughts = thoughtRepository.saveAll(expectedThoughts);

        JsonAdapter<List<Thought>> thoughtsAdapter = moshi.adapter(Types.newParameterizedType(List.class, Thought.class));

        MvcResult result = mockMvc.perform(get(String.join("", "/api/team/", teamId, "/thoughts"))
            .contentType(MediaType.APPLICATION_JSON)
            .header("Authorization", getBearerAuthToken()))
            .andExpect(status().isOk())
            .andReturn();

        assertThat(thoughtsAdapter.fromJson(result.getResponse().getContentAsString())).isEqualTo(persistedExpectedThoughts);
    }

    @Test
    void should_delete_all_thoughts_by_team_id() throws Exception {
        List<Thought> savedThoughts = Arrays.asList(
            Thought.builder().teamId(teamId).message("hello").build(),
            Thought.builder().teamId(teamId).message("goodbye").build());
        thoughtRepository.saveAll(savedThoughts);
        assertThat(thoughtRepository.findAll().size()).isEqualTo(2);

        mockMvc.perform(delete(String.join("", "/api/team/", teamId, "/thoughts"))
            .contentType(MediaType.APPLICATION_JSON)
            .header("Authorization", getBearerAuthToken()))
            .andExpect(status().isOk());

        assertThat(thoughtRepository.findAll()).isEmpty();
    }

    @Test
    void should_delete_thoughts_by_thought_id() throws Exception {


        List<Thought> thoughtsToSave = Arrays.asList(
            Thought.builder().teamId(teamId).message("hello").build(),
            Thought.builder().teamId(teamId).message("goodbye").build());

        List<Thought> persistedThoughts = thoughtRepository.saveAll(thoughtsToSave);

        assertThat(thoughtRepository.findAll().size()).isEqualTo(2);

        Thought thoughtToDelete = persistedThoughts.get(0);
        Thought thoughToKeep = persistedThoughts.get(1);

        mockMvc.perform(delete(String.join("", "/api/team/", teamId, "/thought/" + thoughtToDelete.getId()))
            .contentType(MediaType.APPLICATION_JSON)
            .header("Authorization", getBearerAuthToken()))
            .andExpect(status().isOk());

        assertThat(thoughtRepository.exists(Example.of(thoughtToDelete))).isFalse();
        assertThat(thoughtRepository.exists(Example.of(thoughToKeep))).isTrue();

    }

    @Test
    void should_create_thought_no_websocket() throws Exception {
        Thought thoughtToSave = Thought.builder().teamId(teamId).message("hello").build();

        JsonAdapter<Thought> jsonAdapter = moshi.adapter(Thought.class);

        mockMvc.perform(post(String.join("", "/api/team/", teamId, "/thought"))
            .contentType(MediaType.APPLICATION_JSON)
            .content(jsonAdapter.toJson(thoughtToSave))
            .header("Authorization", getBearerAuthToken()))
            .andExpect(status().isCreated());

        assertThat(thoughtRepository.exists(Example.of(thoughtToSave))).isTrue();
    }

    @Test
    void should_delete_all_thoughts_on_team() throws Exception {
        StompSession session = getAuthorizedSession();
        subscribe(session, BASE_SUB_URL);

        thoughtRepository.saveAll(Arrays.asList(
            Thought.builder().teamId(teamId).message("message").build(),
            Thought.builder().teamId("team 2").message("message").build()
        ));

        session.send(BASE_ENDPOINT_URL + "/delete", new byte[0]);

        assertThat(takeObjectInSocket(Long.class)).isEqualTo(-1L);
        assertThat(thoughtRepository.count()).isEqualTo(1);
    }

    @Test
    void should_not_delete_all_thoughts_unauthorized() throws Exception {
        StompSession session = getUnauthorizedSession();
        subscribe(session, BASE_SUB_URL);

        thoughtRepository.save(Thought.builder().teamId(teamId).message("message").build());

        session.send(BASE_ENDPOINT_URL + "/delete", new byte[0]);

        assertThat(thoughtRepository.count()).isEqualTo(1);
    }

    @Test
    void should_edit_thought() throws Exception {
        StompSession session = getAuthorizedSession();
        subscribe(session, BASE_SUB_URL);

        Thought savedThought = thoughtRepository.save(Thought.builder()
            .teamId(teamId)
            .message("message")
            .discussed(false)
            .hearts(1)
            .build());

        Thought sentThought = Thought.builder()
            .id(savedThought.getId())
            .message("message 2")
            .discussed(true)
            .hearts(2)
            .build();

        session.send(BASE_ENDPOINT_URL + "/" + savedThought.getId().toString() + "/edit",
            objectMapper.writeValueAsBytes(sentThought));

        Thought responseThought = takeObjectInSocket(Thought.class);

        Thought updatedThought = thoughtRepository.findById(savedThought.getId()).orElseThrow(Exception::new);

        assertThat(responseThought)
            .usingRecursiveComparison()
            .isEqualTo(responseThought);

        assertThat(updatedThought.getId()).isEqualTo(sentThought.getId());
        assertThat(updatedThought.getMessage()).isEqualTo(sentThought.getMessage());
        assertThat(updatedThought.isDiscussed()).isEqualTo(sentThought.isDiscussed());
        assertThat(updatedThought.getHearts()).isEqualTo(sentThought.getHearts());
    }

    @Test
    void should_not_edit_thought_unauthorized() throws Exception {
        StompSession session = getUnauthorizedSession();
        subscribe(session, BASE_SUB_URL);

        Thought savedThought = thoughtRepository.save(Thought.builder().teamId(teamId).message("message").build());
        Thought sentThought = Thought.builder().id(savedThought.getId()).message("message 2").build();

        session.send(BASE_ENDPOINT_URL + "/" + savedThought.getId().toString() + "/edit",
            objectMapper.writeValueAsBytes(sentThought));

        Thought responseThought = takeObjectInSocket(Thought.class);

        Thought updatedThought = thoughtRepository.findById(savedThought.getId()).orElseThrow(Exception::new);

        assertThat(updatedThought)
            .usingRecursiveComparison()
            .isEqualTo(savedThought);
        assertThat(responseThought).isNull();
    }

    @Test
    void should_create_thought() throws Exception {
        StompSession session = getAuthorizedSession();
        subscribe(session, BASE_SUB_URL);

        Thought sentThought = Thought.builder()
            .teamId(teamId)
            .message("message")
            .build();

        session.send(BASE_ENDPOINT_URL + "/create",
            objectMapper.writeValueAsBytes(sentThought));

        Thought responseThought = takeObjectInSocket(Thought.class);

        Thought savedThought = thoughtRepository.findById(responseThought.getId()).orElseThrow(Exception::new);

        assertThat(savedThought).usingRecursiveComparison()
            .isEqualTo(responseThought);
    }

    @Test
    void should_create_thought_and_assign_column_title() throws Exception {
        StompSession session = getAuthorizedSession();
        subscribe(session, BASE_SUB_URL);

        Thought sentThought = Thought.builder()
            .teamId(teamId)
            .message("message")
            .topic("happy")
            .build();

        ColumnTitle savedColumnTitle = columnTitleRepository.save(ColumnTitle.builder().teamId(teamId).topic("happy").build());

        session.send(BASE_ENDPOINT_URL + "/create",
            objectMapper.writeValueAsBytes(sentThought));

        Thought responseThought = takeObjectInSocket(Thought.class);

        Thought savedThought = thoughtRepository.findById(responseThought.getId()).orElseThrow(Exception::new);

        assertThat(savedThought.getColumnTitle()).isEqualTo(savedColumnTitle);
    }

    @Test
    void should_not_create_thought_unauthorized() throws Exception {
        StompSession session = getUnauthorizedSession();
        subscribe(session, BASE_SUB_URL);

        Thought sentThought = Thought.builder().teamId(teamId).message("message").build();

        session.send(BASE_ENDPOINT_URL + "/create",
            objectMapper.writeValueAsBytes(sentThought));

        Thought responseThought = takeObjectInSocket(Thought.class);

        assertThat(responseThought).isNull();
        assertThat(thoughtRepository.count()).isZero();
    }

    @Test
    void should_get_thoughts_on_same_team() throws Exception {

        List<Thought> savedThoughts = Arrays.asList(
            Thought.builder().message("message 1").teamId(teamId).build(),
            Thought.builder().message("message 2").teamId(teamId).build(),
            Thought.builder().message("message 2").teamId("team 2").build()
        );

        thoughtRepository.saveAll(savedThoughts);

        MvcResult result = mockMvc.perform(get(BASE_GET_URL + "/thoughts")
            .contentType(MediaType.APPLICATION_JSON)
            .header("Authorization", getBearerAuthToken()))
            .andExpect(status().isOk())
            .andReturn();

        Thought[] response = objectMapper.readValue(result.getResponse().getContentAsByteArray(), Thought[].class);

        assertThat(response).hasSize(2);
    }

    @Test
    void should_not_get_thoughts_unauthorized() throws Exception {

        List<Thought> savedThoughts = Collections.singletonList(
            Thought.builder().message("message 1").teamId(teamId).build()
        );

        thoughtRepository.saveAll(savedThoughts);

        mockMvc.perform(get(BASE_GET_URL + "/thoughts")
            .contentType(MediaType.APPLICATION_JSON)
            .header("Authorization", "Bearer " + jwtBuilder.buildJwt("unauthorized")))
            .andExpect(status().isForbidden());
    }

    @Test
    void should_move_thought() throws Exception {
        StompSession session = getAuthorizedSession();
        subscribe(session, BASE_SUB_URL);

        Thought savedThought = thoughtRepository.save(
            Thought.builder()
                .teamId(teamId)
                .topic("hamburgers")
                .message("message")
                .discussed(false)
                .hearts(1)
                .build()
        );

        MoveThoughtRequest sentThought = new MoveThoughtRequest(
            "cheeseburgers"
        );

        session.send(
            String.format("%s/%s/move", BASE_ENDPOINT_URL, savedThought.getId().toString()),
            objectMapper.writeValueAsBytes(sentThought)
        );

        takeObjectInSocket(Thought.class);

        Thought updatedThought = thoughtRepository.findById(savedThought.getId()).orElseThrow(Exception::new);

        assertThat(updatedThought.getId()).isEqualTo(savedThought.getId());
        assertThat(updatedThought.getMessage()).isEqualTo(savedThought.getMessage());
        assertThat(updatedThought.getTopic()).isEqualTo(sentThought.getTopic());
    }

    @Test
    void should_not_move_thought_unauthorized() throws Exception {
        StompSession session = getUnauthorizedSession();
        subscribe(session, BASE_SUB_URL);

        Thought savedThought = thoughtRepository.save(Thought.builder().teamId(teamId).message("message").topic("hamburgers").build());
        Thought sentThought = Thought.builder().id(savedThought.getId()).topic("cheeseburgers").build();

        session.send(BASE_ENDPOINT_URL + "/" + savedThought.getId().toString() + "/move",
            objectMapper.writeValueAsBytes(sentThought));

        Thought responseThought = takeObjectInSocket(Thought.class);

        Thought updatedThought = thoughtRepository.findById(savedThought.getId()).orElseThrow(Exception::new);

        assertThat(updatedThought).usingRecursiveComparison()
            .isEqualTo(savedThought);
        assertThat(responseThought).isNull();
    }
}
