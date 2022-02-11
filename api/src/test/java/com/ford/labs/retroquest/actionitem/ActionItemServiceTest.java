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