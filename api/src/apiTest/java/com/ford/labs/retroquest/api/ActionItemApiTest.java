package com.ford.labs.retroquest.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.ford.labs.retroquest.actionitem.ActionItem;
import com.ford.labs.retroquest.actionitem.ActionItemRepository;
import com.ford.labs.retroquest.security.JwtBuilder;
import org.apache.catalina.connector.Response;
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
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.web.socket.WebSocketHttpHeaders;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import org.springframework.web.socket.sockjs.client.SockJsClient;
import org.springframework.web.socket.sockjs.client.WebSocketTransport;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingDeque;

import static java.util.Arrays.asList;
import static java.util.concurrent.TimeUnit.SECONDS;
import static org.junit.Assert.*;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
public class ActionItemApiTest extends AbstractTransactionalJUnit4SpringContextTests{

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtBuilder jwtBuilder;

    @Autowired
    private ActionItemRepository actionItemRepository;

    @Value("${local.server.port}")
    private int port;

    private ObjectMapper mapper = new ObjectMapper();

    BlockingQueue<String> blockingQueue;
    WebSocketStompClient stompClient;

    private String websocketUri;
    private String actionItemSubscribeEndpoint;
    private String actionItemEndpoint;

    private ActionItem getLatestActionItemInQueue() throws IOException, InterruptedException {
        ObjectNode response = mapper.readValue(blockingQueue.poll(1, SECONDS), ObjectNode.class);
        return mapper.treeToValue(response.get("payload"), ActionItem.class);
    }

    @Before
    public void setup() {
        websocketUri = "ws://localhost:" + port + "/websocket";
        actionItemSubscribeEndpoint = "/topic/beach-bums/action-items";
        actionItemEndpoint = "/app/beach-bums/action-item";
        blockingQueue = new LinkedBlockingDeque<>();
        stompClient = new WebSocketStompClient(new SockJsClient(
                asList(new WebSocketTransport(new StandardWebSocketClient()))));
    }

    @Test
    public void canCreateAnActionItemUsingWebsockets() throws Exception {

        String jwt = jwtBuilder.buildJwt("beach-bums");
        String actionItemJsonBody = "{\"task\" : \"Do the thing\"}";

        StompHeaders headers = new StompHeaders();
        headers.add("Authorization", "Bearer " + jwt);

        StompSession session = stompClient
                .connect(websocketUri, new WebSocketHttpHeaders() {}, headers, new StompSessionHandlerAdapter() {})
                .get(1, SECONDS);
        session.subscribe(actionItemSubscribeEndpoint, new DefaultStompFrameHandler());

        session.send(actionItemEndpoint + "/create", actionItemJsonBody.getBytes());

        ActionItem actionItem = getLatestActionItemInQueue();

        assertEquals("Do the thing", actionItem.getTask());
    }

    @Test
    public void cannotCreateAnActionItemUsingWebsocketsForAnotherTeam() throws Exception {
        String jwt = jwtBuilder.buildJwt("beach-bum");
        String actionItemJsonBody = "{\"task\" : \"Do the thing\"}";

        StompHeaders headers = new StompHeaders();
        headers.add("Authorization", "Bearer " + jwt);

        StompSession session = stompClient
                .connect(websocketUri, new WebSocketHttpHeaders() {}, headers, new StompSessionHandlerAdapter() {})
                .get(1, SECONDS);
        session.subscribe(actionItemSubscribeEndpoint, new DefaultStompFrameHandler());

        session.send(actionItemEndpoint + "/create", actionItemJsonBody.getBytes());

        assertEquals(null, blockingQueue.poll(1, SECONDS));
    }

    @Test
    public void canEditAnActionItemUsingWebsockets() throws Exception {
        String jwt = jwtBuilder.buildJwt("beach-bums");
        String actionItemJsonBody = "{\"task\" : \"Do the thing\"}";

        StompHeaders headers = new StompHeaders();
        headers.add("Authorization", "Bearer " + jwt);

        StompSession session = stompClient
                .connect(websocketUri, new WebSocketHttpHeaders() {}, headers, new StompSessionHandlerAdapter() {})
                .get(1, SECONDS);
        session.subscribe(actionItemSubscribeEndpoint, new DefaultStompFrameHandler());
        session.send(actionItemEndpoint + "/create", actionItemJsonBody.getBytes());

        ActionItem actionItem = getLatestActionItemInQueue();

        String editActionItemJsonBody = "{\"task\" : \"Edit the thing\"}";
        session.send(actionItemEndpoint + "/" + actionItem.getId() + "/edit", editActionItemJsonBody.getBytes());

        assertEquals("Edit the thing", getLatestActionItemInQueue().getTask());
    }

