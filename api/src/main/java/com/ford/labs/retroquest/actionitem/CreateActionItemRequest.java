package com.ford.labs.retroquest.actionitem;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.EqualsAndHashCode;
import lombok.Value;

import java.sql.Date;

@Value
@JsonIgnoreProperties(ignoreUnknown = true)
public class CreateActionItemRequest {
    String task;
    boolean completed;
    String assignee;
    @EqualsAndHashCode.Exclude
    Date dateCreated;
    boolean archived;

    public ActionItem toActionItem() {
        return new ActionItem(
            null,
            task,
            completed,
            null,
            assignee,
            dateCreated,
            archived
        );
    }
}
