package com.ford.labs.retroquest.column;

import com.ford.labs.retroquest.columntitle.ColumnTitleRepository;
import com.ford.labs.retroquest.columntitle.ColumnTitleService;
import org.springframework.stereotype.Service;

import java.util.List;

import static java.util.stream.Collectors.toList;

@Service
public class ColumnService {

    private final ColumnTitleRepository columnTitleRepository;

    public ColumnService(ColumnTitleRepository columnTitleRepository) {
        this.columnTitleRepository = columnTitleRepository;
    }

    public List<Column> getColumns(String teamId) {
        return columnTitleRepository.findAllByTeamId(teamId).stream()
                .map(Column::fromColumnTitle)
                .sorted((o1, o2) -> {
                    long difference = o1.getId() - o2.getId();
                    if(difference > 0) return 1;
                    if(difference < 0) return -1;
                    return 0;
                })
                .collect(toList());
    }
}
