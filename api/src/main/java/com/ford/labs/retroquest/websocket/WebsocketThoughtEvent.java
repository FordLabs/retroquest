package com.ford.labs.retroquest.websocket;

import com.ford.labs.retroquest.thought.Thought;


public class WebsocketThoughtEvent extends WebsocketEvent {

    private static final String ROUTE_STRING = "/topic/%s/thoughts";
    private final String teamId;

    public WebsocketThoughtEvent(String teamId, WebsocketEventType type, Thought payload) {
        super(type, payload);
        this.teamId = teamId;
    }

    @Override
    public String getRoute() {
        return String.format(ROUTE_STRING, teamId);
    }
}
