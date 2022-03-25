/*
 * Copyright (c) 2022 Ford Motor Company
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.ford.labs.retroquest.column;

import com.ford.labs.retroquest.exception.ColumnTitleNotFoundException;
import com.ford.labs.retroquest.websocket.events.WebsocketColumnTitleEvent;
import com.ford.labs.retroquest.websocket.events.WebsocketEventType;
import com.ford.labs.retroquest.websocket.WebsocketService;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Service;

import java.util.List;

import static java.util.stream.Collectors.toList;

@Service
public class ColumnService {

    private final ColumnTitleRepository columnTitleRepository;
    private final MeterRegistry meterRegistry;
    private final WebsocketService websocketService;

    public ColumnService(ColumnTitleRepository columnTitleRepository, MeterRegistry meterRegistry, WebsocketService websocketService) {
        this.columnTitleRepository = columnTitleRepository;
        this.meterRegistry = meterRegistry;
        this.websocketService = websocketService;
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

    public ColumnTitle editColumnTitleName(Long columnId, String newColumnName, String teamId) {
        var existingColumnTitle = columnTitleRepository.findById(columnId).orElseThrow(ColumnTitleNotFoundException::new);
        existingColumnTitle.setTitle(newColumnName);

        ColumnTitle newColumnTitle = columnTitleRepository.save(existingColumnTitle);

        websocketService.publishEvent(new WebsocketColumnTitleEvent(teamId, WebsocketEventType.UPDATE, newColumnTitle));

        meterRegistry.counter("retroquest.columns.changed.count").increment();

        return newColumnTitle;
    }
}
