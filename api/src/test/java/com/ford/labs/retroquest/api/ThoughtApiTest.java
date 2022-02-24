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

import com.fasterxml.jackson.core.type.TypeReference;
import com.ford.labs.retroquest.api.setup.ApiTestBase;
import com.ford.labs.retroquest.columntitle.ColumnTitle;
import com.ford.labs.retroquest.columntitle.ColumnTitleRepository;
import com.ford.labs.retroquest.thought.*;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static java.lang.String.format;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Tag("api")
class ThoughtApiTest extends ApiTestBase {

    @Autowired
    private ThoughtRepository thoughtRepository;

    @Autowired
    private ColumnTitleRepository columnTitleRepository;

    private String BASE_API_URL;

    @BeforeEach
    void setup() {
        BASE_API_URL = "/api/team/" + teamId;
    }

    @AfterEach
    void teardown() {
        thoughtRepository.deleteAllInBatch();
        columnTitleRepository.deleteAllInBatch();
    }

    @Test
    void should_like_thought_on_upvote() throws Exception {
        Thought originalThought = thoughtRepository.save(Thought.builder().teamId(teamId).hearts(1).build());

        mockMvc.perform(put("/api/team/" + teamId + "/thought/" + originalThought.getId() + "/heart")
                .header("Authorization", getBearerAuthToken()))
                .andExpect(status().isOk());

        Thought savedThought = thoughtRepository.findById(originalThought.getId()).orElseThrow();
        assertThat(savedThought.getHearts()).isEqualTo(2);
    }

