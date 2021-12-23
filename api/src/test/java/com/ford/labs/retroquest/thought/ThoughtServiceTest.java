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

import com.ford.labs.retroquest.columntitle.ColumnTitle;
import com.ford.labs.retroquest.columntitle.ColumnTitleRepository;
import com.ford.labs.retroquest.exception.ThoughtNotFoundException;
import com.ford.labs.retroquest.websocket.WebsocketEvent;
import com.ford.labs.retroquest.websocket.WebsocketService;
import com.ford.labs.retroquest.websocket.WebsocketThoughtEvent;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import static com.ford.labs.retroquest.websocket.WebsocketEventType.DELETE;
import static com.ford.labs.retroquest.websocket.WebsocketEventType.UPDATE;
import static org.assertj.core.api.Assertions.assertThat;
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
    private final Long thoughtId = 1L;
    private final String teamId = "1";

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
        var thought = Thought.builder().id(1234L).message("Hello").topic("happy").hearts(5).build();
        var expectedThought = Thought.builder().id(1234L).message("Hello").topic("happy").hearts(6).build();
        var expectedEvent = new WebsocketThoughtEvent(teamId, UPDATE, expectedThought);

        given(this.thoughtRepository.findById(thought.getId())).willReturn(Optional.of(thought));
        given(thoughtRepository.save(thought)).willReturn(thought);

        assertThat(this.thoughtService.likeThought(thought.getId())).isEqualTo(expectedThought);
        then(thoughtRepository).should(atMostOnce()).save(thought);
        then(websocketService).should().publishEvent(expectedEvent);
    }

    @Test
    void whenLikingThoughtWhichDoesntHaveAValidIDThrowsThoughtNotFoundException() {
        Thought thought = Thought.builder().id(1234L).message("Hello").topic("happy").hearts(5).build();
        var expectedThought = Thought.builder().id(1234L).message("Hello").topic("happy").hearts(6).build();

        given(this.thoughtRepository.findById(thought.getId())).willThrow(new ThoughtNotFoundException(thought.getId()));

        ThoughtNotFoundException actualException = assertThrows(ThoughtNotFoundException.class, () -> thoughtService.likeThought(thought.getId()));
        assertThat(actualException.getMessage()).contains(expectedThought.getId().toString());
        then(thoughtRepository).should(never()).save(expectedThought);
    }

    @Test
    void whenDiscussingThoughtNotDiscussedThoughtIsSetToTrue() {
        Thought thought = Thought.builder().id(1234L).message("Hello").topic("happy").discussed(false).build();
        var expectedThought = Thought.builder().id(1234L).message("Hello").topic("happy").discussed(true).build();
        given(this.thoughtRepository.findById(thought.getId())).willReturn(Optional.of(thought));
        given(this.thoughtRepository.save(expectedThought)).willReturn(expectedThought);

        var actualThought = thoughtService.discussThought(thought.getId());

        then(thoughtRepository).should().save(expectedThought);
        assertThat(actualThought).usingRecursiveComparison().isEqualTo(expectedThought);
    }

    @Test
    void whenDiscussingThoughtPreviouslyDiscussedThoughtIsSetToFalse() {
        Thought thought = Thought.builder().id(1234L).message("Hello").topic("happy").discussed(true).build();
        var expectedThought = Thought.builder().id(1234L).message("Hello").topic("happy").discussed(false).build();
        given(this.thoughtRepository.findById(thought.getId())).willReturn(Optional.of(thought));
        given(this.thoughtRepository.save(expectedThought)).willReturn(expectedThought);

        var actualThought = thoughtService.discussThought(thought.getId());

        then(thoughtRepository).should().save(expectedThought);
        assertThat(actualThought).usingRecursiveComparison().isEqualTo(expectedThought);
    }

    @Test
    public void whenDiscussingThought_EmitsUpdatedThought() {
        Thought thought = Thought.builder().id(1234L).message("Hello").topic("happy").discussed(true).build();
        var expectedThought = Thought.builder().id(1234L).message("Hello").topic("happy").discussed(false).build();
        var expectedEvent = new WebsocketThoughtEvent(expectedThought.getTeamId(), UPDATE, expectedThought);
        given(this.thoughtRepository.findById(thought.getId())).willReturn(Optional.of(thought));
        given(this.thoughtRepository.save(expectedThought)).willReturn(expectedThought);

        thoughtService.discussThought(thought.getId());

        then(websocketService).should().publishEvent(expectedEvent);
    }

    @Test
    public void updateTopic_WithNewTopic_ReturnsUpdatedThought() {
        String newTopic = "right-column";
        Thought thought = Thought.builder().id(thoughtId).topic("wrong-column").build();
        Thought expectedThought = Thought.builder().id(thoughtId).topic(newTopic).build();
        given(this.thoughtRepository.findById(thoughtId)).willReturn(Optional.ofNullable(thought));
        given(this.thoughtRepository.save(expectedThought)).willReturn(expectedThought);

        Thought actualThought = thoughtService.updateTopic(thoughtId, newTopic);

        assertThat(actualThought).isEqualTo(expectedThought);
    }

    @Test
    public void updateTopic_WithNewTopic_EmitsUpdatedThought() {
        String newTopic = "right-column";
        Thought thought = Thought.builder().id(thoughtId).topic("wrong-column").build();
        Thought expectedThought = Thought.builder().id(thoughtId).topic(newTopic).build();
        given(this.thoughtRepository.findById(thoughtId)).willReturn(Optional.ofNullable(thought));
        given(this.thoughtRepository.save(expectedThought)).willReturn(expectedThought);

        thoughtService.updateTopic(thoughtId, newTopic);

        WebsocketEvent expectedEvent = new WebsocketThoughtEvent(teamId, UPDATE, expectedThought);
        verify(websocketService).publishEvent(eq(expectedEvent));

    }

    @Test
    void whenThoughtMessageIsUpdatedThoughtIsUpdated() {
        Thought thought = Thought.builder().discussed(true).build();
        String updatedMessage = "update message hello";

        given(this.thoughtRepository.findById(thoughtId)).willReturn(Optional.ofNullable(thought));
        thoughtService.updateThoughtMessage(thoughtId, updatedMessage);
        assertThat(Objects.requireNonNull(thought).getMessage()).isEqualTo(updatedMessage);
        then(thoughtRepository).should().save(thought);
    }

    @Test
    void whenGettingThoughtsForTeamThoughtsAreRetrieved() {
        Thought thought = Thought.builder().discussed(true).build();
        List<Thought> listOfThoughts = new ArrayList<>();
        listOfThoughts.add(thought);
        given(this.thoughtRepository.findAllByTeamIdAndBoardIdIsNull(teamId)).willReturn(listOfThoughts);
        thoughtService.fetchAllThoughts(teamId);
        then(thoughtRepository).should().findAllByTeamIdAndBoardIdIsNull(teamId);
    }

    @Test
    void whenDeletingThoughtsByTeamIdAndThoughtIdThoughtIsDeleted() {
        var expectedEvent = new WebsocketThoughtEvent(teamId, DELETE, Thought.builder().id(thoughtId).build());
        thoughtService.deleteThought(teamId, thoughtId);
        then(thoughtRepository).should().deleteThoughtByTeamIdAndId(teamId, thoughtId);
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
            teamId,
            null
        );

        var expectedThought = new Thought(
                1234L,
                message,
                0,
                topic,
                false,
                teamId,
                columnTitle,
                null
        );
        var expectedEvent = new WebsocketThoughtEvent(teamId, UPDATE, expectedThought);

        given(columnTitleRepository.findByTeamIdAndAndTopic(teamId, topic)).willReturn(columnTitle);
        given(thoughtRepository.save(any(Thought.class))).willAnswer(a -> {
            var thought = a.<Thought>getArgument(0);
            thought.setId(1234L);
            return thought;
        });

        var actualThought = thoughtService.createThought(teamId, request);

        assertThat(actualThought).usingRecursiveComparison().isEqualTo(expectedThought);
        then(websocketService).should().publishEvent(expectedEvent);
    }

}
