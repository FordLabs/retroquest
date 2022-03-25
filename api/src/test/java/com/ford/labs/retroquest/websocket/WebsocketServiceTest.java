/*
 * Copyright (c) 2022 Ford Motor Company
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

package com.ford.labs.retroquest.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ford.labs.retroquest.websocket.events.WebsocketEvent;
import com.ford.labs.retroquest.websocket.events.WebsocketEventType;
import org.junit.jupiter.api.Test;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

class WebsocketServiceTest {

    private final SimpMessagingTemplate mockMessageTemplate = mock(SimpMessagingTemplate.class);
    private final ObjectMapper mapper = new ObjectMapper();

    @Test
    public void publishEvent_WithWebsocketEvent_ShouldConvertAndSendToCorrectRoute() {
        var service = new WebsocketService(mockMessageTemplate, mapper);
        service.publishEvent(new FakeEvent(WebsocketEventType.DELETE, "Thing to Delete"));
        verify(mockMessageTemplate).convertAndSend(eq("send/to/route"), eq("{\"type\":\"delete\",\"payload\":\"Thing to Delete\"}"));
    }

    private static class FakeEvent extends WebsocketEvent {

        public FakeEvent(WebsocketEventType type, Object payload) {
            super(type, payload);
        }

        @Override
        public String getRoute() {
            return "send/to/route";
        }
    }
}