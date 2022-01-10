package com.ford.labs.retroquest.columntitle;

import com.ford.labs.retroquest.exception.ColumnTitleNotFoundException;
import com.ford.labs.retroquest.websocket.WebsocketColumnTitleEvent;
import com.ford.labs.retroquest.websocket.WebsocketEventType;
import com.ford.labs.retroquest.websocket.WebsocketService;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ColumnTitleService {

    private final ColumnTitleRepository columnTitleRepository;
    private final MeterRegistry meterRegistry;
    private final WebsocketService websocketService;

    public ColumnTitleService(ColumnTitleRepository columnTitleRepository, MeterRegistry meterRegistry, WebsocketService websocketService) {
        this.columnTitleRepository = columnTitleRepository;
        this.meterRegistry = meterRegistry;
        this.websocketService = websocketService;
    }

    public List<ColumnTitle> getColumnTitlesByTeamId(String teamId) {
        return columnTitleRepository.findAllByTeamId(teamId);
    }

    public ColumnTitle editColumnTitleName(Long columnId, String newColumnName, String teamId) {
        var existingColumnTitle = columnTitleRepository.findById(columnId).orElseThrow(ColumnTitleNotFoundException::new);
        existingColumnTitle.setTitle(newColumnName);

        ColumnTitle newColumnTitle = columnTitleRepository.save(existingColumnTitle);

        websocketService.publishEvent(new WebsocketColumnTitleEvent(teamId, WebsocketEventType.UPDATE, newColumnTitle));

        meterRegistry.counter("retroquest.columns.changed.count").increment();

        return newColumnTitle;
    }

}
