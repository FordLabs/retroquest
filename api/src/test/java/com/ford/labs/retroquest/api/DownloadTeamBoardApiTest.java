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
import com.ford.labs.retroquest.columntitle.ColumnTitle;
import com.ford.labs.retroquest.columntitle.ColumnTitleRepository;
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
    private ColumnTitleRepository columnTitleRepository;

    @Autowired
    private TestRestTemplate restTemplate;

    private LoginRequest loginRequest;

    @BeforeEach
    void setup() {
        loginRequest = LoginRequest.builder().name(teamId).password("password").build();
        teamRepository.deleteAllInBatch();
        actionItemRepository.deleteAllInBatch();
        thoughtRepository.deleteAllInBatch();
        columnTitleRepository.deleteAllInBatch();

        assertThat(teamRepository.count()).isZero();
        assertThat(actionItemRepository.count()).isZero();
        assertThat(thoughtRepository.count()).isZero();
        assertThat(columnTitleRepository.count()).isZero();
    }

    @Test
    void should_get_csv_with_thoughts_and_action_items() throws Exception {
        ActionItem savedActionItem = actionItemRepository.save(ActionItem.builder()
                .task("task")
                .teamId(teamId)
                .archived(false)
                .assignee("assignee")
                .completed(false)
                .dateCreated(Date.valueOf("2019-01-01"))
                .build());

        ColumnTitle savedColumnTitle = columnTitleRepository.save(ColumnTitle.builder()
                .title("Happy")
                .teamId(teamId)
                .topic("happy")
                .build());

        Thought savedThought = thoughtRepository.save(
                Thought.builder()
                        .message("task")
                        .columnTitle(savedColumnTitle)
                        .teamId(teamId)
                        .hearts(5)
                        .discussed(false)
                        .topic("happy")
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
        assertThat(csvContentsList[1].trim()).isEqualTo(String.join(",", savedThought.getCSVFields()));
        assertThat(csvContentsList[2].trim()).isEqualTo(String.join(",", savedActionItem.getCSVFields()));
    }

    @Test
    void should_not_get_csv_unauthorized() throws Exception {
        restTemplate.postForObject("/api/team/", loginRequest, String.class);

        mockMvc.perform(get("/api/team/" + teamId + "/csv")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("not-beach-bums")))
                .andExpect(status().isForbidden());
    }
}
