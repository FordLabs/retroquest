package com.ford.labs.retroquest.columntitle;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ColumnTitleService {

    private ColumnTitleRepository columnTitleRepository;

    public ColumnTitleService(ColumnTitleRepository columnTitleRepository) {
        this.columnTitleRepository = columnTitleRepository;
    }

    public List<ColumnTitle> getColumnTitlesByTeamId(String teamId) {
        return columnTitleRepository.findAllByTeamId(teamId);
    }

    public ColumnTitle editColumnTitleName(Long columnId, String newColumnName) {
        var savedColumnTitle = columnTitleRepository.findById(columnId).orElseThrow();
        savedColumnTitle.setTitle(newColumnName);
        return columnTitleRepository.save(savedColumnTitle);
    }

}
