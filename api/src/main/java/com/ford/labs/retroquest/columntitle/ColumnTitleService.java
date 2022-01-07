package com.ford.labs.retroquest.columntitle;

import com.ford.labs.retroquest.exception.ColumnTitleNotFoundException;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ColumnTitleService {

    private final ColumnTitleRepository columnTitleRepository;

    public ColumnTitleService(ColumnTitleRepository columnTitleRepository) {
        this.columnTitleRepository = columnTitleRepository;
    }

    public List<ColumnTitle> getColumnTitlesByTeamId(String teamId) {
        return columnTitleRepository.findAllByTeamId(teamId);
    }

    public ColumnTitle editColumnTitleName(Long columnId, String newColumnName) {
        var savedColumnTitle = columnTitleRepository.findById(columnId).orElseThrow(ColumnTitleNotFoundException::new);
        savedColumnTitle.setTitle(newColumnName);
        return columnTitleRepository.save(savedColumnTitle);
    }

}
