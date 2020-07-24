/*
 * Copyright (c) 2018 Ford Motor Company
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

package com.ford.labs.retroquest.deprecated_tests;

import com.ford.labs.retroquest.actionitem.ActionItem;
import com.ford.labs.retroquest.actionitem.ActionItemRepository;
import com.ford.labs.retroquest.columntitle.ColumnTitle;
import com.ford.labs.retroquest.columntitle.ColumnTitleRepository;
import com.ford.labs.retroquest.thought.Thought;
import com.ford.labs.retroquest.thought.ThoughtRepository;
import com.ford.labs.retroquest.v2.columns.ColumnCombinerResponse;
import com.ford.labs.retroquest.v2.columns.ColumnCombinerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ColumnCombinerServiceTest {

    @Mock
    private ThoughtRepository thoughtRepository;

    @Mock
    private ColumnTitleRepository columnTitleRepository;

    @Mock
    private ActionItemRepository actionItemRepository;

    @InjectMocks
    private ColumnCombinerService columnCombinerService;

    private ColumnCombinerResponse response;

    @BeforeEach
    public void init() {
        when(thoughtRepository.findAllByTeamIdAndBoardIdIsNull(fakeTeamId)).thenReturn(
                Arrays.asList(
                        expectedActiveHappyThoughts,
                        expectedCompletedHappyThoughts,

                        expectedActiveConfusedThoughts,
                        expectedCompletedConfusedThoughts,

                        expectedActiveSadThoughts,
                        expectedCompletedSadThoughts
                )
        );

        when(actionItemRepository.findAllByTeamIdAndArchivedIsFalse(fakeTeamId)).thenReturn(
                Arrays.asList(
                        expectedActiveActionItems,
                        expectedCompletedActionItems
                )
        );

        when(columnTitleRepository.findAllByTeamId(fakeTeamId)).thenReturn(
                Arrays.asList(
                        expectedActiveHappyThoughts.getColumnTitle(),
                        expectedActiveConfusedThoughts.getColumnTitle(),
                        expectedActiveSadThoughts.getColumnTitle()
                )
        );

        response = columnCombinerService.aggregateResponse(fakeTeamId);

    }

    private String fakeTeamId = "some team id";

    private Thought expectedActiveHappyThoughts = Thought.builder()
            .teamId(fakeTeamId).message("happy 1").topic("happy").discussed(false)
            .columnTitle(ColumnTitle.builder().id(0L).title("Happy").topic("happy").build())
            .build();

    private Thought expectedActiveConfusedThoughts = Thought.builder()
            .teamId(fakeTeamId).message("confused 1").topic("confused").discussed(false)
            .columnTitle(ColumnTitle.builder().id(1L).title("Confused").topic("confused").build())
            .build();


    private Thought expectedActiveSadThoughts = Thought.builder()
            .teamId(fakeTeamId).message("sad 1").topic("sad").discussed(false)
            .columnTitle(ColumnTitle.builder().id(2L).title("Sad").topic("sad").build())
            .build();


    private ActionItem expectedActiveActionItems = ActionItem.builder()
            .teamId(fakeTeamId).task("sad 2").completed(false)
            .build();


    private Thought expectedCompletedHappyThoughts = Thought.builder()
            .teamId(fakeTeamId).message("happy 2").topic("happy").discussed(true)
            .columnTitle(ColumnTitle.builder().id(0L).title("Happy").topic("happy").build())
            .build();


    private Thought expectedCompletedConfusedThoughts = Thought.builder()
            .teamId(fakeTeamId).message("confused 2").topic("confused").discussed(true)
            .columnTitle(ColumnTitle.builder().id(1L).title("Confused").topic("confused").build())
            .build();


    private Thought expectedCompletedSadThoughts = Thought.builder()
            .teamId(fakeTeamId).message("sad 2").topic("sad").discussed(true)
            .columnTitle(ColumnTitle.builder().id(2L).title("Sad").topic("sad").build())
            .build();

    private ActionItem expectedCompletedActionItems = ActionItem.builder()
            .teamId(fakeTeamId).task("sad 2").completed(true)
            .build();

    // "should contain all the columns"
    @Test
    public void createResponse() {
        assertThat(response.getColumns()).hasSize(4);
    }


    // "should set the column topics in order"
    @Test
    public void columnTopicInOrder() {
        assertThat(response.getColumns().get(0).getTopic()).isEqualTo("happy");
        assertThat(response.getColumns().get(1).getTopic()).isEqualTo("confused");
        assertThat(response.getColumns().get(2).getTopic()).isEqualTo("sad");
        assertThat(response.getColumns().get(3).getTopic()).isEqualTo("action");
    }

    // "should set the column titles in order"
    @Test
    public void columnTitleInOrder() {
        assertThat(response.getColumns().get(0).getTitle()).isEqualTo("Happy");
        assertThat(response.getColumns().get(1).getTitle()).isEqualTo("Confused");
        assertThat(response.getColumns().get(2).getTitle()).isEqualTo("Sad");
        assertThat(response.getColumns().get(3).getTitle()).isEqualTo("Action Item");
    }

    // "should put active items in correct list"
    @Test
    public void activeItemsList() {
        assertThat(response.getColumns().get(0).getItems().getActive()).containsExactly(expectedActiveHappyThoughts);
        assertThat(response.getColumns().get(1).getItems().getActive()).containsExactly(expectedActiveConfusedThoughts);
        assertThat(response.getColumns().get(2).getItems().getActive()).containsExactly(expectedActiveSadThoughts);
        assertThat(response.getColumns().get(3).getItems().getActive()).containsExactly(expectedActiveActionItems);
    }

    // "should put completed items in correct list"
    @Test
    public void completedItemsList() {
        assertThat(response.getColumns().get(0).getItems().getCompleted()).containsExactly(
                expectedCompletedHappyThoughts);
        assertThat(response.getColumns().get(1).getItems().getCompleted()).containsExactly(
                expectedCompletedConfusedThoughts);
        assertThat(response.getColumns().get(2).getItems().getCompleted()).containsExactly(
                expectedCompletedSadThoughts);
        assertThat(response.getColumns().get(3).getItems().getCompleted()).containsExactly(
                expectedCompletedActionItems);
    }

}