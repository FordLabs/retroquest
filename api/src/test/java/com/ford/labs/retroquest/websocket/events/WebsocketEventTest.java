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

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ford.labs.retroquest.websocket.events.WebsocketEvent;
import com.ford.labs.retroquest.websocket.events.WebsocketEventType;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class WebsocketEventTest {

    @Test
    public void websocketEvent_mappingOnlyReturnsEventTypeAndPayload() throws JsonProcessingException {
        var event = new WebsocketTestEvent("something that shouldn't show up", WebsocketEventType.UPDATE, "A value");
        assertThat(new ObjectMapper().writeValueAsString(event)).isEqualTo("{\"type\":\"put\",\"payload\":\"A value\"}");
    }

    private static class WebsocketTestEvent extends WebsocketEvent {

        private final String nonsense;

        public WebsocketTestEvent(String nonsense, WebsocketEventType type, Object payload) {
            super(type, payload);
            this.nonsense = nonsense;
        }

        public String getNonsense() {
            return nonsense;
        }

        @Override
        public String getRoute() {
            return "something that shouldn't show up";
        }
    }

}