    @Test
    void should_not_like_thought_unauthorized() throws Exception {
        mockMvc.perform(put("/api/team/" + teamId + "/thought/" + 1 + "/heart")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("unauthorized")))
                .andExpect(status().isForbidden());
    }

    @Test
    void should_update_thought_discussion() throws Exception {
        Thought originalThought = thoughtRepository.save(Thought.builder().teamId(teamId).discussed(false).build());

        mockMvc.perform(put("/api/team/" + teamId + "/thought/" + originalThought.getId() + "/discuss")
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new UpdateThoughtDiscussedRequest(true)))
                .header("Authorization", getBearerAuthToken()))
                .andExpect(status().isOk());

        Thought savedThought = thoughtRepository.findById(originalThought.getId()).orElseThrow();
        assertThat(savedThought.isDiscussed()).isTrue();
    }

    @Test
    public void should_not_discuss_thought_unauthorized() throws Exception {
        mockMvc.perform(put("/api/team/" + teamId + "/thought/" + 1 + "/discuss")
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new UpdateThoughtDiscussedRequest(true)))
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("unauthorized")))
                .andExpect(status().isForbidden());
    }

    @Test
    void should_update_thought_message() throws Exception {
        var originalThought = thoughtRepository.save(Thought.builder().teamId(teamId).message("hello").build());
        var updatedMessage = "goodbye";

        mockMvc.perform(put("/api/team/" + teamId + "/thought/" + originalThought.getId() + "/message")
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new UpdateThoughtMessageRequest(updatedMessage)))
                .header("Authorization", getBearerAuthToken()))
                .andExpect(status().isOk());

        var updatedThought = thoughtRepository.findById(originalThought.getId()).orElseThrow();
        assertThat(updatedThought.getMessage()).isEqualTo(updatedMessage);
    }

    @Test
    void should_not_update_thought_message_unauthorized() throws Exception {
        Thought updatedThought = Thought.builder().id(1L).teamId(teamId).message("goodbye").build();

        mockMvc.perform(put("/api/team/" + teamId + "/thought/" + 1 + "/message")
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedThought))
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("unauthorized")))
                .andExpect(status().isForbidden());
    }

    @Test
    public void should_not_move_thought_column_unauthorized() throws Exception {
        MoveThoughtRequest changeRequest = new MoveThoughtRequest(6789L);

        mockMvc.perform(put(format("%s/thought/%d/topic", BASE_API_URL, 1))
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(changeRequest))
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("unauthorized")))
                .andExpect(status().isForbidden());
    }

    @Test
    public void should_move_thought_column() throws Exception {
        ColumnTitle savedColumnTitle = columnTitleRepository.save(new ColumnTitle(null, "cheeseburgers", "CheeseBurgers", teamId));
        MoveThoughtRequest changeRequest = new MoveThoughtRequest(savedColumnTitle.getId());
        Thought savedThought = thoughtRepository.save(
                Thought.builder()
                        .teamId(teamId)
                        .topic("hamburgers")
                        .message("message")
                        .discussed(false)
                        .hearts(1)
                        .build()
        );

        mockMvc.perform(put(format("%s/thought/%d/topic", BASE_API_URL, savedThought.getId()))
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(changeRequest))
                .header("Authorization", getBearerAuthToken())
        ).andExpect(status().isOk());

        Thought updatedThought = thoughtRepository.findById(savedThought.getId()).orElseThrow(Exception::new);

        assertThat(updatedThought.getId()).isEqualTo(savedThought.getId());
        assertThat(updatedThought.getMessage()).isEqualTo(savedThought.getMessage());
        assertThat(updatedThought.getTopic()).isEqualTo(savedColumnTitle.getTopic());
        assertThat(updatedThought.getColumnTitle()).isEqualTo(savedColumnTitle);
    }

    @Test
    void should_return_all_thoughts_by_team_id() throws Exception {
        List<Thought> expectedThoughts = Arrays.asList(
                Thought.builder().teamId(teamId).message("hello").build(),
                Thought.builder().teamId(teamId).message("goodbye").build());

        List<Thought> persistedExpectedThoughts = thoughtRepository.saveAll(expectedThoughts);

        MvcResult result = mockMvc.perform(get(String.join("", "/api/team/", teamId, "/thoughts"))
                .contentType(APPLICATION_JSON)
                .header("Authorization", getBearerAuthToken()))
                .andExpect(status().isOk())
                .andReturn();

        List<Thought> actualThoughts = objectMapper.readValue(result.getResponse().getContentAsByteArray(), new TypeReference<>() {
        });

        assertThat(actualThoughts)
                .usingRecursiveComparison()
                .isEqualTo(persistedExpectedThoughts);
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


        mockMvc.perform(delete(String.format("%s/thought/%d", BASE_API_URL, thoughtToDelete.getId()))
                .contentType(APPLICATION_JSON)
                .header("Authorization", getBearerAuthToken()))
                .andExpect(status().isOk());

        assertThat(thoughtRepository.exists(Example.of(thoughtToDelete))).isFalse();
        assertThat(thoughtRepository.exists(Example.of(thoughToKeep))).isTrue();
    }

    @Test
    public void should_not_delete_thoughts_by_id_unauthorized() throws Exception {
        mockMvc.perform(delete(String.format("%s/thought/%d", BASE_API_URL, 1))
                .contentType(APPLICATION_JSON)
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("unauthorized")))
                .andExpect(status().isForbidden());
    }

    @Test
    void should_create_thought() throws Exception {
        var createThoughtRequest = new CreateThoughtRequest(
                null,
                "Hello",
                0,
                "happy",
                false,
                null,
                null
        );

        mockMvc.perform(post(String.join("", "/api/team/", teamId, "/thought"))
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createThoughtRequest))
                .header("Authorization", getBearerAuthToken()))
                .andExpect(status().isCreated());

        var savedThoughts = thoughtRepository.findAllByTeamId(teamId);
        assertThat(savedThoughts).hasSize(1);
        var savedThought = savedThoughts.get(0);
        assertThat(savedThought.getMessage()).isEqualTo("Hello");
        assertThat(savedThought.getTopic()).isEqualTo("happy");
    }

    @Test
    public void should_not_create_thought_unauthorized() throws Exception {
        var createThoughtRequest = new CreateThoughtRequest(
                null,
                "Hello",
                0,
                "happy",
                false,
                null,
                null
        );

        mockMvc.perform(post(String.join("", "/api/team/", teamId, "/thought"))
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createThoughtRequest))
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("unauthorized")))
                .andExpect(status().isForbidden());
    }

    @Test
    void should_get_thoughts_on_same_team() throws Exception {
        List<Thought> savedThoughts = Arrays.asList(
                Thought.builder().message("message 1").teamId(teamId).build(),
                Thought.builder().message("message 2").teamId(teamId).build(),
                Thought.builder().message("message 2").teamId("team 2").build()
        );

        thoughtRepository.saveAll(savedThoughts);

        MvcResult result = mockMvc.perform(get(BASE_API_URL + "/thoughts")
                .contentType(APPLICATION_JSON)
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

        mockMvc.perform(get(BASE_API_URL + "/thoughts")
                .contentType(APPLICATION_JSON)
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("unauthorized")))
                .andExpect(status().isForbidden());
    }
}
