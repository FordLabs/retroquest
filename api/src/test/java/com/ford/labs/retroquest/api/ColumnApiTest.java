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

package com.ford.labs.retroquest.api;

import com.ford.labs.retroquest.api.setup.ApiTestBase;
import com.ford.labs.retroquest.column.ColumnTitle;
import com.ford.labs.retroquest.column.ColumnTitleRepository;
import com.ford.labs.retroquest.column.UpdateColumnTitleRequest;
import com.ford.labs.retroquest.thought.ThoughtRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;

import static java.lang.String.format;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Tag("api")
public class ColumnApiTest extends ApiTestBase {

    @Autowired
    ColumnTitleRepository columnTitleRepository;

    @Autowired
    ThoughtRepository thoughtRepository;

    @BeforeEach
    void setup() {
        columnTitleRepository.deleteAllInBatch();
        thoughtRepository.deleteAllInBatch();
    }

    @Test
    public void getColumns_shouldReturnListOfColumns() throws Exception {
        var happyColumn = new ColumnTitle(null, "happy", "Happy Thoughts", teamId);
        var sadColumn = new ColumnTitle(null, "sad", "Sad Thoughts", teamId);
        happyColumn = columnTitleRepository.save(happyColumn);
        sadColumn = columnTitleRepository.save(sadColumn);

        mockMvc.perform(get(format("/api/team/%s/columns", teamId))
                .header("Authorization", "Bearer " + getBearerAuthToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.[0].id").value(happyColumn.getId()))
                .andExpect(jsonPath("$.[0].title").value(happyColumn.getTitle()))
                .andExpect(jsonPath("$.[0].topic").value(happyColumn.getTopic()))
                .andExpect(jsonPath("$.[1].id").value(sadColumn.getId()))
                .andExpect(jsonPath("$.[1].title").value(sadColumn.getTitle()))
                .andExpect(jsonPath("$.[1].topic").value(sadColumn.getTopic()));
    }

    @Test
    public void getColumns_WithInvalidCredential_Returns403() throws Exception {
        mockMvc.perform(get(format("/api/team/%s/columns", teamId))
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("not-beach-bums")))
                .andExpect(status().isForbidden());
    }

    @Test
    public void updateColumnTitle() throws Exception {
        var savedColumnTitle = columnTitleRepository.save(ColumnTitle.builder()
                .teamId("BeachBums")
                .title("old title")
                .build());
        var expectedColumnTitle = new ColumnTitle(savedColumnTitle.getId(), null, "new title", "BeachBums");

        var request = new UpdateColumnTitleRequest("new title");

        mockMvc.perform(put("/api/team/BeachBums/column/" + savedColumnTitle.getId() + "/title")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsBytes(request))
                .header("Authorization", getBearerAuthToken()))
                .andExpect(status().isOk());

        assertThat(columnTitleRepository.findAll()).containsExactly(expectedColumnTitle);
    }

    @Test
    public void updateColumnTitle_WithUnauthorizedUser_ReturnsForbidden() throws Exception{
        var request = new UpdateColumnTitleRequest("new title");
        mockMvc.perform(put("/api/team/BeachBums/column/1/title")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsBytes(request))
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("unauthorized")))
                .andExpect(status().isForbidden());
    }

    @Test
    public void updateColumnTitle_WithFakeColumnId_ReturnsNotFound() throws Exception {
        var request = new UpdateColumnTitleRequest("new title");

        mockMvc.perform(put("/api/team/BeachBums/column/42/title")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsBytes(request))
                .header("Authorization", getBearerAuthToken()))
                .andExpect(status().isNotFound());
    }

    @Test
    public void updateColumnTitle_WithColumnIdFromOtherTeam_ReturnsNotFound() throws Exception {
        var savedColumnTitle = columnTitleRepository.save(ColumnTitle.builder()
                .teamId("NotBeachBums")
                .title("old title")
                .build());
        var expectedColumnTitle = new ColumnTitle(savedColumnTitle.getId(), null, "new title", "BeachBums");

        var request = new UpdateColumnTitleRequest("new title");

        mockMvc.perform(put("/api/team/BeachBums/column/%d/title".formatted(expectedColumnTitle.getId()))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsBytes(request))
                .header("Authorization", getBearerAuthToken()))
                .andExpect(status().isNotFound());
    }
}
