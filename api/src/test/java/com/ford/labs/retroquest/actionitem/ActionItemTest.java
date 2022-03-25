/*
 * Copyright (c) 2022. Ford Motor Company
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

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ActionItemTest {

    @Test
    public void getCsvFields_WithCompletedFalse_ReturnsNo() {
        var actionItem = new ActionItem(null, "task", false, "teamId", "assignee", null, true);
        assertThat(actionItem.getCsvFields()).containsExactly("action item", "task", "", "no", "assignee");
    }

    @Test
    public void getCsvFields_WithCompletedTrue_ReturnsYes() {
        var actionItem = new ActionItem(null, "task", true, "teamId", "assignee", null, false);
        assertThat(actionItem.getCsvFields()).containsExactly("action item", "task", "", "yes", "assignee");
    }

    @Test
    public void getCsvFields_WithNullAssignee_ReturnsEmptyString() {
        var actionItem = new ActionItem(null, "task", true, "teamId", null, null, false);
        assertThat(actionItem.getCsvFields()).containsExactly("action item", "task", "", "yes", "");
    }
}