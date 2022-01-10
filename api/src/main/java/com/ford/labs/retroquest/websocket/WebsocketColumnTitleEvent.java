package com.ford.labs.retroquest.websocket;

import com.ford.labs.retroquest.columntitle.ColumnTitle;

public class WebsocketColumnTitleEvent extends WebsocketEvent{

    private static final String ROUTE_STRING = "/topic/%s/column-titles";
    private final String teamId;

    public WebsocketColumnTitleEvent(String teamId, WebsocketEventType type, ColumnTitle payload) {
        super(type, payload);
        this.teamId = teamId;
    }

    @Override
    public String getRoute() {
        return String.format(ROUTE_STRING, teamId);
    }
}
