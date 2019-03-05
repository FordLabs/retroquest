package com.ford.labs.retroquest.actionthoughtlink;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActionThoughtLinkRepository extends JpaRepository<ActionThoughtLink, Long> {
    void deleteActionThoughtLinkByThoughtId(Long thoughtId);
    void deleteActionThoughtLinkByActionItemId(Long actionItemId);
}
