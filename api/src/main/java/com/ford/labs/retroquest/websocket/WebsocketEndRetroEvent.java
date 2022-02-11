package com.ford.labs.retroquest.websocket;

import static com.ford.labs.retroquest.websocket.WebsocketEventType.UPDATE;

public class WebsocketEndRetroEvent extends WebsocketEvent {
    private static final String ROUTE_STRING = "/topic/%s/end-retro";
    private final String teamId;

    public WebsocketEndRetroEvent(String teamId) {
        super(UPDATE, null);
        this.teamId = teamId;
    }

    @Override
    public String getRoute() {
        return String.format(ROUTE_STRING, teamId);
    }
}
