/*
 * Copyright © 2018 Ford Motor Company
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

package com.ford.labs.retroquest.actionitem;

import org.junit.Test;

import java.util.List;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

public class ActionItemTest {

    @Test
    public void shouldToggleActionItemCompletedState() {
        ActionItem actionItem = new ActionItem();
        actionItem.setCompleted(false);
        actionItem.toggleCompleted();
        assertTrue(actionItem.isCompleted());
    }

    @Test
    public void shouldBuildActionCSVField() {
        ActionItem actionItem = new ActionItem();
        actionItem.setTask("task");
        actionItem.setAssignee("user");
        List<String> actual = actionItem.getCSVFields();
        assertThat(actual, contains("action item", "task", "", "no", "user"));
    }

    @Test
    public void shouldSanitizeTask() {
        ActionItem actionItem = ActionItem.builder().task("<div>Sanitized</div>").build();
        assertThat(actionItem.getTask(), is(equalTo("Sanitized")));
    }

    @Test
    public void shouldSanitizeAssignee() {
        ActionItem actionItem = ActionItem.builder().assignee("<div>Henry Ford</div>").build();
        assertThat(actionItem.getAssignee(), is(equalTo("Henry Ford")));
    }

}