package com.ford.labs.retroquest.websocket;

import com.ford.labs.retroquest.columntitle.ColumnTitle;
import org.junit.jupiter.api.Test;

import static com.ford.labs.retroquest.websocket.WebsocketEventType.UPDATE;
import static org.assertj.core.api.Assertions.assertThat;

class WebsocketColumnTitleEventTest {

    @Test
    public void getRoute_returnsTeamSpecificTopic() {
        var event = new WebsocketColumnTitleEvent("team-id", UPDATE, new ColumnTitle());
        assertThat(event.getRoute()).isEqualTo("/topic/team-id/column-titles");
    }

}