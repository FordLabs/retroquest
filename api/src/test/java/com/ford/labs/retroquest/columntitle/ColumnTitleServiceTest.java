package com.ford.labs.retroquest.columntitle;

import com.ford.labs.retroquest.exception.ColumnTitleNotFoundException;
import com.ford.labs.retroquest.websocket.WebsocketColumnTitleEvent;
import com.ford.labs.retroquest.websocket.WebsocketEventType;
import com.ford.labs.retroquest.websocket.WebsocketService;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

class ColumnTitleServiceTest {
    private final ColumnTitle.ColumnTitleBuilder columnTitleBuilder = ColumnTitle.builder();

    private final ColumnTitleRepository columnTitleRepository = mock(ColumnTitleRepository.class);
    private final MeterRegistry meterRegistry = mock(MeterRegistry.class);
    private final WebsocketService websocketService = mock(WebsocketService.class);
    private final ColumnTitleService columnTitleService = new ColumnTitleService(columnTitleRepository, meterRegistry, websocketService);


    @Test
    void given_teamid_get_column_titles() {
        String teamId = "some team id";
        String teamId2 = "some other team id";

        var columnTitle1 = columnTitleBuilder.topic("happy").title("Some Title").teamId(teamId).build();
        var columnTitle2 = columnTitleBuilder.topic("meh").title("Some Other Title").teamId(teamId).build();
        var columnTitle3 = columnTitleBuilder.topic("happy").title("Some Title").teamId(teamId2).build();
        when(columnTitleRepository.findAllByTeamId(teamId)).thenReturn(List.of(columnTitle1, columnTitle2));
        when(columnTitleRepository.findAllByTeamId(teamId2)).thenReturn(List.of(columnTitle3));

        assertThat(columnTitleService.getColumnTitlesByTeamId(teamId)).containsExactlyInAnyOrder(columnTitle1, columnTitle2);
        assertThat(columnTitleService.getColumnTitlesByTeamId(teamId2)).containsExactlyInAnyOrder(columnTitle3);
    }

    @Test
    void given_column_id_and_column_title_rename_column_in_db_and_return_new_column_title() {
        var teamId = "some team ID";
        var newColumnName = "Some new Title";
        var columnId = 42L;
        var savedColumn = columnTitleBuilder.id(columnId).topic("happy").title("Some Title").teamId(teamId).build();
        var expectedColumn = columnTitleBuilder.id(columnId).topic("happy").title("Some new Title").teamId(teamId).build();
        var expectedEvent = new WebsocketColumnTitleEvent(teamId, WebsocketEventType.UPDATE, expectedColumn);
        var mockedCounter = mock(Counter.class);

        when(columnTitleRepository.findById(columnId)).thenReturn(Optional.of(savedColumn));
        when(columnTitleRepository.save(expectedColumn)).thenReturn(expectedColumn);
        when(meterRegistry.counter("retroquest.columns.changed.count")).thenReturn(mockedCounter);

        var savedColumnTitle = columnTitleService.editColumnTitleName(columnId, newColumnName, teamId );

        assertThat(savedColumnTitle).usingRecursiveComparison().isEqualTo(expectedColumn);
        verify(mockedCounter, times(1)).increment();
        verify(websocketService).publishEvent(expectedEvent);
    }

    @Test
    void throws_column_title_not_found_exception_when_column_title_not_in_db() {
        var columnId = 42L;
        when(columnTitleRepository.findById(columnId)).thenReturn(Optional.empty());

        assertThatThrownBy(() ->
                columnTitleService.editColumnTitleName(columnId, "some name", "some team id")
        ).isInstanceOf(ColumnTitleNotFoundException.class);
    }
}