    @Test
    public void canDeleteAnActionItemUsingWebsockets() throws Exception {
        String jwt = jwtBuilder.buildJwt("beach-bums");
        String actionItemJsonBody = "{\"task\" : \"Do the thing\"}";

        StompHeaders headers = new StompHeaders();
        headers.add("Authorization", "Bearer " + jwt);

        StompSession session = stompClient
                .connect(websocketUri, new WebSocketHttpHeaders() {}, headers, new StompSessionHandlerAdapter() {})
                .get(1, SECONDS);
        session.subscribe(actionItemSubscribeEndpoint, new DefaultStompFrameHandler());
        session.send(actionItemEndpoint + "/create", actionItemJsonBody.getBytes());

        ActionItem actionItem = getLatestActionItemInQueue();

        session.send(actionItemEndpoint + "/" + actionItem.getId() + "/delete", null);

        String returnVal = blockingQueue.poll(1, SECONDS);
        assertFalse(returnVal.contains("not"));
    }

    @Test
    public void canRetrieveListOfActionItemsForATeam() throws Exception {
        String jwt = jwtBuilder.buildJwt("beach-bums2");

        ActionItem actionItem1 = new ActionItem();
        actionItem1.setTask("Some Action");
        actionItem1.setTeamId("beach-bums2");
        ActionItem actionItem2 = new ActionItem();
        actionItem2.setTask("Another Action");
        actionItem2.setTeamId("beach-bums2");

        actionItemRepository.save(asList(actionItem1, actionItem2));

        mockMvc.perform(get("/api/team/beach-bums2/action-items")
                .header("Authorization", "Bearer " + jwt))
            .andExpect(jsonPath("$.[0].task").value("Some Action"))
            .andExpect(jsonPath("$.[0].teamId").value("beach-bums2"))
            .andExpect(jsonPath("$.[1].task").value("Another Action"))
            .andExpect(jsonPath("$.[1].teamId").value("beach-bums2"));

    }

    @Test
    public void canCreateAnActionItem() throws Exception {
        String actionItemJsonBody = "{\"task\" : \"Do the thing\",\"teamId\":\"themildones\"}";

        MvcResult response = mockMvc.perform(post("/api/team/themildones/action-item")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("themildones"))
                .contentType(APPLICATION_JSON)
                .content(actionItemJsonBody))
                .andReturn();

        ActionItem actionItem = actionItemRepository.findAllByTeamId("themildones").get(0);

