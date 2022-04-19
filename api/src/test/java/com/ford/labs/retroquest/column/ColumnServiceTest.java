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
import com.ford.labs.retroquest.websocket.events.WebsocketColumnEvent;
import com.ford.labs.retroquest.websocket.events.WebsocketEventType;
import com.ford.labs.retroquest.websocket.WebsocketService;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

class ColumnServiceTest {

    private final ColumnRepository columnRepository = mock(ColumnRepository.class);
    private final MeterRegistry meterRegistry = mock(MeterRegistry.class);
    private final WebsocketService websocketService = mock(WebsocketService.class);
    private final ColumnService service = new ColumnService(columnRepository, meterRegistry, websocketService);

    @Test
    public void getColumns_ReturnsSortedListOfColumns() {
        var expectedColumns = List.of(new Column(1L, "happy", "title 1", "teamId"), new Column(2L, "unhappy", "title 2", "teamId"));
        var savedColumns = List.of(new Column(2L, "unhappy", "title 2", "teamId"), new Column(1L, "happy", "title 1", "teamId"));
        when(columnRepository.findAllByTeamId("team id")).thenReturn(savedColumns);

        var actualColumns = service.getColumns("team id");

        assertThat(actualColumns).containsExactlyElementsOf(expectedColumns);
    }

    @Test
    void given_column_id_and_column_title_rename_column_in_db_and_return_new_column_title() {
        var teamId = "some team ID";
        var newColumnName = "Some new Title";
        var columnId = 42L;
        var savedColumn = new Column(columnId, "happy", "Some Title", teamId);
        var expectedColumn = new Column(columnId, "happy", "Some new Title", teamId);
        var expectedEvent = new WebsocketColumnEvent(teamId, WebsocketEventType.UPDATE, expectedColumn);
        var mockedCounter = mock(Counter.class);

        when(columnRepository.findByTeamIdAndId(teamId, columnId)).thenReturn(Optional.of(savedColumn));
        when(columnRepository.save(expectedColumn)).thenReturn(expectedColumn);
        when(meterRegistry.counter("retroquest.columns.changed.count")).thenReturn(mockedCounter);

        var actualColumn = service.editTitle(columnId, newColumnName, teamId );

        assertThat(actualColumn).usingRecursiveComparison().isEqualTo(expectedColumn);
        verify(mockedCounter, times(1)).increment();
        verify(websocketService).publishEvent(expectedEvent);
    }

    @Test
    void throws_column_title_not_found_exception_when_column_title_not_in_db() {
        assertThatThrownBy(() ->
                service.editTitle(42L, "some name", "some team id")
        ).isInstanceOf(ColumnNotFoundException.class);
    }

    @Test
    public void fetchColumn() {
        var expected = new Column(42L, "topic", "title", "teamId");
        when(columnRepository.findByTeamIdAndId("teamId", 42L)).thenReturn(Optional.of(expected));
        var actual = service.fetchColumn("teamId", 42L);
        assertThat(actual).usingRecursiveComparison().isEqualTo(actual);
    }

    @Test
    public void fetchColumn_WithMissingColumn_ThrowsColumnNotFoundException() {
        assertThatThrownBy(() ->
                service.fetchColumn("some team id", 42L)
        ).isInstanceOf(ColumnNotFoundException.class);
    }
}