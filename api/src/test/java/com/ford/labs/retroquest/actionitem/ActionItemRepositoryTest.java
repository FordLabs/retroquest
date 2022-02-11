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
    public void findAllByTeamIdAndArchivedIsFalseAndCompletedIsTrue_DoesAsNameImplies() {
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