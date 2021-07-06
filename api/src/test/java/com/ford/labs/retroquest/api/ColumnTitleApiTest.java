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
import com.ford.labs.retroquest.columntitle.UpdateColumnTitleRequest;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Arrays;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Tag("api")
class ColumnTitleApiTest extends ApiTestBase {

    @Autowired
    private ColumnTitleRepository columnTitleRepository;

    private String BASE_SUB_URL;
    private String BASE_ENDPOINT_URL;

    @BeforeEach
    void setup() {
        BASE_SUB_URL = String.format("/topic/%s/column-titles", teamId);
        BASE_ENDPOINT_URL = String.format("/app/%s/column-title", teamId);
    }

    @AfterEach
    void teardown() {
        columnTitleRepository.deleteAllInBatch();
        assertThat(columnTitleRepository.count()).isZero();
    }

    @Test
    void canEditColumnTitleWithWebSockets() throws Exception {
        ColumnTitle savedColumnTitle = columnTitleRepository.save(ColumnTitle.builder()
            .title("old title")
            .teamId("beach-bums")
            .build());

        StompSession session = getAuthorizedSession();
        subscribe(session, BASE_SUB_URL);

        ColumnTitle sentColumnTitle = ColumnTitle.builder()
            .id(savedColumnTitle.getId())
            .title("new title")
            .teamId(savedColumnTitle.getTeamId())
            .build();

        session.send(String.format("%s/%d/edit", BASE_ENDPOINT_URL, sentColumnTitle.getId()),
            objectMapper.writeValueAsBytes(sentColumnTitle));

        ColumnTitle response = takeObjectInSocket(ColumnTitle.class);

        assertThat(response).isEqualTo(sentColumnTitle);
        assertThat(columnTitleRepository.count()).isEqualTo(1);
        assertThat(columnTitleRepository.findAll().get(0)).isEqualTo(sentColumnTitle);
    }

    @Test
    void should_get_list_of_columns() throws Exception {
        columnTitleRepository.saveAll(Arrays.asList(
            ColumnTitle.builder().teamId("BeachBums").title("one").build(),
            ColumnTitle.builder().teamId("BeachBums").title("two").build(),
            ColumnTitle.builder().teamId("BeachBums").title("three").build()
        ));

        MvcResult columnListRequest = mockMvc.perform(
            get("/api/team/BeachBums/columns")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", getBearerAuthToken())
        ).andReturn();

        ColumnTitle[] result = objectMapper.readValue(columnListRequest.getResponse().getContentAsByteArray(), ColumnTitle[].class);

        assertThat(result).hasSize(3);
    }

    @Test
    void should_update_column_title() throws Exception {
        var savedColumnTitle = columnTitleRepository.save(ColumnTitle.builder()
            .teamId("BeachBums")
            .title("old title")
            .build());

        var request = new UpdateColumnTitleRequest("new title");

        mockMvc.perform(
            put("/api/team/BeachBums/column/{column}/title", savedColumnTitle.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsBytes(request))
                .header("Authorization", getBearerAuthToken())
                .with(csrf())
        ).andExpect(status().isOk());

        assertThat(columnTitleRepository.count()).isEqualTo(1);
        assertThat(columnTitleRepository.findAll().get(0).getTitle()).isEqualTo("new title");
    }
}
