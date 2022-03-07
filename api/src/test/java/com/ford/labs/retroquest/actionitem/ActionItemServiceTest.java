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

import java.util.List;

import static org.mockito.Mockito.*;

class ActionItemServiceTest {
    private final ActionItemRepository mockActionItemRepository = mock(ActionItemRepository.class);
    private final ActionItemService actionItemService = new ActionItemService(mockActionItemRepository);

    @Test
    public void archiveCompletedActionItems_MarksCompletedButUnarchivedActionItemsAsArchived() {
        var completedActionItem = ActionItem.builder().id(1L).teamId("The team").completed(true).archived(false).build();
        var otherCompletedActionItem = ActionItem.builder().id(2L).teamId("The team").completed(true).archived(false).build();
        when(mockActionItemRepository.findAllByTeamIdAndArchivedIsFalseAndCompletedIsTrue("The team")).thenReturn(List.of(completedActionItem, otherCompletedActionItem));

        actionItemService.archiveCompletedActionItems("The team");

        var expectedCompletedActionItem = ActionItem.builder().id(1L).teamId("The team").completed(true).archived(true).build();
        var otherExpectedCompletedActionItem = ActionItem.builder().id(2L).teamId("The team").completed(true).archived(true).build();
        verify(mockActionItemRepository).saveAll(List.of(expectedCompletedActionItem, otherExpectedCompletedActionItem));
    }

}