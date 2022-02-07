package com.ford.labs.retroquest.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
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