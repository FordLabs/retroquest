package com.ford.labs.retroquest.websocket;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;


@Service
public class WebsocketService {

    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper mapper;

    public WebsocketService(SimpMessagingTemplate messagingTemplate, ObjectMapper objectMapper) {
        this.messagingTemplate = messagingTemplate;
        this.mapper = objectMapper;
    }

    public void publishEvent(WebsocketEvent event) {
        try {
            messagingTemplate.convertAndSend(event.getRoute(), mapper.writeValueAsString(event));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }
}
