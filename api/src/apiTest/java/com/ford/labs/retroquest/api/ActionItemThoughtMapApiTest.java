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
import com.ford.labs.retroquest.actionitem.ActionItem;
import com.ford.labs.retroquest.actionitem.ActionItemRepository;
import com.ford.labs.retroquest.thought.Thought;
import com.ford.labs.retroquest.thought.ThoughtRepository;
import org.assertj.core.api.Assertions;
import org.junit.After;
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

    @Autowired
    private ActionItemRepository actionItemRepository;

    @Autowired
    private ThoughtRepository thoughtRepository;


    @After
    public void tearDown() {
        actionItemRepository.deleteAll();
        thoughtRepository.deleteAll();

        Assertions.assertThat(actionThoughtMapRepository.count()).isEqualTo(0);
    }

    @Test
    public void aGetRequestShouldReturnAListOfMappings() throws Exception {

        Long actionItemId = 2L;

        ActionItem savedActionItem = actionItemRepository.save(ActionItem.builder().task("some task").build());
        Thought savedThought1 = thoughtRepository.save(Thought.builder().message("some message").build());
        Thought savedThought1 = thoughtRepository.save(Thought.builder().message("some message").build());

        List<ActionThoughtMap> expectedActionThoughtMaps = Arrays.asList(
                new ActionThoughtMap(1L, savedActionItem.getId(), savedThought.getId()),
                new ActionThoughtMap(2L, savedActionItem.getId(), 4L)
        );


        actionThoughtMapRepository.save(
                Arrays.asList(
                        new ActionThoughtMap(null, actionItemId, 3L),
                        new ActionThoughtMap(null, actionItemId, 4L)
                )
        );

        MvcResult result = mockMvc.perform(
                get("/api/team/" + teamId + "/linkedThoughts/2")
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
                get("/api/team/" + forbiddenTeamId + "/linkedThoughts/2")
                        .header("Authorization", getBearerAuthToken())

        )
                .andExpect(status().isForbidden());

    }


}
