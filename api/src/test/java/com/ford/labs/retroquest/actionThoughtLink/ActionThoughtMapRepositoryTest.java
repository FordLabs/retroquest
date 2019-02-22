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

import com.ford.labs.retroquest.actionitem.ActionItem;
import com.ford.labs.retroquest.thought.Thought;
import org.assertj.core.api.Assertions;
import org.junit.After;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;


@RunWith(SpringRunner.class)
@DataJpaTest
public class ActionThoughtMapRepositoryTest {


    @Autowired
    ActionThoughtMapRepository actionThoughtMapRepository;

    @After
    public void tearDown() {
        actionThoughtMapRepository.deleteAll();
        Assertions.assertThat(actionThoughtMapRepository.count()).isEqualTo(0);
    }


    @Test
    public void shouldBeAbleToCreateActionThoughtLink() {
        ActionItem actionItem = ActionItem.builder().id(27L).build();
        Thought thought = Thought.builder().id(4L).build();

        actionThoughtMapRepository.save(new ActionThoughtMap(null, actionItem.getId(), thought.getId()));

        Assertions.assertThat(actionThoughtMapRepository.findAll()).hasSize(1);
    }

    @Test
    public void shouldBeAbleToGetAllLinkedThoughtsForSingleActionItem() {
        ActionItem actionItem1 = ActionItem.builder().id(27L).build();
        ActionItem actionItem2 = ActionItem.builder().id(14L).build();

        Thought thought1 = Thought.builder().id(4L).build();
        Thought thought2 = Thought.builder().id(9L).build();
        Thought thought3 = Thought.builder().id(16L).build();

        actionThoughtMapRepository.save(new ActionThoughtMap(null, actionItem1.getId(), thought1.getId()));
        actionThoughtMapRepository.save(new ActionThoughtMap(null, actionItem2.getId(), thought2.getId()));
        actionThoughtMapRepository.save(new ActionThoughtMap(null, actionItem1.getId(), thought3.getId()));

        List<ActionThoughtMap> response = actionThoughtMapRepository.findAllByActionItemId(actionItem1.getId());

        Assertions.assertThat(response).hasSize(2);
        Assertions.assertThat(response.get(0).getThoughtId()).isEqualTo(thought1.getId());
        Assertions.assertThat(response.get(0).getActionItemId()).isEqualTo(actionItem1.getId());
        Assertions.assertThat(response.get(1).getThoughtId()).isEqualTo(thought3.getId());
        Assertions.assertThat(response.get(1).getActionItemId()).isEqualTo(actionItem1.getId());

    }
}