/*
 * Copyright (c) 2021 Ford Motor Company
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

package com.ford.labs.retroquest.thought;

import com.ford.labs.retroquest.column.Column;
import com.ford.labs.retroquest.column.ColumnRepository;
import com.ford.labs.retroquest.exception.ColumnTitleNotFoundException;
import com.ford.labs.retroquest.exception.ThoughtNotFoundException;
import com.ford.labs.retroquest.websocket.WebsocketService;
import com.ford.labs.retroquest.websocket.events.WebsocketEvent;
import com.ford.labs.retroquest.websocket.events.WebsocketThoughtEvent;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InOrder;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com.ford.labs.retroquest.websocket.events.WebsocketEventType.DELETE;
import static com.ford.labs.retroquest.websocket.events.WebsocketEventType.UPDATE;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.*;

class ThoughtServiceTest {

    private final ThoughtRepository thoughtRepository = mock(ThoughtRepository.class);
    private final ColumnRepository columnRepository = mock(ColumnRepository.class);
    private final WebsocketService websocketService = mock(WebsocketService.class);

    private ThoughtService thoughtService;

    @BeforeEach
    void setup() {
        this.thoughtService = new ThoughtService(
                this.thoughtRepository,
                this.columnRepository,
                this.websocketService
        );
    }

    @Test
    void likeThoughtShouldIncrementNumberOfLikesByOne() {
        var teamId = "the-team";
        long thoughtId = 1234L;
        var expectedThought = Thought.builder().id(thoughtId).teamId(teamId).hearts(6).build();
        var expectedEvent = new WebsocketThoughtEvent(teamId, UPDATE, expectedThought);

        given(this.thoughtRepository.findByTeamIdAndId(teamId, thoughtId)).willReturn(Optional.of(expectedThought));


        assertThat(this.thoughtService.likeThought(teamId, thoughtId)).isEqualTo(expectedThought);
        InOrder inOrder = inOrder(thoughtRepository);
        inOrder.verify(thoughtRepository).incrementHeartCount(thoughtId);
        inOrder.verify(thoughtRepository).findByTeamIdAndId(teamId, thoughtId);
        then(websocketService).should().publishEvent(expectedEvent);
    }

    @Test
    void whenLikingThoughtWhichDoesntHaveAValidIDThrowsThoughtNotFoundException() {
        Long badId = -1L;
        given(this.thoughtRepository.findByTeamIdAndId(any(), any())).willThrow(new ThoughtNotFoundException(badId));
        ThoughtNotFoundException actualException = assertThrows(ThoughtNotFoundException.class, () -> thoughtService.likeThought("the-team", badId));
        assertThat(actualException.getMessage()).contains(badId.toString());
        verify(thoughtRepository, times(0)).save(any());
    }

    @Test
    void whenDiscussingThoughtNotDiscussedThoughtIsSetToTrue() {
        var teamId = "the-team";
        var thought = Thought.builder().id(1234L).discussed(true).build();
        var expectedThought = Thought.builder().id(1234L).discussed(false).build();
        var expectedEvent = new WebsocketThoughtEvent(teamId, UPDATE, expectedThought);
        given(this.thoughtRepository.findByTeamIdAndId(teamId, thought.getId())).willReturn(Optional.of(thought));
        given(this.thoughtRepository.save(expectedThought)).willReturn(expectedThought);

        var actualThought = thoughtService.discussThought(teamId, thought.getId(), false);

        then(thoughtRepository).should().save(expectedThought);
        then(websocketService).should().publishEvent(expectedEvent);
        assertThat(actualThought).usingRecursiveComparison().isEqualTo(expectedThought);
    }

    @Test
    public void updateColumn_WithNewColumn_ReturnsUpdatedThought() {
        var teamId = "the-team";
        String newTopic = "right-column";
        Thought thought = Thought.builder().id(1234L).build();
        Column expectedColumn = new Column(6789L, newTopic, "TITLE", teamId);
        Thought expectedThought = Thought.builder().id(1234L).columnId(6789L).build();
        given(this.thoughtRepository.findByTeamIdAndId(teamId, 1234L)).willReturn(Optional.of(thought));
        given(this.thoughtRepository.save(expectedThought)).willReturn(expectedThought);
        given(this.columnRepository.findByTeamIdAndId(teamId, 6789L)).willReturn(Optional.of(expectedColumn));

        Thought actualThought = thoughtService.updateColumn(teamId, 1234L, 6789L);

        assertThat(actualThought).usingRecursiveComparison().isEqualTo(expectedThought);
    }

    @Test
    public void updateColumn_WithNewColumn_EmitsUpdatedThought() {
        var teamId = "the-team";
        String newTopic = "right-column";
        Thought thought = Thought.builder().id(1234L).build();
        Column expectedColumn = new Column(6789L, newTopic, "TITLE", teamId);
        Thought expectedThought = Thought.builder().id(1234L).columnId(6789L).build();
        given(this.thoughtRepository.findByTeamIdAndId(teamId, 1234L)).willReturn(Optional.of(thought));
        given(this.thoughtRepository.save(expectedThought)).willReturn(expectedThought);
        given(this.columnRepository.findByTeamIdAndId(teamId, 6789L)).willReturn(Optional.of(expectedColumn));

        thoughtService.updateColumn(teamId, 1234L, 6789L);

        WebsocketEvent expectedEvent = new WebsocketThoughtEvent(teamId, UPDATE, expectedThought);
        verify(websocketService).publishEvent(eq(expectedEvent));

    }

    @Test
    public void updateColumn_WithColumnThatDoesNotExist_ThrowsColumnTitleNotFoundException() {
        given(this.columnRepository.findByTeamIdAndId("the-team", 6789L)).willReturn(Optional.empty());
        assertThatThrownBy(() -> thoughtService.updateColumn("the-team", 1234L, 6789L))
                .isInstanceOf(ColumnTitleNotFoundException.class);
    }

    @Test
    void whenThoughtMessageIsUpdatedThoughtIsUpdated() {
        var teamId = "the-team";
        var updatedMessage = "Update message hello";
        var thought = Thought.builder().id(1234L).teamId(teamId).message("Hello").build();
        var expectedThought = Thought.builder().id(1234L).teamId(teamId).message(updatedMessage).build();
        given(this.thoughtRepository.findByTeamIdAndId(teamId, thought.getId())).willReturn(Optional.of(thought));
        given(this.thoughtRepository.save(expectedThought)).willReturn(expectedThought);

        var updatedThought = thoughtService.updateThoughtMessage(teamId, thought.getId(), updatedMessage);
        then(thoughtRepository).should().save(expectedThought);
        then(websocketService).should().publishEvent(new WebsocketThoughtEvent(teamId, UPDATE, expectedThought));
        assertThat(updatedThought).usingRecursiveComparison().isEqualTo(expectedThought);
    }

    @Test
    void whenGettingThoughtsForTeamThoughtsAreRetrieved() {
        Thought thought = Thought.builder().teamId("the-team").discussed(true).build();
        List<Thought> listOfThoughts = new ArrayList<>();
        listOfThoughts.add(thought);
        given(this.thoughtRepository.findAllByTeamIdAndBoardIdIsNull("the-team")).willReturn(listOfThoughts);
        thoughtService.fetchAllActiveThoughts("the-team");
        then(thoughtRepository).should().findAllByTeamIdAndBoardIdIsNull("the-team");
    }

    @Test
    void whenDeletingThoughtsByTeamIdAndThoughtIdThoughtIsDeleted() {
        var expectedEvent = new WebsocketThoughtEvent("the-team", DELETE, Thought.builder().id(1234L).build());
        thoughtService.deleteThought("the-team", 1234L);
        then(thoughtRepository).should().deleteThoughtByTeamIdAndId("the-team", 1234L);
        then(websocketService).should().publishEvent(expectedEvent);
    }

    @Test
    void shouldCreateThought() {
        var message = "Hello there!";
        var columnTitle = Column.builder().id(6789L).title("Happy").build();
        var request = new CreateThoughtRequest(
            message,
            columnTitle.getId()
        );

        var expectedThought = new Thought(
                1234L,
                message,
                0,
                false,
                "the-team",
                null,
                6789L
        );
        var expectedEvent = new WebsocketThoughtEvent("the-team", UPDATE, expectedThought);

        given(columnRepository.findByTeamIdAndId("the-team", 6789L)).willReturn(Optional.of(columnTitle));
        given(thoughtRepository.save(any(Thought.class))).willAnswer(a -> {
            var thought = a.<Thought>getArgument(0);
            thought.setId(1234L);
            return thought;
        });

        var actualThought = thoughtService.createThought("the-team", request);

        assertThat(actualThought).usingRecursiveComparison().isEqualTo(expectedThought);
        then(websocketService).should().publishEvent(expectedEvent);
    }

}
