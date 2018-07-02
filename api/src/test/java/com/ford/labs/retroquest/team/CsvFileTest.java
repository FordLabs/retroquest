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

package com.ford.labs.retroquest.team;

import com.ford.labs.retroquest.actionitem.ActionItem;
import com.ford.labs.retroquest.thought.Thought;
import org.apache.commons.io.FileUtils;
import org.junit.Test;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.core.Is.is;

public class CsvFileTest {

    @Test
    public void shouldConvertThoughtsAndActionItemsToACSV() throws IOException {

        Thought firstThought = Thought.builder().topic("confused")
                .message("stuff \"goes here\"").hearts(5).discussed(false).build();
        Thought secondThoght = Thought.builder().topic("happy")
                .message("a thought, with a comma").hearts(2).discussed(true).build();
        Thought thirdThought = Thought.builder().topic("unhappy").message("sad").hearts(0).discussed(false).build();

        ActionItem actionItem = ActionItem.builder().task("tasks and \"stuff, yo\"").completed(false).build();
        String actual = new CsvFile("teamName", Arrays.asList(firstThought, secondThoght, thirdThought),
                Collections.singletonList(actionItem) ).getCSVString();

        String expected = FileUtils.readFileToString(new File("src/test/resources/sampleOutput.csv"));

        assertThat(actual, is(equalTo(expected)));
    }

}