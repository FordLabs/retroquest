package com.ford.labs.retroquest.columntitle;

import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class ColumnTitleService {

    private ColumnTitleRepository columnTitleRepository;

    public ColumnTitleService(ColumnTitleRepository columnTitleRepository){
        this.columnTitleRepository = columnTitleRepository;
    }

    public List<ColumnTitle> getColumnTitlesByTeamId(String teamId){
        return columnTitleRepository.findAllByTeamId(teamId);
    }

    public ColumnTitle editColumnTitle(Long columnId){
        return new ColumnTitle();
    }

}
