package com.ford.labs.retroquest.board;

import com.ford.labs.retroquest.column.Column;
import com.ford.labs.retroquest.thought.Thought;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@AllArgsConstructor
public class Retro {
    private final Long id;
    private final String teamId;
    private final LocalDate dateCreated;
    private final List<Thought> thoughts;
    private final List<Column> columns;

    public static Retro fromBoard(Board board) {
        var calculatedColumns = board.getThoughts().stream()
                .map(Thought::getColumnTitle)
                .distinct()
                .map(Column::fromColumnTitle)
                .collect(Collectors.toList());
        return new Retro(
                board.getId(),
                board.getTeamId(),
                board.getDateCreated(),
                board.getThoughts(),
                calculatedColumns
        );
    }
}
