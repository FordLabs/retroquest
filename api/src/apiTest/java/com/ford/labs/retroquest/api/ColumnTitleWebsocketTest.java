package com.ford.labs.retroquest.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ford.labs.retroquest.columntitle.ColumnTitle;
import com.ford.labs.retroquest.columntitle.ColumnTitleRepository;
import com.ford.labs.retroquest.security.JwtBuilder;
import org.assertj.core.api.Assertions;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.messaging.simp.stomp.StompFrameHandler;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.socket.WebSocketHttpHeaders;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import org.springframework.web.socket.sockjs.client.SockJsClient;
import org.springframework.web.socket.sockjs.client.WebSocketTransport;

import java.lang.reflect.Type;
import java.util.Collections;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingDeque;

import static java.util.concurrent.TimeUnit.SECONDS;
import static org.mockito.AdditionalAnswers.returnsFirstArg;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles({"test", "h2"})
public class ColumnTitleWebsocketTest {

    @Autowired
    private JwtBuilder jwtBuilder;

    @MockBean
    private ColumnTitleRepository columnTitleRepository;

    @Value("${local.server.port}")
    private int port;

    private ObjectMapper mapper = new ObjectMapper();


    BlockingQueue<String> blockingQueue;
    WebSocketStompClient stompClient;

    private String websocketUri;
    private String columnTitleSubscribeEndpoint;
    private String columnTitleEndpoint;

    @Before
    public void setup() {
        websocketUri = "ws://localhost:" + port + "/websocket";
        columnTitleSubscribeEndpoint = "/topic/beach-bums/column-titles";
        columnTitleEndpoint = "/app/beach-bums/column-title";
        blockingQueue = new LinkedBlockingDeque<>();
        stompClient = new WebSocketStompClient(new SockJsClient(
                Collections.singletonList(new WebSocketTransport(new StandardWebSocketClient()))));
    }

    @Test
    public void canEditColumnTitleWithWebSockets() throws Exception {

        ColumnTitle createdColumnTitle = new ColumnTitle();
        createdColumnTitle.setId(1L);
        createdColumnTitle.setTitle("Old Title");
        createdColumnTitle.setTeamId("beach-bums");

        when(columnTitleRepository.findOne(any(Long.class))).thenReturn(createdColumnTitle);
        when(columnTitleRepository.save(any(ColumnTitle.class))).then(returnsFirstArg());

        String jwt = jwtBuilder.buildJwt("beach-bums");
        StompHeaders stompHeaders = new StompHeaders();
        stompHeaders.add("Authorization", "Bearer " + jwt);

        StompSession session = stompClient
                .connect(websocketUri, new WebSocketHttpHeaders() {}, stompHeaders, new StompSessionHandlerAdapter() {})
                .get(1, SECONDS);
        session.subscribe(columnTitleSubscribeEndpoint, new DefaultStompFrameHandler());

        String columnTitleJsonBody = "{\"title\":\"newtitle\"}";
        session.send(columnTitleEndpoint + "/" + createdColumnTitle.getId() + "/edit", columnTitleJsonBody.getBytes());

        String response = blockingQueue.poll(1, SECONDS);
        System.out.println(response);

        Assertions.assertThat(response).isEqualTo("{\"type\":\"put\",\"payload\":{\"id\":1,\"topic\":null,\"title\":\"newtitle\",\"teamId\":\"beach-bums\"}}");
    }

    class DefaultStompFrameHandler implements StompFrameHandler {
        @Override
        public Type getPayloadType(StompHeaders stompHeaders) {
            return byte[].class;
        }

        @Override
        public void handleFrame(StompHeaders stompHeaders, Object o) {
            blockingQueue.offer(new String((byte[]) o));
        }
    }
}
