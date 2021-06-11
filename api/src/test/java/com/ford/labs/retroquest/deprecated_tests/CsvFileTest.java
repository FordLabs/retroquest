/*
 * Copyright © 2018 Ford Motor Company
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
import com.ford.labs.retroquest.columntitle.ColumnTitle;
import com.ford.labs.retroquest.team.CsvFile;
import com.ford.labs.retroquest.thought.Thought;
import org.apache.commons.io.FileUtils;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.Arrays;
import java.util.Collections;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.core.Is.is;

class CsvFileTest {

    @Test
    void shouldConvertThoughtsAndActionItemsToACSV() throws IOException {

        Thought firstThought = Thought.builder()
                .topic("confused")
                .message("stuff \"goes here\"")
                .hearts(5)
                .discussed(false)
                .columnTitle(ColumnTitle.builder().title("CONFUSED").build())
                .build();

        Thought secondThoght = Thought.builder()
                .topic("happy")
                .message("a thought, with a comma")
                .hearts(2)
                .columnTitle(ColumnTitle.builder().title("HAPPY").build())
                .discussed(true)
                .build();

        Thought thirdThought = Thought.builder()
                .topic("unhappy")
                .message("sad")
                .hearts(0)
                .discussed(false)
                .columnTitle(ColumnTitle.builder().title("SAD").build())
                .build();

        ActionItem actionItem = ActionItem.builder()
                .task("tasks and \"stuff, yo\"")
                .completed(false)
                .assignee("test user")
                .build();

        String actual = new CsvFile("teamName",
                Arrays.asList(firstThought, secondThoght, thirdThought),
                Collections.singletonList(actionItem) ).getCSVString();

        String expected = FileUtils.readFileToString(new File("src/test/resources/sampleOutput.csv"), Charset.defaultCharset());

        assertThat(actual, is(equalTo(expected)));
    }

}
