package com.ford.labs.retroquest.websocket;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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