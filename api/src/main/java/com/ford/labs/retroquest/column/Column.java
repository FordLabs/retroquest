package com.ford.labs.retroquest.column;

import com.ford.labs.retroquest.thought.Thought;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class Column {
    private Long id;
    private String title;
    private List<Thought> thoughts;
}
