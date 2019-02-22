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

package com.ford.labs.retroquest.actionThoughtLink;

import org.assertj.core.api.Assertions;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class ActionItemThoughtMapControllerTest {

    private ActionThoughtMapRepository actionThoughtMapRepository;
    private ActionItemThoughtMapController controller;

    @Before
    public void setUp() {
        actionThoughtMapRepository = Mockito.mock(ActionThoughtMapRepository.class);
        controller = new ActionItemThoughtMapController(actionThoughtMapRepository);
    }

    @Test
    public void ShouldGetAllLinkedThoughtsForActionItem() {

        Long actionItemId = 7L;
        Long expectedThoughtId = 2L;

        when(actionThoughtMapRepository.findAllByActionItemId(actionItemId)).thenReturn(
                Arrays.asList(new ActionThoughtMap(1L, actionItemId, expectedThoughtId))
        );

        List<ActionThoughtMap> result = controller.getAllThoughtsLinkedToActionItem("TestBoard", actionItemId);

        Assertions.assertThat(result).hasSize(1);
    }
}