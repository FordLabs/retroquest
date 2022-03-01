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

import com.ford.labs.retroquest.column.ColumnTitle;
import com.ford.labs.retroquest.column.ColumnTitleRepository;
import com.ford.labs.retroquest.exception.ColumnTitleNotFoundException;
import com.ford.labs.retroquest.exception.ThoughtNotFoundException;
import com.ford.labs.retroquest.websocket.WebsocketEvent;
import com.ford.labs.retroquest.websocket.WebsocketService;
import com.ford.labs.retroquest.websocket.WebsocketThoughtEvent;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InOrder;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com.ford.labs.retroquest.websocket.WebsocketEventType.DELETE;
import static com.ford.labs.retroquest.websocket.WebsocketEventType.UPDATE;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.*;

class ThoughtServiceTest {

    private final ThoughtRepository thoughtRepository = mock(ThoughtRepository.class);
    private final ColumnTitleRepository columnTitleRepository = mock(ColumnTitleRepository.class);
    private final WebsocketService websocketService = mock(WebsocketService.class);

    private ThoughtService thoughtService;

    @BeforeEach
    void setup() {
        this.thoughtService = new ThoughtService(
                this.thoughtRepository,
                this.columnTitleRepository,
                this.websocketService
        );
    }

    @Test
    void likeThoughtShouldIncrementNumberOfLikesByOne() {
        long thoughtId = 1234L;
        var expectedThought = Thought.builder().id(thoughtId).teamId("the-team").hearts(6).build();
        var expectedEvent = new WebsocketThoughtEvent("the-team", UPDATE, expectedThought);

        given(this.thoughtRepository.findById(thoughtId)).willReturn(Optional.of(expectedThought));


        assertThat(this.thoughtService.likeThought(thoughtId)).isEqualTo(expectedThought);
        InOrder inOrder = inOrder(thoughtRepository);
        inOrder.verify(thoughtRepository).incrementHeartCount(thoughtId);
        inOrder.verify(thoughtRepository).findById(thoughtId);
        then(websocketService).should().publishEvent(expectedEvent);
    }

    @Test
    void whenLikingThoughtWhichDoesntHaveAValidIDThrowsThoughtNotFoundException() {
        Long badId = -1L;
        given(this.thoughtRepository.findById(any())).willThrow(new ThoughtNotFoundException(badId));
        ThoughtNotFoundException actualException = assertThrows(ThoughtNotFoundException.class, () -> thoughtService.likeThought(badId));
        assertThat(actualException.getMessage()).contains(badId.toString());
        verify(thoughtRepository, times(0)).save(any());
    }

    @Test
    void whenDiscussingThoughtNotDiscussedThoughtIsSetToTrue() {
        var thought = Thought.builder().id(1234L).discussed(true).build();
        var expectedThought = Thought.builder().id(1234L).discussed(false).build();
        var expectedEvent = new WebsocketThoughtEvent("the-team", UPDATE, expectedThought);
        given(this.thoughtRepository.findById(thought.getId())).willReturn(Optional.of(thought));
        given(this.thoughtRepository.save(expectedThought)).willReturn(expectedThought);

        var actualThought = thoughtService.discussThought(thought.getId(), false);

        then(thoughtRepository).should().save(expectedThought);
        then(websocketService).should().publishEvent(expectedEvent);
        assertThat(actualThought).usingRecursiveComparison().isEqualTo(expectedThought);
    }

    @Test
    public void updateColumn_WithNewColumn_ReturnsUpdatedThought() {
        String newTopic = "right-column";
        Thought thought = Thought.builder().id(1234L).topic("wrong-column").build();
        ColumnTitle expectedColumnTitle = new ColumnTitle(6789L, newTopic, "TITLE", "the-team");
        Thought expectedThought = Thought.builder().id(1234L).topic(newTopic).build();
        given(this.thoughtRepository.findById(1234L)).willReturn(Optional.of(thought));
        given(this.thoughtRepository.save(expectedThought)).willReturn(expectedThought);
        given(this.columnTitleRepository.findById(6789L)).willReturn(Optional.of(expectedColumnTitle));

        Thought actualThought = thoughtService.updateColumn(1234L, 6789L);

        assertThat(actualThought).isEqualTo(expectedThought);
    }

    @Test
    public void updateColumn_WithNewColumn_EmitsUpdatedThought() {
        String newTopic = "right-column";
        Thought thought = Thought.builder().id(1234L).topic("wrong-column").build();
        ColumnTitle expectedColumnTitle = new ColumnTitle(6789L, newTopic, "TITLE", "the-team");
        Thought expectedThought = Thought.builder().id(1234L).topic(newTopic).build();
        given(this.thoughtRepository.findById(1234L)).willReturn(Optional.of(thought));
        given(this.thoughtRepository.save(expectedThought)).willReturn(expectedThought);
        given(this.columnTitleRepository.findById(6789L)).willReturn(Optional.of(expectedColumnTitle));

        thoughtService.updateColumn(1234L, 6789L);

        WebsocketEvent expectedEvent = new WebsocketThoughtEvent("the-team", UPDATE, expectedThought);
        verify(websocketService).publishEvent(eq(expectedEvent));

    }

    @Test
    public void updateColumn_WithColumnThatDoesNotExist_ThrowsColumnTitleNotFoundException() {
        given(this.columnTitleRepository.findById(6789L)).willReturn(Optional.empty());
        assertThatThrownBy(() -> thoughtService.updateColumn(1234L, 6789L))
                .isInstanceOf(ColumnTitleNotFoundException.class);
    }

    @Test
    void whenThoughtMessageIsUpdatedThoughtIsUpdated() {
        var updatedMessage = "Update message hello";
        var thought = Thought.builder().id(1234L).teamId("the-team").message("Hello").build();
        var expectedThought = Thought.builder().id(1234L).teamId("the-team").message(updatedMessage).build();
        given(this.thoughtRepository.findById(thought.getId())).willReturn(Optional.of(thought));
        given(this.thoughtRepository.save(expectedThought)).willReturn(expectedThought);

        var updatedThought = thoughtService.updateThoughtMessage(thought.getId(), updatedMessage);
        then(thoughtRepository).should().save(expectedThought);
        then(websocketService).should().publishEvent(new WebsocketThoughtEvent("the-team", UPDATE, expectedThought));
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
        var topic = "topic";
        var columnTitle = ColumnTitle.builder().title("Happy").build();
        var request = new CreateThoughtRequest(
            null,
            message,
            0,
            topic,
            false,
            "the-team",
            null
        );

        var expectedThought = new Thought(
                1234L,
                message,
                0,
                topic,
                false,
                "the-team",
                columnTitle,
                null
        );
        var expectedEvent = new WebsocketThoughtEvent("the-team", UPDATE, expectedThought);

        given(columnTitleRepository.findByTeamIdAndTopic("the-team", topic)).willReturn(columnTitle);
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
