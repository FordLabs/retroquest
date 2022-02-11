package com.ford.labs.retroquest.websocket;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class WebsocketEndRetroEventTest {

    @Test
    public void getRoute_returnsTeamSpecificTopic() {
        var event = new WebsocketEndRetroEvent("team-id");
        assertThat(event.getRoute()).isEqualTo("/topic/team-id/end-retro");
    }
}