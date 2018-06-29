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

package com.fordfacto.fordfactoweb.thought;

import org.junit.Test;

import java.util.List;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

public class ThoughtTest {

    @Test
    public void shouldToggleThoughtCompletedState() {
        Thought thought = new Thought();
        thought.setDiscussed(false);
        thought.toggleDiscussed();
        assertTrue(thought.isDiscussed());
    }

    @Test
    public void shouldBuildThoughtCSVField() {
        Thought thought = new Thought();
        thought.setTopic("topic");
        thought.setMessage("message");
        thought.setHearts(9);
        List<String> actual = thought.getCSVFields();
        assertThat(actual, contains("topic", "message", "9", "no"));
    }

    @Test
    public void shouldSanitizeMessage() {
        Thought thought = Thought.builder().message("<div>Sanitized</div>").build();
        assertThat(thought.getMessage(), is(equalTo("Sanitized")));
    }

    @Test
    public void shouldIncrementHearts() {
        Thought thought = new Thought();
        thought.incrementHearts();
        assertThat(thought.getHearts(), is(equalTo(1)));
    }
}