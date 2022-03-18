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

package com.ford.labs.retroquest.v2.columncombiner;

import com.ford.labs.retroquest.actionitem.ActionItem;
import com.ford.labs.retroquest.actionitem.ActionItemRepository;
import com.ford.labs.retroquest.column.ColumnTitle;
import com.ford.labs.retroquest.column.ColumnTitleRepository;
import com.ford.labs.retroquest.thought.Thought;
import com.ford.labs.retroquest.thought.ThoughtRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@Deprecated
class ColumnCombinerServiceTest {

    private final ThoughtRepository mockThoughtRepository = mock(ThoughtRepository.class);
    private final ActionItemRepository mockActionItemRepository = mock(ActionItemRepository.class);
    private final ColumnTitleRepository mockColumnTitleRepository = mock(ColumnTitleRepository.class);

    private final ColumnCombinerService subject = new ColumnCombinerService(
        mockThoughtRepository,
        mockActionItemRepository,
        mockColumnTitleRepository
    );

    private ColumnCombinerResponse response;
    private final String fakeTeamId = "some team id";

    private final Thought expectedActiveHappyThoughts = Thought.builder()
        .teamId(fakeTeamId).message("happy 1").topic("happy").discussed(false)
        .columnTitle(ColumnTitle.builder().id(0L).title("Happy").topic("happy").build())
        .build();

    private final Thought expectedActiveConfusedThoughts = Thought.builder()
        .teamId(fakeTeamId).message("confused 1").topic("confused").discussed(false)
        .columnTitle(ColumnTitle.builder().id(1L).title("Confused").topic("confused").build())
        .build();
    private final Thought expectedActiveSadThoughts = Thought.builder()
        .teamId(fakeTeamId).message("sad 1").topic("sad").discussed(false)
        .columnTitle(ColumnTitle.builder().id(2L).title("Sad").topic("sad").build())
        .build();
    private final ActionItem expectedActiveActionItems = ActionItem.builder()
        .teamId(fakeTeamId).task("sad 2").completed(false)
        .build();
    private final Thought expectedCompletedHappyThoughts = Thought.builder()
        .teamId(fakeTeamId).message("happy 2").topic("happy").discussed(true)
        .columnTitle(ColumnTitle.builder().id(0L).title("Happy").topic("happy").build())
        .build();
    private final Thought expectedCompletedConfusedThoughts = Thought.builder()
        .teamId(fakeTeamId).message("confused 2").topic("confused").discussed(true)
        .columnTitle(ColumnTitle.builder().id(1L).title("Confused").topic("confused").build())
        .build();
    private final Thought expectedCompletedSadThoughts = Thought.builder()
        .teamId(fakeTeamId).message("sad 2").topic("sad").discussed(true)
        .columnTitle(ColumnTitle.builder().id(2L).title("Sad").topic("sad").build())
        .build();
    private final ActionItem expectedCompletedActionItems = ActionItem.builder()
        .teamId(fakeTeamId).task("sad 2").completed(true)
        .build();

    @BeforeEach
    void init() {
        when(mockThoughtRepository.findAllByTeamIdAndBoardIdIsNull(fakeTeamId)).thenReturn(
            List.of(
                expectedActiveHappyThoughts,
                expectedCompletedHappyThoughts,

                expectedActiveConfusedThoughts,
                expectedCompletedConfusedThoughts,

                expectedActiveSadThoughts,
                expectedCompletedSadThoughts
            )
        );

        when(mockActionItemRepository.findAllByTeamIdAndArchived(fakeTeamId, false)).thenReturn(
            List.of(
                expectedActiveActionItems,
                expectedCompletedActionItems
            )
        );

        when(mockColumnTitleRepository.findAllByTeamId(fakeTeamId)).thenReturn(
            List.of(
                expectedActiveHappyThoughts.getColumnTitle(),
                expectedActiveConfusedThoughts.getColumnTitle(),
                expectedActiveSadThoughts.getColumnTitle()
            )
        );

        response = subject.aggregateResponse(fakeTeamId);
    }

    @Test
    @DisplayName("should contain all the columns")
    void createResponse() {
        assertThat(response.columns()).hasSize(4);
    }

    @Test
    @DisplayName("should set the column topics in order")
    void columnTopicInOrder() {
        assertThat(response.columns().get(0).topic()).isEqualTo("happy");
        assertThat(response.columns().get(1).topic()).isEqualTo("confused");
        assertThat(response.columns().get(2).topic()).isEqualTo("sad");
        assertThat(response.columns().get(3).topic()).isEqualTo("action");
    }

    @Test
    @DisplayName("should set the column titles in order")
    void columnTitleInOrder() {
        assertThat(response.columns().get(0).title()).isEqualTo("Happy");
        assertThat(response.columns().get(1).title()).isEqualTo("Confused");
        assertThat(response.columns().get(2).title()).isEqualTo("Sad");
        assertThat(response.columns().get(3).title()).isEqualTo("Action Items");
    }

    @Test
    @DisplayName("should put all active and completed items in one list")
    void itemsList() {
        assertThat((List<Thought>) response.columns().get(0).items())
            .containsExactlyInAnyOrder(expectedActiveHappyThoughts, expectedCompletedHappyThoughts);
        assertThat((List<Thought>) response.columns().get(1).items())
            .containsExactlyInAnyOrder(expectedActiveConfusedThoughts, expectedCompletedConfusedThoughts);
        assertThat((List<Thought>) response.columns().get(2).items())
            .containsExactlyInAnyOrder(expectedActiveSadThoughts, expectedCompletedSadThoughts);
        assertThat((List<ActionItem>) response.columns().get(3).items())
            .containsExactlyInAnyOrder(expectedActiveActionItems, expectedCompletedActionItems);
    }
}