        String uri = response.getResponse().getHeader("Location");
        assertTrue(uri.contains("/api/team/themildones/action-item/" + actionItem.getId()));
        assertEquals(201, response.getResponse().getStatus());
        assertEquals("Do the thing", actionItem.getTask());
    }

    @Test
    public void canMarkActionItemAsCompleted() throws Exception {
        ActionItem actionItem = new ActionItem();
        actionItem.setTeamId("beachcrazy");
        actionItemRepository.save(actionItem);

        MvcResult updateActionItemResult = mockMvc.perform(put("/api/team/beachcrazy/action-item/" + actionItem.getId() + "/complete")
            .header("Authorization", "Bearer " + jwtBuilder.buildJwt("beachcrazy")))
            .andReturn();

        assertEquals(Response.SC_OK, updateActionItemResult.getResponse().getStatus());

        MvcResult checkThoughtsRequest = mockMvc.perform(get("/api/team/beachcrazy/action-items")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("beachcrazy")))
                .andReturn();
        ActionItem resultActionItem = mapper.readValue(checkThoughtsRequest.getResponse().getContentAsByteArray(), ActionItem[].class)[0];

        assertTrue(resultActionItem.isCompleted());
    }

    @Test
    public void canMarkCompletedActionItemsAsIncomplete() throws Exception {
        ActionItem actionItem = new ActionItem();
        actionItem.setTeamId("BeachCrazier");
        actionItem.setCompleted(true);
        actionItemRepository.save(actionItem);

        MvcResult updateActionItemResult = mockMvc.perform(put("/api/team/BeachCrazier/action-item/" + actionItem.getId() + "/complete")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("BeachCrazier")))
                .andReturn();

        assertEquals(Response.SC_OK, updateActionItemResult.getResponse().getStatus());

        MvcResult checkThoughtsRequest = mockMvc.perform(get("/api/team/BeachCrazier/action-items")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("BeachCrazier")))
                .andReturn();
        ActionItem resultActionItem = mapper.readValue(checkThoughtsRequest.getResponse().getContentAsByteArray(), ActionItem[].class)[0];

        assertFalse(resultActionItem.isCompleted());
    }

    @Test
    public void canDeleteAnActionItemForAGivenTeam() throws Exception {
        ActionItem actionItem1 = new ActionItem();
        actionItem1.setTeamId("beachcrazy");

        ActionItem actionItem2 = new ActionItem();
        actionItem2.setTeamId("beachcrazy");
        actionItem2.setTask("Please don't be deleted");

        ActionItem actionItem3 = new ActionItem();
        actionItem3.setTeamId("beachcrazy");

        actionItemRepository.save(asList(actionItem1, actionItem2, actionItem3));

        MvcResult firstDeletedActionItem = mockMvc.perform(delete("/api/team/beachcrazy/action-item/" + actionItem1.getId())
                    .header("Authorization", "Bearer " + jwtBuilder.buildJwt("beachcrazy")))
                .andReturn();
        MvcResult thirdDeletedActionItem = mockMvc.perform(delete("/api/team/beachcrazy/action-item/" + actionItem3.getId())
                    .header("Authorization", "Bearer " + jwtBuilder.buildJwt("beachcrazy")))
                .andReturn();

        assertEquals(Response.SC_OK, firstDeletedActionItem.getResponse().getStatus());
        assertEquals(Response.SC_OK, thirdDeletedActionItem.getResponse().getStatus());

        MvcResult returnedActionItems = mockMvc.perform(get("/api/team/beachcrazy/action-items")
                    .header("Authorization", "Bearer " + jwtBuilder.buildJwt("beachcrazy")))
                .andReturn();
        ActionItem[] actionItems = mapper.readValue(returnedActionItems.getResponse().getContentAsByteArray(), ActionItem[].class);
        assertEquals(1, actionItems.length);
        assertEquals("Please don't be deleted", actionItems[0].getTask());
    }

    @Test
    public void canEditActionItem() throws Exception {

        ActionItem expectedActionItem = new ActionItem();
        expectedActionItem.setTask("I AM A TEMPORARY TASK");
        expectedActionItem.setTeamId("suchateam");
        expectedActionItem = actionItemRepository.save(expectedActionItem);

        mockMvc.perform(put("/api/team/suchateam/action-item/" + expectedActionItem.getId() + "/task")
                    .content("{\"task\": \"I am an updated task\"}")
                    .contentType(APPLICATION_JSON)
                    .header("Authorization", "Bearer " + jwtBuilder.buildJwt("suchateam")))
                .andExpect(status().isOk())
                .andReturn();

        ActionItem actualActionItem = actionItemRepository.getOne(expectedActionItem.getId());

        assertEquals("I am an updated task", actualActionItem.getTask());
    }

    @Test
    public void canAddAssigneeToActionItem() throws Exception {
        ActionItem expectedActionItem = new ActionItem();
        expectedActionItem.setTask("TEMP TASK");
        expectedActionItem.setTeamId("suchateam");
        expectedActionItem = actionItemRepository.save(expectedActionItem);

        mockMvc.perform(put("/api/team/suchateam/action-item/" + expectedActionItem.getId() + "/assignee")
                    .content("{\"assignee\": \"Bill Ford\"}")
                    .contentType(APPLICATION_JSON)
                    .header("Authorization", "Bearer " + jwtBuilder.buildJwt("suchateam")))
                .andExpect(status().isOk())
                .andReturn();

        ActionItem actualActionItem = actionItemRepository.getOne(expectedActionItem.getId());

        assertEquals("Bill Ford", actualActionItem.getAssignee());
    }

    @Test
    public void cannotAccessActionItemsWithUnauthorizedUser() throws Exception {
        String jwt = jwtBuilder.buildJwt("not-beach-bums");

        ActionItem actionItem1 = new ActionItem();
        actionItem1.setTask("Some Action");
        actionItem1.setTeamId("beach-bums");

        actionItemRepository.save(actionItem1);

        mockMvc.perform(get("/api/team/beach-bums/action-items")
                .header("Authorization", "Bearer " + jwt))
                .andExpect(status().isForbidden());

        mockMvc.perform(post("/api/team/beach-bums/action-item")
                .header("Authorization", "Bearer " + jwt)
                .content("{}")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

        mockMvc.perform(put("/api/team/beach-bums/action-item/1/task")
                .header("Authorization", "Bearer " + jwt)
                .content("{}")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

        mockMvc.perform(put("/api/team/beach-bums/action-item/1/complete")
                .header("Authorization", "Bearer " + jwt)
                .content("{}")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

        mockMvc.perform(delete("/api/team/beach-bums/action-item/1")
                .header("Authorization", "Bearer " + jwt))
                .andExpect(status().isForbidden());
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
