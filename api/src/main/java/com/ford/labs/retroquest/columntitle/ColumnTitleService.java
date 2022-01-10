package com.ford.labs.retroquest.columntitle;

import com.ford.labs.retroquest.exception.ColumnTitleNotFoundException;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ColumnTitleService {

    private final ColumnTitleRepository columnTitleRepository;
    private MeterRegistry meterRegistry;

    public ColumnTitleService(ColumnTitleRepository columnTitleRepository, MeterRegistry meterRegistry) {
        this.columnTitleRepository = columnTitleRepository;
        this.meterRegistry = meterRegistry;
    }

    public List<ColumnTitle> getColumnTitlesByTeamId(String teamId) {
        return columnTitleRepository.findAllByTeamId(teamId);
    }

    public ColumnTitle editColumnTitleName(Long columnId, String newColumnName) {
        var savedColumnTitle = columnTitleRepository.findById(columnId).orElseThrow(ColumnTitleNotFoundException::new);
        savedColumnTitle.setTitle(newColumnName);

        meterRegistry.counter("retroquest.columns.changed.count").increment();

        return columnTitleRepository.save(savedColumnTitle);
    }

}
