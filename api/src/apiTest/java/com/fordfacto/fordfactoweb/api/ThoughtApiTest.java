package com.fordfacto.fordfactoweb.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fordfacto.fordfactoweb.columntitle.ColumnTitle;
import com.fordfacto.fordfactoweb.columntitle.ColumnTitleRepository;
import com.fordfacto.fordfactoweb.security.JwtBuilder;
import com.fordfacto.fordfactoweb.thought.Thought;
import com.fordfacto.fordfactoweb.thought.ThoughtRepository;
import org.apache.catalina.connector.Response;
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
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.AbstractTransactionalJUnit4SpringContextTests;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.web.socket.WebSocketHttpHeaders;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import org.springframework.web.socket.sockjs.client.SockJsClient;
import org.springframework.web.socket.sockjs.client.WebSocketTransport;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.Arrays;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingDeque;

import static java.util.Arrays.asList;
import static java.util.concurrent.TimeUnit.SECONDS;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasSize;
import static org.junit.Assert.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
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

    BlockingQueue<String> blockingQueue;
    WebSocketStompClient stompClient;

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
                asList(new WebSocketTransport(new StandardWebSocketClient()))));
    }

    private Thought getLatestThoughtInQueue() throws IOException, InterruptedException {
        ObjectNode response = mapper.readValue(blockingQueue.poll(1, SECONDS), ObjectNode.class);
        return mapper.treeToValue(response.get("payload"), Thought.class);
    }

    private Long getLatestIdInQueue() throws IOException, InterruptedException {
        ObjectNode response = mapper.readValue(blockingQueue.poll(1, SECONDS), ObjectNode.class);
        return mapper.treeToValue(response.get("payload"), Long.class);
    }

    @Test
    public void canCreateThoughtForTeam() throws Exception {
        String thoughtJsonBody = "{ \"message\" : \"Great Thought.\", " +
                "\"topic\" : \"happy\",  \"teamId\" : \"BeachBums\"}";
        MvcResult mvcResult = mockMvc.perform(post("/api/team/BeachBums/thought")
                .contentType(MediaType.APPLICATION_JSON)
                .content(thoughtJsonBody)
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("BeachBums")))
            .andReturn();
        String httpLocation = mvcResult.getResponse().getHeader("Location");

        Thought thought = thoughtRepository.findAllByTeamId("BeachBums").get(0);

        assertThat(httpLocation, containsString("/api/team/BeachBums/thought/" + thought.getId()));
        assertEquals(201, mvcResult.getResponse().getStatus());

        assertEquals("Great Thought.", thought.getMessage());
        assertEquals(0, thought.getHearts());
        assertEquals("happy", thought.getTopic());
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

        MvcResult firstLikeHttpRequest = mockMvc.perform(put("/api/team/BeachBums/thought/" + savedThought.getId() + "/heart")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("BeachBums")))
            .andReturn();

        assertEquals(200, firstLikeHttpRequest.getResponse().getStatus());
        assertEquals("1", firstLikeHttpRequest.getResponse().getContentAsString());

        MvcResult secondLikeHttpRequest = mockMvc.perform(put("/api/team/BeachBums/thought/" + savedThought.getId() + "/heart")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("BeachBums")))
            .andReturn();

        assertEquals(200, secondLikeHttpRequest.getResponse().getStatus());
        assertEquals("2", secondLikeHttpRequest.getResponse().getContentAsString());
    }

    @Test
    public void canMarkThoughtAsDiscussed() throws Exception {
        Thought thought = new Thought();
        thought.setTeamId("BeachBums");
        Thought savedThought = thoughtRepository.save(thought);
        MvcResult discussHttpRequest = mockMvc.perform(put("/api/team/BeachBums/thought/" + savedThought.getId() + "/discuss")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("BeachBums")))
            .andReturn();

        assertEquals(Response.SC_OK, discussHttpRequest.getResponse().getStatus());


        MvcResult checkThoughtsRequest = mockMvc.perform(get("/api/team/BeachBums/thoughts")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("BeachBums")))
            .andReturn();
        Thought resultThought = mapper.readValue(checkThoughtsRequest.getResponse().getContentAsByteArray(), Thought[].class)[0];

        assertEquals(true, resultThought.isDiscussed());
    }

    @Test
    public void markingAThoughtThatHasAlreadyBeenDiscussedUnmarkTheThoughtAsDiscussed() throws Exception {
        Thought thought = new Thought();
        thought.setDiscussed(true);
        thought.setTeamId("BeachBums");
        Thought savedThought = thoughtRepository.save(thought);

        MvcResult discussHttpRequest = mockMvc.perform(put("/api/team/BeachBums/thought/" + savedThought.getId() + "/discuss")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("BeachBums")))
            .andReturn();
        assertEquals(Response.SC_OK, discussHttpRequest.getResponse().getStatus());

        MvcResult checkThoughtsRequest = mockMvc.perform(get("/api/team/BeachBums/thoughts")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("BeachBums")))
            .andReturn();
        Thought resultThought = mapper.readValue(checkThoughtsRequest.getResponse().getContentAsByteArray(), Thought[].class)[0];

        assertEquals(false, resultThought.isDiscussed());
    }

    @Test
    public void canRetrieveListOfThoughtsForTeam() throws Exception {
        Thought thought1 = new Thought();
        thought1.setTeamId("BeachBums");
        Thought thought2 = new Thought();
        thought2.setTeamId("BeachBums");
        Thought thought3 = new Thought();
        thought3.setTeamId("BeachBums");

        thoughtRepository.save(Arrays.asList(thought1, thought2, thought3));

        mockMvc.perform(get("/api/team/BeachBums/thoughts").contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("BeachBums")))
            .andExpect(jsonPath("$", hasSize(3)));
        mockMvc.perform(get("/api/team/theMildOnes/thoughts").contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("theMildOnes")))
            .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    public void callingClearThoughtsClearsThoughtsForTeam() throws Exception {
        Thought thought1 = new Thought();
        thought1.setTeamId("BeachBums");
        Thought thought2 = new Thought();
        thought2.setTeamId("BeachBums");
        Thought thought3 = new Thought();
        thought3.setTeamId("theMildOnes");
        thoughtRepository.save(Arrays.asList(thought1, thought2, thought3));

        MvcResult thoughtsDelete = mockMvc.perform(delete("/api/team/BeachBums/thoughts")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("BeachBums")))
            .andReturn();

        MvcResult beachBumsThoughtList = mockMvc.perform(get("/api/team/BeachBums/thoughts")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("BeachBums")))
            .andReturn();
        MvcResult mildThoughtList = mockMvc.perform(get("/api/team/theMildOnes/thoughts")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("theMildOnes")))
            .andReturn();

        Thought[] beachBumsThoughts = mapper.readValue(beachBumsThoughtList.getResponse().getContentAsByteArray(), Thought[].class);
        Thought[] mildThoughts = mapper.readValue(mildThoughtList.getResponse().getContentAsByteArray(), Thought[].class);

        assertEquals(Response.SC_OK, thoughtsDelete.getResponse().getStatus());
        assertEquals(0, beachBumsThoughts.length);
        assertEquals(1, mildThoughts.length);
    }

    @Test
    public void callingClearIndividualThoughtClearsTheIndividualThoughtForThatTeam() throws Exception {
        Thought thought1 = new Thought();
        thought1.setTeamId("BeachBums");
        thought1.setMessage("I hope this one is gone");

        Thought thought2 = new Thought();
        thought2.setTeamId("BeachBums");
        thought2.setMessage("Please still be there");

        Thought thought3 = new Thought();
        thought3.setTeamId("BeachBums");
        thought3.setMessage("I hope this one is gone");

        thoughtRepository.save(Arrays.asList(thought1, thought2, thought3));

        MvcResult firstDeletedThought = mockMvc.perform(delete("/api/team/BeachBums/thought/" + thought1.getId())
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("BeachBums")))
            .andReturn();
        MvcResult thirdDeletedThought = mockMvc.perform(delete("/api/team/BeachBums/thought/" + thought3.getId())
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("BeachBums")))
            .andReturn();

        assertEquals(Response.SC_OK, firstDeletedThought.getResponse().getStatus());
        assertEquals(Response.SC_OK, thirdDeletedThought.getResponse().getStatus());

        MvcResult beachBumsThoughtList = mockMvc.perform(get("/api/team/BeachBums/thoughts")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("BeachBums")))
            .andReturn();
        Thought[] beachBumsThoughts = mapper.readValue(beachBumsThoughtList.getResponse().getContentAsByteArray(), Thought[].class);
        assertEquals(1, beachBumsThoughts.length);
        assertEquals("Please still be there", beachBumsThoughts[0].getMessage());
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

        MvcResult beachBumsThoughtList = mockMvc.perform(get("/api/team/BeachBums/thoughts")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("BeachBums")))
            .andReturn();
        Thought[] beachBumsThoughts = mapper.readValue(beachBumsThoughtList.getResponse().getContentAsByteArray(), Thought[].class);
        assertEquals("modified message", beachBumsThoughts[0].getMessage());
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
                .connect(websocketUri, new WebSocketHttpHeaders() {}, headers, new StompSessionHandlerAdapter() {})
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
                .connect(websocketUri, new WebSocketHttpHeaders() {}, headers, new StompSessionHandlerAdapter() {})
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
                .connect(websocketUri, new WebSocketHttpHeaders() {}, headers, new StompSessionHandlerAdapter() {})
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
                .connect(websocketUri, new WebSocketHttpHeaders() {}, headers, new StompSessionHandlerAdapter() {})
                .get(1, SECONDS);
        session.subscribe(thoughtSubscribeEndpoint, new DefaultStompFrameHandler());
        String thoughJsonBody = "{\"message\":\"Message\"}";
        session.send(thoughtEndpoint + "/create", thoughJsonBody.getBytes());

        Thought thought = getLatestThoughtInQueue();

        session.send(thoughtEndpoint + "/delete", null);

        final Long returnVal = getLatestIdInQueue();

        Assertions.assertThat(returnVal).isNotNull();
        Assertions.assertThat(returnVal).isEqualTo(-1L);
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
