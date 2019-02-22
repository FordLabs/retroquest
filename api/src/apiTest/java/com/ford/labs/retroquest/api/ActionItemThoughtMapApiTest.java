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
 *
 */

package com.ford.labs.retroquest.api;


import com.ford.labs.retroquest.actionThoughtLink.ActionThoughtMap;
import com.ford.labs.retroquest.actionThoughtLink.ActionThoughtMapRepository;
import org.assertj.core.api.Assertions;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Arrays;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
public class ActionItemThoughtMapApiTest extends ControllerTest {

    @Autowired
    private ActionThoughtMapRepository actionThoughtMapRepository;


    @Test
    public void aGetRequestShouldReturnAListOfMappings() throws Exception {

        Long actionItemId = 2L;

        List<ActionThoughtMap> expectedActionThoughtMaps = Arrays.asList(
                new ActionThoughtMap(1L, actionItemId, 3L),
                new ActionThoughtMap(2L, actionItemId, 4L)
        );

        actionThoughtMapRepository.save(
                Arrays.asList(
                        new ActionThoughtMap(null, actionItemId, 3L),
                        new ActionThoughtMap(null, actionItemId, 4L)
                )
        );

        MvcResult result = mockMvc.perform(
                get("/api/team/" + teamId + "/action-thought-map/2")
                        .header("Authorization", getBearerAuthToken())

        )
                .andExpect(status().isOk())
                .andReturn();

        ActionThoughtMap[] actionThoughtMaps = objectMapper.readValue(result.getResponse().getContentAsByteArray(), ActionThoughtMap[].class);

        Assertions.assertThat(actionThoughtMaps).hasSize(2);

    }

    @Test
    public void aGetRequestShouldReturnAForbiddenStatusForTeamsThatArentAuthorized() throws Exception {

        String forbiddenTeamId = "I AM NOT AUTHORIZED";

        mockMvc.perform(
                get("/api/team/" + forbiddenTeamId + "/action-thought-map/2")
                        .header("Authorization", getBearerAuthToken())

        )
                .andExpect(status().isForbidden());

    }


}
