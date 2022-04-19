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

import com.ford.labs.retroquest.actionitem.ActionItem;
import com.ford.labs.retroquest.actionitem.ActionItemRepository;
import com.ford.labs.retroquest.api.setup.ApiTestBase;
import com.ford.labs.retroquest.column.Column;
import com.ford.labs.retroquest.column.ColumnRepository;
import com.ford.labs.retroquest.team.LoginRequest;
import com.ford.labs.retroquest.team.TeamRepository;
import com.ford.labs.retroquest.thought.Thought;
import com.ford.labs.retroquest.thought.ThoughtRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.test.web.servlet.MvcResult;

import java.sql.Date;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Tag("api")
class DownloadTeamBoardApiTest extends ApiTestBase {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private ActionItemRepository actionItemRepository;

    @Autowired
    private ThoughtRepository thoughtRepository;

    @Autowired
    private ColumnRepository columnRepository;

    @Autowired
    private TestRestTemplate restTemplate;

    private LoginRequest loginRequest;

    @BeforeEach
    void setup() {
        loginRequest = LoginRequest.builder().name(teamId).password("password").build();
        teamRepository.deleteAllInBatch();
        actionItemRepository.deleteAllInBatch();
        thoughtRepository.deleteAllInBatch();
        columnRepository.deleteAllInBatch();
    }

    @Test
    void should_get_csv_with_thoughts_and_action_items() throws Exception {
        actionItemRepository.save(ActionItem.builder()
                .task("task")
                .teamId(teamId)
                .archived(false)
                .assignee("assignee")
                .completed(false)
                .dateCreated(Date.valueOf("2019-01-01"))
                .build());

        Column savedColumn = columnRepository.save(new Column(null, "happy", "Happy", teamId));

        thoughtRepository.save(
                Thought.builder()
                        .message("task")
                        .teamId(teamId)
                        .hearts(5)
                        .discussed(false)
                        .columnId(savedColumn.getId())
                        .build()
        );

        MvcResult result = mockMvc.perform(get("/api/team/" + teamId + "/csv")
                .header("Authorization", getBearerAuthToken()))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.CONTENT_TYPE, "text/csv"))
                .andExpect(header().string(HttpHeaders.CONTENT_TYPE, "text/csv"))
                .andReturn();

        String[] csvContentsList = result.getResponse().getContentAsString().split("\n");
        assertThat(csvContentsList[0].trim()).isEqualTo("Column,Message,Likes,Completed,Assigned To");
        assertThat(csvContentsList[1].trim()).isEqualTo("Happy,task,5,no");
        assertThat(csvContentsList[2].trim()).isEqualTo("action item,task,,no,assignee");
    }

    @Test
    void should_not_get_csv_unauthorized() throws Exception {
        restTemplate.postForObject("/api/team/", loginRequest, String.class);

        mockMvc.perform(get("/api/team/" + teamId + "/csv")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("not-beach-bums")))
                .andExpect(status().isForbidden());
    }
}
