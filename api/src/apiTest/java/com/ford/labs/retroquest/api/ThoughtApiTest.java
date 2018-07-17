package com.ford.labs.retroquest.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.ford.labs.retroquest.columntitle.ColumnTitle;
import com.ford.labs.retroquest.columntitle.ColumnTitleRepository;
import com.ford.labs.retroquest.security.JwtBuilder;
import com.ford.labs.retroquest.thought.Thought;
import com.ford.labs.retroquest.thought.ThoughtRepository;
import org.assertj.core.api.Assertions;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.messaging.simp.stomp.StompFrameHandler;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;
import org.springframework.test.context.junit4.AbstractTransactionalJUnit4SpringContextTests;
import org.springframework.test.context.junit4.SpringRunner;
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
import java.util.concurrent.LinkedBlockingDeque;

import static java.util.concurrent.TimeUnit.SECONDS;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
public class ThoughtApiTest extends AbstractTransactionalJUnit4SpringContextTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtBuilder jwtBuilder;

    @Autowired
    private ThoughtRepository thoughtRepository;

    @Autowired
    private ColumnTitleRepository columnTitleRepository;

    @Value("${local.server.port}")
    private int port;

    private ObjectMapper mapper = new ObjectMapper();
    private BlockingQueue<String> blockingQueue;
    private WebSocketStompClient stompClient;
    private String websocketUri;
    private String thoughtSubscribeEndpoint;
    private String thoughtEndpoint;

    @Before
    public void setup() {
        websocketUri = "ws://localhost:" + port + "/websocket";
        thoughtSubscribeEndpoint = "/topic/beach-bums/thoughts";
        thoughtEndpoint = "/app/beach-bums/thought";
        blockingQueue = new LinkedBlockingDeque<>();
        stompClient = new WebSocketStompClient(new SockJsClient(
                Collections.singletonList(new WebSocketTransport(new StandardWebSocketClient()))));
    }

    @Test
    public void canSaveAndRetrieveThoughtsForTeam() throws Exception {
        String thoughtJsonBody = "{ \"message\" : \"Great Thought\", " +
                "\"topic\" : \"happy\",  \"teamId\" : \"BeachBums\"}";
        mockMvc.perform(post("/api/team/BeachBums/thought")
                .contentType(MediaType.APPLICATION_JSON)
                .content(thoughtJsonBody)
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("BeachBums")));

        mockMvc.perform(get("/api/team/BeachBums/thoughts").contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("BeachBums")))
                .andExpect(jsonPath("$[0].message", is("Great Thought")))
                .andExpect(jsonPath("$[0].topic", is("happy")))
                .andExpect(jsonPath("$[0].teamId", is("BeachBums")));
    }

    @Test
    public void canSetUpThoughtAndColumnTitleAssociation() throws Exception {
        ColumnTitle columnTitle = new ColumnTitle();
        columnTitle.setTeamId("BeachBums");
        columnTitle.setTopic("happy");

        columnTitleRepository.save(columnTitle);

        String thoughtJsonBody = "{ \"message\" : \"Great Thought.\", " +
                "\"topic\" : \"happy\",  \"teamId\" : \"BeachBums\"}";
        mockMvc.perform(post("/api/team/BeachBums/thought")
                .contentType(MediaType.APPLICATION_JSON)
                .content(thoughtJsonBody)
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("BeachBums")))
                .andReturn();

        Thought thought = thoughtRepository.findAllByTeamId("BeachBums").get(0);

        assertNotNull(thought.getColumnTitle());
    }

    @Test
    public void canIncreaseLikesOnAThought() throws Exception {
        Thought newThought = new Thought();
        newThought.setTeamId("BeachBums");
        Thought savedThought = thoughtRepository.save(newThought);

        mockMvc.perform(put("/api/team/BeachBums/thought/" + savedThought.getId() + "/heart")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("BeachBums")));

        mockMvc.perform(get("/api/team/BeachBums/thoughts")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("BeachBums")))
                .andExpect(jsonPath("$[0].hearts", is(1)));
    }

    @Test
    public void canMarkThoughtAsDiscussed() throws Exception {
        Thought thought = new Thought();
        thought.setTeamId("BeachBums");
        Thought savedThought = thoughtRepository.save(thought);

        mockMvc.perform(put("/api/team/BeachBums/thought/" + savedThought.getId() + "/discuss")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("BeachBums")))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/team/BeachBums/thoughts")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("BeachBums")))
                .andExpect(jsonPath("$[0].discussed", is(true)));
    }

    @Test
    public void canUnmarkThoughtAsDiscussed() throws Exception {
        Thought thought = new Thought();
        thought.setDiscussed(true);
        thought.setTeamId("BeachBums");
        Thought savedThought = thoughtRepository.save(thought);

        mockMvc.perform(put("/api/team/BeachBums/thought/" + savedThought.getId() + "/discuss")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("BeachBums")));

        mockMvc.perform(get("/api/team/BeachBums/thoughts")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("BeachBums")))
                .andExpect(jsonPath("$[0].discussed", is(false)));
    }

    @Test
    public void canClearThoughtsForTeam() throws Exception {
        Thought thought1 = new Thought();
        thought1.setTeamId("BeachBums");

        thoughtRepository.save(Collections.singletonList(thought1));

        mockMvc.perform(delete("/api/team/BeachBums/thoughts")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("BeachBums")))
                .andReturn();
        mockMvc.perform(get("/api/team/BeachBums/thoughts")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("BeachBums")))
                .andExpect(content().string("[]"));
    }

    @Test
    public void canClearIndividualThoughts() throws Exception {
        Thought thought1 = new Thought();
        thought1.setTeamId("TestTeam");
        thought1.setMessage("Test Content");

        thoughtRepository.save(Collections.singletonList(thought1));

        mockMvc.perform(delete("/api/team/TestTeam/thought/" + thought1.getId())
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("TestTeam")))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/team/TestTeam/thoughts")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("TestTeam")))
                .andExpect(content().string("[]"));
    }

    @Test
    public void submittingModifiedThoughtUpdatesMessage() throws Exception {
        Thought thought = new Thought();
        thought.setTeamId("BeachBums");
        thought.setMessage("Not modified message");

        Thought createdThought = thoughtRepository.save(thought);
        String thoughtJsonBody = "{ \"message\" : \"modified message\" }";

        mockMvc.perform(put("/api/team/BeachBums/thought/" + createdThought.getId() + "/message")
                .contentType(MediaType.APPLICATION_JSON)
                .content(thoughtJsonBody)
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("BeachBums")))
                .andExpect((status().isOk()));

        mockMvc.perform(get("/api/team/BeachBums/thoughts")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("BeachBums")))
                .andExpect(jsonPath("$[0].message", is("modified message")));
    }

    @Test
    public void cannotAccessTeamOtherThanOneLoggedInTo() throws Exception {
        String jwt = jwtBuilder.buildJwt("notBeachBums");

        Thought thought1 = new Thought();
        thought1.setTeamId("BeachBums");
        Thought thought2 = new Thought();
        thought2.setTeamId("BeachBums");

        thoughtRepository.save(thought1);
        thoughtRepository.save(thought2);

        mockMvc.perform(get("/api/team/BeachBums/thoughts")
                .header("Authorization", "Bearer " + jwt))
                .andExpect(status().isForbidden());

        mockMvc.perform(post("/api/team/BeachBums/thought")
                .header("Authorization", "Bearer " + jwt)
                .content("{}")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

        mockMvc.perform(put("/api/team/BeachBums/thought/1/heart")
                .header("Authorization", "Bearer " + jwt)
                .content("{}")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

        mockMvc.perform(put("/api/team/BeachBums/thought/1/discuss")
                .header("Authorization", "Bearer " + jwt)
                .content("{}")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

        mockMvc.perform(put("/api/team/BeachBums/thought/1/message")
                .header("Authorization", "Bearer " + jwt)
                .content("{}")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

        mockMvc.perform(delete("/api/team/BeachBums/thought/1")
                .header("Authorization", "Bearer " + jwt))
                .andExpect(status().isForbidden());

        mockMvc.perform(delete("/api/team/BeachBums/thoughts")
                .header("Authorization", "Bearer " + jwt))
                .andExpect(status().isForbidden());
    }

    @Test
    public void canCreateThoughtWithWebsockets() throws Exception {
        String jwt = jwtBuilder.buildJwt("beach-bums");
        StompHeaders headers = new StompHeaders();
        headers.add("Authorization", "Bearer " + jwt);

        StompSession session = stompClient
                .connect(websocketUri, new WebSocketHttpHeaders() {
                }, headers, new StompSessionHandlerAdapter() {
                })
                .get(1, SECONDS);
        session.subscribe(thoughtSubscribeEndpoint, new DefaultStompFrameHandler());
        String thoughJsonBody = "{\"message\":\"Message\"}";
        session.send(thoughtEndpoint + "/create", thoughJsonBody.getBytes());

        Thought thought = getLatestThoughtInQueue();
        assertEquals("Message", thought.getMessage());
    }

    @Test
    public void canEditThoughtWithWebsockets() throws Exception {
        String jwt = jwtBuilder.buildJwt("beach-bums");
        StompHeaders headers = new StompHeaders();
        headers.add("Authorization", "Bearer " + jwt);

        StompSession session = stompClient
                .connect(websocketUri, new WebSocketHttpHeaders() {
                }, headers, new StompSessionHandlerAdapter() {
                })
                .get(1, SECONDS);
        session.subscribe(thoughtSubscribeEndpoint, new DefaultStompFrameHandler());
        String thoughJsonBody = "{\"message\":\"Message\"}";
        session.send(thoughtEndpoint + "/create", thoughJsonBody.getBytes());
        Thought thought = getLatestThoughtInQueue();

        String editThoughtJsonBody = "{\"message\":\"Edited message\"}";
        session.send(thoughtEndpoint + "/" + thought.getId() + "/edit", editThoughtJsonBody.getBytes());
        Thought editedThought = getLatestThoughtInQueue();
        assertEquals("Edited message", editedThought.getMessage());
    }

    @Test
    public void canDeleteThoughtWithWebsockets() throws Exception {
        String jwt = jwtBuilder.buildJwt("beach-bums");
        StompHeaders headers = new StompHeaders();
        headers.add("Authorization", "Bearer " + jwt);

        StompSession session = stompClient
                .connect(websocketUri, new WebSocketHttpHeaders() {
                }, headers, new StompSessionHandlerAdapter() {
                })
                .get(1, SECONDS);
        session.subscribe(thoughtSubscribeEndpoint, new DefaultStompFrameHandler());
        String thoughJsonBody = "{\"message\":\"Message\"}";
        session.send(thoughtEndpoint + "/create", thoughJsonBody.getBytes());
        Thought thought = getLatestThoughtInQueue();

        session.send(thoughtEndpoint + "/" + thought.getId() + "/delete", null);

        Long returnVal = getLatestIdInQueue();

        Assertions.assertThat(returnVal).isNotNull();
        Assertions.assertThat(returnVal).isEqualTo(thought.getId());
    }

    @Test
    public void canDeleteAllThoughtsWithWebsockets() throws Exception {
        String jwt = jwtBuilder.buildJwt("beach-bums");
        StompHeaders headers = new StompHeaders();
        headers.add("Authorization", "Bearer " + jwt);

        StompSession session = stompClient
                .connect(websocketUri, new WebSocketHttpHeaders() {
                }, headers, new StompSessionHandlerAdapter() {
                })
                .get(1, SECONDS);
        session.subscribe(thoughtSubscribeEndpoint, new DefaultStompFrameHandler());
        String thoughJsonBody = "{\"message\":\"Message\"}";
        session.send(thoughtEndpoint + "/create", thoughJsonBody.getBytes());
        getLatestThoughtInQueue();
        session.send(thoughtEndpoint + "/delete", null);

        final Long returnVal = getLatestIdInQueue();

        Assertions.assertThat(returnVal).isNotNull();
        Assertions.assertThat(returnVal).isEqualTo(-1L);
    }

    private Thought getLatestThoughtInQueue() throws IOException, InterruptedException {
        ObjectNode response = mapper.readValue(blockingQueue.poll(1, SECONDS), ObjectNode.class);
        return mapper.treeToValue(response.get("payload"), Thought.class);
    }

    private Long getLatestIdInQueue() throws IOException, InterruptedException {
        ObjectNode response = mapper.readValue(blockingQueue.poll(1, SECONDS), ObjectNode.class);
        return mapper.treeToValue(response.get("payload"), Long.class);
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
