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

package com.ford.labs.retroquest.deprecated_tests;

import com.ford.labs.retroquest.actionitem.ActionItem;
import com.ford.labs.retroquest.column.Column;
import com.ford.labs.retroquest.team.CsvFile;
import com.ford.labs.retroquest.thought.Thought;
import org.apache.commons.io.FileUtils;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.core.Is.is;

class CsvFileTest {

    @Test
    void shouldConvertThoughtsAndActionItemsToACSV() throws IOException {
        var column1 = new Column(1L, "happy", "Happy", "teamId");
        var column2 = new Column(2L, "confused", "Meh", "teamId");
        var column3 = new Column(3L, "unhappy", "Sad", "teamId");

        var firstThought = Thought.builder()
            .message("stuff \"goes here\"")
            .hearts(5)
            .discussed(false)
            .columnId(2L)
            .build();

        var secondThought = Thought.builder()
            .message("a thought, with a comma")
            .hearts(2)
            .discussed(true)
            .columnId(1L)
            .build();

        var thirdThought = Thought.builder()
            .message("sad")
            .hearts(0)
            .discussed(false)
            .columnId(3L)
            .build();

        var actionItem = ActionItem.builder()
            .task("tasks and \"stuff, yo\"")
            .completed(false)
            .assignee("test user")
            .build();

        String actual = new CsvFile(
            "teamName",
            List.of(firstThought, secondThought, thirdThought),
            List.of(actionItem),
            List.of(column1, column2, column3)
        ).getCsvString();

        String expected = FileUtils.readFileToString(
            new File("src/test/resources/sampleOutput.csv"),
            Charset.defaultCharset()
        );

        assertThat(actual, is(equalTo(expected)));
    }

    @Test
    public void getCsvString_WithCompletedActionItem_ReturnsYes() throws IOException {
        var actionItem = new ActionItem(null, "task", true, "teamId", "assignee", null, true);
        String actual = new CsvFile(
                "teamName",
                List.of(),
                List.of(actionItem),
                List.of()
        ).getCsvString();
        Assertions.assertThat(actual).contains("action item,task,,yes,assignee");
    }

    @Test
    public void getCsvString_WithIncompleteActionItem_ReturnsNo() throws IOException {
        var actionItem = new ActionItem(null, "task", false, "teamId", "assignee", null, true);
        String actual = new CsvFile(
                "teamName",
                List.of(),
                List.of(actionItem),
                List.of()
        ).getCsvString();
        Assertions.assertThat(actual).contains("action item,task,,no,assignee");
    }

    @Test
    public void getCsvString_WithNullAssignee_ReturnsEmptyString() throws IOException {
        var actionItem = new ActionItem(null, "task", false, "teamId", null, null, true);
        String actual = new CsvFile(
                "teamName",
                List.of(),
                List.of(actionItem),
                List.of()
        ).getCsvString();
        Assertions.assertThat(actual).contains("action item,task,,no,");
    }
}
