/*
 * Copyright (c) 2018 Ford Motor Company
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

import com.ford.labs.retroquest.api.setup.ApiTest;
import com.ford.labs.retroquest.apiAuthorization.ApiAuthorization;
import com.ford.labs.retroquest.v2.columns.ColumnCombinerResponse;
import com.ford.labs.retroquest.v2.columns.ColumnCombinerService;
import com.ford.labs.retroquest.v2.columns.ColumnResponse;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class ColumnApiTest extends ApiTest {

    @Autowired
    ApiAuthorization apiAuthorization;

    @MockBean
    ColumnCombinerService columnCombinerService;

    private ColumnCombinerResponse expectedBody;

    @Before
    public void setup() {
        expectedBody = ColumnCombinerResponse.builder()
                .columns(
                        Collections.singletonList(ColumnResponse.builder().topic("happy").build())
                ).build();

        when(columnCombinerService.aggregateResponse(teamId)).thenReturn(expectedBody);
    }

    @Test
    public void should_return_unauthorized_if_no_bearer_token_is_sent() throws Exception {
        mockMvc.perform(get("/api/v2/team/" + teamId + "/columns"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void should_return_ok_since_user_is_authorized() throws Exception {
        mockMvc.perform(get("/api/v2/team/" + teamId + "/columns")
                .header("Authorization", getBearerAuthToken()))
                .andExpect(status().isOk());
    }

    @Test
    public void should_get_a_filled_out_aggregated_response_with_a_200() throws Exception {
        String body = mockMvc.perform(get("/api/v2/team/" + teamId + "/columns")
                .header("Authorization", getBearerAuthToken()))
                .andReturn().getResponse().getContentAsString();

        assertThat(objectMapper.readValue(body, ColumnCombinerResponse.class))
                .isEqualToComparingFieldByField(expectedBody);
    }

}