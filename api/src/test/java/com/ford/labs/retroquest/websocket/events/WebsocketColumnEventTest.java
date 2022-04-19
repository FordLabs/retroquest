/*
 * Copyright (c) 2022. Ford Motor Company
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

package com.ford.labs.retroquest.websocket.events;

import com.ford.labs.retroquest.column.Column;
import org.junit.jupiter.api.Test;

import static com.ford.labs.retroquest.websocket.events.WebsocketEventType.UPDATE;
import static org.assertj.core.api.Assertions.assertThat;

class WebsocketColumnEventTest {

    @Test
    public void getRoute_returnsTeamSpecificTopic() {
        var event = new WebsocketColumnEvent("team-id", UPDATE, new Column());
        assertThat(event.getRoute()).isEqualTo("/topic/team-id/column-titles");
    }

}