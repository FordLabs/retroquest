package com.ford.labs.retroquest.websocket;

import com.ford.labs.retroquest.thought.Thought;
import org.junit.jupiter.api.Test;

import static com.ford.labs.retroquest.websocket.WebsocketEventType.UPDATE;
import static org.assertj.core.api.Assertions.assertThat;

class WebsocketThoughtEventTest {

    @Test
    public void getRoute_returnsTeamSpecificTopic() {
        var event = new WebsocketThoughtEvent("team-id", UPDATE, new Thought());
        assertThat(event.getRoute()).isEqualTo("/topic/team-id/thoughts");
    }

}