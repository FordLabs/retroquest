package com.ford.labs.retroquest.column;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Column {
    private Long id;
    private String title;
    private String topic;

    public static Column fromColumnTitle(ColumnTitle columnTitle) {
        return new Column(columnTitle.getId(), columnTitle.getTitle(), columnTitle.getTopic());
    }
}
