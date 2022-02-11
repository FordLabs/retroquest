package com.ford.labs.retroquest.actionitem;

import org.springframework.stereotype.Service;

@Service
public class ActionItemService {
    private final ActionItemRepository actionItemRepository;

    public ActionItemService(ActionItemRepository actionItemRepository) {
        this.actionItemRepository = actionItemRepository;
    }

    public void archiveCompletedActionItems(String teamId) {
        var itemsToUpdate = actionItemRepository.findAllByTeamIdAndArchivedIsFalseAndCompletedIsTrue(teamId);
        itemsToUpdate.forEach(item -> item.setArchived(true));
        actionItemRepository.saveAll(itemsToUpdate);
    }
}
