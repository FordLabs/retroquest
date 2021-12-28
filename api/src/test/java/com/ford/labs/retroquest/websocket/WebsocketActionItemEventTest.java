package com.ford.labs.retroquest.websocket;

import com.ford.labs.retroquest.actionitem.ActionItem;
import org.junit.jupiter.api.Test;

import static com.ford.labs.retroquest.websocket.WebsocketEventType.UPDATE;
import static org.assertj.core.api.Assertions.assertThat;

class WebsocketActionItemEventTest {

    @Test
    public void getRoute_returnsTeamSpecificTopic() {
        var event = new WebsocketActionItemEvent("team-id", UPDATE, new ActionItem());
        assertThat(event.getRoute()).isEqualTo("/topic/team-id/action-items");
    }
}