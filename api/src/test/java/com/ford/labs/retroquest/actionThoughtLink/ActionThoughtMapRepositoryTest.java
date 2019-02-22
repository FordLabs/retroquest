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
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;


@RunWith(SpringRunner.class)
@DataJpaTest
public class ActionThoughtMapRepositoryTest {


    @Autowired
    ActionThoughtMapRepository actionThoughtMapRepository;


    @Test
    public void ShouldBeAbleToCreateActionThoughtLink() {
        ActionItem AI1 = new ActionItem();
        AI1.setId(27L);
        Thought T1 = new Thought();
        T1.setId(4L);

        actionThoughtMapRepository.save(new ActionThoughtMap(null, AI1.getId(), T1.getId()));
        assertTrue(actionThoughtMapRepository.findAll().size() == 1);
    }

    @Test
    public void ShouldBeAbleToGetAllLinkedThoughtsForSingleActionItem() {
        ActionItem AI1 = new ActionItem();
        AI1.setId(27L);

        ActionItem AI2 = new ActionItem();
        AI2.setId(14L);

        Thought T1 = new Thought();
        T1.setId(4L);

        Thought T2 = new Thought();
        T2.setId(9L);

        Thought T3 = new Thought();
        T3.setId(16L);

        actionThoughtMapRepository.save(new ActionThoughtMap(null, AI1.getId(), T1.getId()));
        actionThoughtMapRepository.save(new ActionThoughtMap(null, AI2.getId(), T2.getId()));
        actionThoughtMapRepository.save(new ActionThoughtMap(null, AI1.getId(), T3.getId()));

        List<ActionThoughtMap> response = actionThoughtMapRepository.findAllByActionItemId(AI1.getId());
        assertEquals(response.size(), 2);


        assertTrue(response.get(0).getThoughtId() == T1.getId());
        assertTrue(response.get(0).getActionItemId() == AI1.getId());
        assertTrue(response.get(1).getThoughtId() == T3.getId());
        assertTrue(response.get(1).getActionItemId() == AI1.getId());

    }
}