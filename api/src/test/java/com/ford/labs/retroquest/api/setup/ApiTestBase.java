/*
 * Copyright (c) 2021 Ford Motor Company
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.ford.labs.retroquest.api.setup;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.ford.labs.retroquest.contributors.ContributorController;
import com.ford.labs.retroquest.security.JwtBuilder;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.impl.TextCodec;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.messaging.simp.stomp.StompFrameHandler;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.socket.WebSocketHttpHeaders;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import org.springframework.web.socket.sockjs.client.SockJsClient;
import org.springframework.web.socket.sockjs.client.WebSocketTransport;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.Collections;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.TimeoutException;

import static java.util.concurrent.TimeUnit.SECONDS;

@AutoConfigureMockMvc
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Disabled
@Tag("api")
public abstract class ApiTestBase {

    @Autowired
    public ObjectMapper objectMapper;

    @Autowired
    public MockMvc mockMvc;

    @Autowired
    public JwtBuilder jwtBuilder;

    @MockBean
    public ContributorController contributorController;

    @Value("${local.server.port}")
    private int port;

    @Value("${jwt.signing.secret}")
    private String jwtSigningSecret;

    private String bearerAuthToken;

    public String teamId;

    public String websocketUrl;

    private WebSocketStompClient stompClient;
    private BlockingQueue<String> blockingQueue;

    @BeforeEach
    public void __setup() {
        teamId = "BeachBums";
        websocketUrl = "ws://localhost:" + port + "/websocket";
        bearerAuthToken = "Bearer " + jwtBuilder.buildJwt(teamId);

        blockingQueue = new LinkedBlockingDeque<>();

        stompClient = new WebSocketStompClient(new SockJsClient(
                Collections.singletonList(new WebSocketTransport(new StandardWebSocketClient()))));
    }

    @AfterEach
    public void __cleanup() {
        blockingQueue.clear();
    }

    public String getBearerAuthToken() {
        return bearerAuthToken;
    }

    public Claims decodeJWT(String jwt) {
        //This line will throw an exception if it is not a signed JWS (as expected)
        return Jwts.parser()
                .setSigningKey(TextCodec.BASE64.encode(jwtSigningSecret))
                .parseClaimsJws(jwt)
                .getBody();
    }

    public StompSession getAuthorizedSession() throws InterruptedException, ExecutionException, TimeoutException {

        StompHeaders headers = new StompHeaders();
        headers.add("Authorization", bearerAuthToken);

        return stompClient
                .connect(websocketUrl, new WebSocketHttpHeaders() {
                }, headers, new StompSessionHandlerAdapter() {
                })
                .get(1, SECONDS);
    }

    public StompSession getUnauthorizedSession() throws InterruptedException, ExecutionException, TimeoutException {

        StompHeaders headers = new StompHeaders();
        headers.add("Authorization", "Bearer " + jwtBuilder.buildJwt("unauth-team"));

        return stompClient
                .connect(websocketUrl, new WebSocketHttpHeaders() {
                }, headers, new StompSessionHandlerAdapter() {
                })
                .get(1, SECONDS);
    }

    private class DefaultStompFrameHandler implements StompFrameHandler {
        @Override
        public Type getPayloadType(StompHeaders stompHeaders) {
            return byte[].class;
        }

        @Override
        public void handleFrame(StompHeaders stompHeaders, Object object) {
            blockingQueue.offer(new String((byte[]) object));
        }
    }

    public <T> T takeObjectInSocket(Class<T> clazz) throws InterruptedException, IOException {
        String obj = blockingQueue.poll(10, SECONDS);
        try {
            return objectMapper.treeToValue(objectMapper.readValue(obj, ObjectNode.class).get("payload"), clazz);
        } catch (NullPointerException | IllegalArgumentException exp) {
            return null;
        }
    }

    public void subscribe(StompSession session, String url) {
        session.subscribe(url, new DefaultStompFrameHandler());
    }

}
