package com.ford.labs.retroquest.websocket;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum WebsocketEventType {
    @JsonProperty("put")
    UPDATE,
    @JsonProperty("delete")
    DELETE
}
