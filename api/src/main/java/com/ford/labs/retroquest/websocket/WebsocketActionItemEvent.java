package com.ford.labs.retroquest.websocket;

import com.ford.labs.retroquest.actionitem.ActionItem;

public class WebsocketActionItemEvent extends WebsocketEvent{

    private static final String ROUTE_STRING = "/topic/%s/action-items";
    private final String teamId;

    public WebsocketActionItemEvent(String teamId, WebsocketEventType type, ActionItem payload) {
        super(type, payload);
        this.teamId = teamId;
    }

    @Override
    public String getRoute() {
        return String.format(ROUTE_STRING, teamId);
    }
}
