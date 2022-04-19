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

import com.ford.labs.retroquest.exception.ColumnNotFoundException;
import com.ford.labs.retroquest.websocket.WebsocketService;
import com.ford.labs.retroquest.websocket.events.WebsocketColumnEvent;
import com.ford.labs.retroquest.websocket.events.WebsocketEventType;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ColumnService {

    private final ColumnRepository columnRepository;
    private final MeterRegistry meterRegistry;
    private final WebsocketService websocketService;

    public ColumnService(ColumnRepository columnRepository, MeterRegistry meterRegistry, WebsocketService websocketService) {
        this.columnRepository = columnRepository;
        this.meterRegistry = meterRegistry;
        this.websocketService = websocketService;
    }

    public List<Column> getColumns(String teamId) {
        return columnRepository.findAllByTeamId(teamId).stream().sorted().toList();
    }

    public Column editTitle(Long columnId, String title, String teamId) {
        var existingColumn = fetchColumn(teamId, columnId);
        existingColumn.setTitle(title);

        Column newColumn = columnRepository.save(existingColumn);

        websocketService.publishEvent(new WebsocketColumnEvent(teamId, WebsocketEventType.UPDATE, newColumn));

        meterRegistry.counter("retroquest.columns.changed.count").increment();

        return newColumn;
    }

    public Column fetchColumn(String teamId, Long columnId) {
        return columnRepository.findByTeamIdAndId(teamId, columnId).orElseThrow(ColumnNotFoundException::new);
    }
}
