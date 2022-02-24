package com.ford.labs.retroquest.column;

import com.ford.labs.retroquest.column.Column;
import com.ford.labs.retroquest.columntitle.ColumnTitle;
import com.ford.labs.retroquest.columntitle.ColumnTitleService;
import com.ford.labs.retroquest.thought.Thought;
import com.ford.labs.retroquest.thought.ThoughtService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@Service
public class ColumnService {

    private final ColumnTitleService columnTitleService;
    private final ThoughtService thoughtService;

    public ColumnService(ThoughtService thoughtService, ColumnTitleService columnTitleService) {
        this.columnTitleService = columnTitleService;
        this.thoughtService = thoughtService;
    }

    public List<Column> getColumns(String teamId) {
        var columnTitles = columnTitleService.getColumnTitlesByTeamId(teamId);
        var thoughts = thoughtService.fetchAllActiveThoughts(teamId);
        Map<ColumnTitle, List<Thought>> thoughtsMap = columnTitles.stream().collect(
                Collectors.toMap(
                        columnTitle -> columnTitle,
                        columnTitle -> thoughts.stream()
                                .filter(thought -> thought.getTopic().equals(columnTitle.getTopic()))
                                .sorted((o1, o2) -> {
                                    long difference = o1.getId() - o2.getId();
                                    if(difference > 0) return 1;
                                    if(difference < 0) return -1;
                                    return 0;
                                })
                                .collect(toList())));

        return columnTitles.stream()
                .map(title -> new Column(title.getId(), title.getTitle(), thoughtsMap.get(title)))
                .sorted((o1, o2) -> {
                    long difference = o1.getId() - o2.getId();
                    if(difference > 0) return 1;
                    if(difference < 0) return -1;
                    return 0;
                })
                .collect(toList());
    }
}
