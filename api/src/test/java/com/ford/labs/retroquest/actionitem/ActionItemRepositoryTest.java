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

package com.ford.labs.retroquest.actionitem;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class ActionItemRepositoryTest {
    @Autowired
    private ActionItemRepository actionItemRepository;

    @Test
    public void findAllByTeamIdAndArchived_WhenArchivedIsFalse() {
        var uncompletedActionItem = ActionItem.builder().teamId("The team").completed(false).archived(false).build();
        var completedActionItem = ActionItem.builder().teamId("The team").completed(true).archived(false).build();
        var archivedActionItem = ActionItem.builder().teamId("The team").completed(true).archived(true).build();
        actionItemRepository.saveAll(List.of(uncompletedActionItem, completedActionItem, archivedActionItem));

        var results = actionItemRepository.findAllByTeamIdAndArchived("The team", false);

        assertThat(results).hasSize(2);
        assertThat(results.get(0).getTeamId()).isEqualTo("The team");
        assertThat(results.get(0).isArchived()).isFalse();
        assertThat(results.get(0).isCompleted()).isFalse();
        assertThat(results.get(1).getTeamId()).isEqualTo("The team");
        assertThat(results.get(1).isArchived()).isFalse();
        assertThat(results.get(1).isCompleted()).isTrue();
    }

    @Test
    public void findAllByTeamIdAndArchived_WhenArchivedIsTrue() {
        var uncompletedActionItem = ActionItem.builder().teamId("The team").completed(false).archived(false).build();
        var completedActionItem = ActionItem.builder().teamId("The team").completed(true).archived(false).build();
        var archivedActionItem = ActionItem.builder().teamId("The team").completed(true).archived(true).build();
        actionItemRepository.saveAll(List.of(uncompletedActionItem, completedActionItem, archivedActionItem));

        var results = actionItemRepository.findAllByTeamIdAndArchived("The team", true);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getTeamId()).isEqualTo("The team");
        assertThat(results.get(0).isArchived()).isTrue();
        assertThat(results.get(0).isCompleted()).isTrue();
    }

    @Test
    public void findAllByTeamIdAndArchivedIsFalseAndCompletedIsTrue() {
        var uncompletedActionItem = ActionItem.builder().teamId("The team").completed(false).archived(false).build();
        var completedActionItem = ActionItem.builder().teamId("The team").completed(true).archived(false).build();
        var archivedActionItem = ActionItem.builder().teamId("The team").completed(true).archived(true).build();
        actionItemRepository.saveAll(List.of(uncompletedActionItem, completedActionItem, archivedActionItem));

        var results = actionItemRepository.findAllByTeamIdAndArchivedIsFalseAndCompletedIsTrue("The team");

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getTeamId()).isEqualTo("The team");
        assertThat(results.get(0).isArchived()).isFalse();
        assertThat(results.get(0).isCompleted()).isTrue();
    }
}