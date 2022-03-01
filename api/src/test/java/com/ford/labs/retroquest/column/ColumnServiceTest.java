package com.ford.labs.retroquest.column;

import com.ford.labs.retroquest.columntitle.ColumnTitle;
import com.ford.labs.retroquest.columntitle.ColumnTitleRepository;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ColumnServiceTest {

    private final ColumnTitleRepository columnTitleRepository = mock(ColumnTitleRepository.class);
    private final ColumnService service = new ColumnService(columnTitleRepository);

    @Test
    public void getColumns_ReturnsSortedListOfColumns() {
        var expectedColumns = List.of(new Column(1L, "title 1", "happy"), new Column(2L, "title 2", "unhappy"));
        var savedColumnTitles = List.of(new ColumnTitle(2L, "unhappy", "title 2", "team id"), new ColumnTitle(1L, "happy", "title 1", "team id"));
        when(columnTitleRepository.findAllByTeamId("team id")).thenReturn(savedColumnTitles);

        var actualColumns = service.getColumns("team id");

        assertThat(actualColumns).containsExactlyElementsOf(expectedColumns);
    }
}