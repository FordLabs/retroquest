package com.ford.labs.retroquest.column;

import com.ford.labs.retroquest.columntitle.ColumnTitle;
import com.ford.labs.retroquest.columntitle.ColumnTitleService;
import com.ford.labs.retroquest.thought.Thought;
import com.ford.labs.retroquest.thought.ThoughtService;
import org.junit.jupiter.api.Test;

import java.util.List;

import static java.util.Arrays.asList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ColumnServiceTest {

    private final ThoughtService thoughtService = mock(ThoughtService.class);
    private final ColumnTitleService columnTitleService = mock(ColumnTitleService.class);
    private final ColumnService service = new ColumnService(thoughtService, columnTitleService);

    @Test
    public void getColumns_ReturnsSortedListOfColumnsWithThoughts() {
        var teamId = "The Team";

        var happyColumnTitle = new ColumnTitle(10L, "happy", "Happy", teamId);
        var confusedColumnTitle = new ColumnTitle(11L, "confused", "Confused", teamId);
        var sadColumnTitle = new ColumnTitle(12L, "sad", "Sad", teamId);
        var savedColumns = List.of(confusedColumnTitle, happyColumnTitle, sadColumnTitle);
        when(columnTitleService.getColumnTitlesByTeamId(teamId)).thenReturn(savedColumns);

        var happyThought1 = Thought.builder().id(1L).topic("happy").columnTitle(happyColumnTitle).build();
        var happyThought2 = Thought.builder().id(2L).topic("happy").columnTitle(happyColumnTitle).build();
        var confusedThought1 = Thought.builder().id(3L).topic("confused").columnTitle(confusedColumnTitle).build();
        var confusedThought2 = Thought.builder().id(4L).topic("confused").columnTitle(confusedColumnTitle).build();
        var sadThought1 = Thought.builder().id(5L).topic("sad").columnTitle(sadColumnTitle).build();
        var sadThought2 = Thought.builder().id(6L).topic("sad").columnTitle(sadColumnTitle).build();
        var savedThoughts = List.of(happyThought1, confusedThought1, sadThought2, sadThought1, confusedThought2, happyThought2);
        when(thoughtService.fetchAllActiveThoughts(teamId)).thenReturn(savedThoughts);


        var actual = service.getColumns(teamId);

        var expectedHappyColumn = new Column(10L, "Happy", asList(happyThought1, happyThought2));
        var expectedConfusedColumn = new Column(11L, "Confused", asList(confusedThought1, confusedThought2));
        var expectedSadColumn = new Column(12L, "Sad", asList(sadThought1, sadThought2));
        assertThat(actual).containsExactly(expectedHappyColumn, expectedConfusedColumn, expectedSadColumn);
    }

    @Test
    public void getColumns_ignoresThoughtsWithColumnThatDoesNotExist() {
        var teamId = "The Team";
        var unsavedTitle = new ColumnTitle(null, "something-else", "Something Else", teamId);
        when(columnTitleService.getColumnTitlesByTeamId(teamId)).thenReturn(List.of());

        var nullThought = Thought.builder().id(1L).topic(null).columnTitle(null).build();
        var unsavedTitleThought = Thought.builder().id(2L).topic("something-else").columnTitle(unsavedTitle).build();
        when(thoughtService.fetchAllActiveThoughts(teamId)).thenReturn(List.of(nullThought, unsavedTitleThought));


        var actual = service.getColumns(teamId);

        assertThat(actual).isEmpty();
    }
}