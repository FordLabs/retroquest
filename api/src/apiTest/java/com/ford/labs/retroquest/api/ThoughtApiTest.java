package com.ford.labs.retroquest.api;

import com.ford.labs.retroquest.api.setup.ApiTest;
import com.ford.labs.retroquest.columntitle.ColumnTitle;
import com.ford.labs.retroquest.columntitle.ColumnTitleRepository;
import com.ford.labs.retroquest.thought.Thought;
import com.ford.labs.retroquest.thought.ThoughtRepository;
import org.assertj.core.api.Assertions;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class ThoughtApiTest extends ApiTest {

    @Autowired
    private ThoughtRepository thoughtRepository;

    @Autowired
    private ColumnTitleRepository columnTitleRepository;

    private String BASE_SUB_URL;
    private String BASE_ENDPOINT_URL;
    private String BASE_GET_URL;

    @Before
    public void setup() {
        BASE_SUB_URL = "/topic/" + teamId + "/thoughts";
        BASE_ENDPOINT_URL = "/app/" + teamId + "/thought";
        BASE_GET_URL = "/api/team/" + teamId;
    }

    @After
    public void teardown() {
        thoughtRepository.deleteAll();
        Assertions.assertThat(thoughtRepository.count()).isEqualTo(0);
    }

    @Test
    public void should_delete_all_thoughts_on_team() throws Exception {
        StompSession session = getAuthorizedSession();
        subscribe(session, BASE_SUB_URL);

        thoughtRepository.saveAll(Arrays.asList(
                Thought.builder().teamId(teamId).message("message").build(),
                Thought.builder().teamId("team 2").message("message").build()
        ));

        session.send(BASE_ENDPOINT_URL + "/delete", null);

        assertThat(takeObjectInSocket(Long.class)).isEqualTo(-1L);
        assertThat(thoughtRepository.count()).isEqualTo(1);
    }

    @Test
    public void should_not_delete_all_thoughts_unauthorized() throws Exception {
        StompSession session = getUnauthorizedSession();
        subscribe(session, BASE_SUB_URL);

        thoughtRepository.save(Thought.builder().teamId(teamId).message("message").build());

        session.send(BASE_ENDPOINT_URL + "/delete", null);

        assertThat(thoughtRepository.count()).isEqualTo(1);
    }

    @Test
    public void should_edit_thought() throws Exception {
        StompSession session = getAuthorizedSession();
        subscribe(session, BASE_SUB_URL);

        Thought savedThought = thoughtRepository.save(Thought.builder()
                .teamId(teamId)
                .message("message")
                .discussed(false)
                .hearts(1)
                .build());

        Thought sentThought = Thought.builder()
                .id(savedThought.getId())
                .message("message 2")
                .discussed(true)
                .hearts(2)
                .build();

        session.send(BASE_ENDPOINT_URL + "/" + savedThought.getId().toString() + "/edit",
                objectMapper.writeValueAsBytes(sentThought));

        Thought responseThought = takeObjectInSocket(Thought.class);

        Thought updatedThought = thoughtRepository.findById(savedThought.getId()).orElseThrow();

        assertThat(responseThought).isEqualToComparingFieldByField(responseThought);

        assertThat(updatedThought.getId()).isEqualTo(sentThought.getId());
        assertThat(updatedThought.getMessage()).isEqualTo(sentThought.getMessage());
        assertThat(updatedThought.isDiscussed()).isEqualTo(sentThought.isDiscussed());
        assertThat(updatedThought.getHearts()).isEqualTo(sentThought.getHearts());
    }

    @Test
    public void should_not_edit_thought_unauthorized() throws Exception {
        StompSession session = getUnauthorizedSession();
        subscribe(session, BASE_SUB_URL);

        Thought savedThought = thoughtRepository.save(Thought.builder().teamId(teamId).message("message").build());
        Thought sentThought = Thought.builder().id(savedThought.getId()).message("message 2").build();

        session.send(BASE_ENDPOINT_URL + "/" + savedThought.getId().toString() + "/edit",
                objectMapper.writeValueAsBytes(sentThought));

        Thought responseThought = takeObjectInSocket(Thought.class);

        Thought updatedThought = thoughtRepository.findById(savedThought.getId()).orElseThrow();

        assertThat(updatedThought).isEqualToComparingFieldByField(savedThought);
        assertThat(responseThought).isNull();
    }

    @Test
    public void should_create_thought() throws Exception {
        StompSession session = getAuthorizedSession();
        subscribe(session, BASE_SUB_URL);

        Thought sentThought = Thought.builder()
                .teamId(teamId)
                .message("message")
                .build();

        session.send(BASE_ENDPOINT_URL + "/create",
                objectMapper.writeValueAsBytes(sentThought));

        Thought responseThought = takeObjectInSocket(Thought.class);

        Thought savedThought = thoughtRepository.findById(responseThought.getId()).orElseThrow();

        assertThat(savedThought).isEqualToComparingFieldByField(responseThought);
    }

    @Test
    public void should_create_thought_and_assign_column_title() throws Exception {
        StompSession session = getAuthorizedSession();
        subscribe(session, BASE_SUB_URL);

        Thought sentThought = Thought.builder()
                .teamId(teamId)
                .message("message")
                .topic("happy")
                .build();

        ColumnTitle savedColumnTitle = columnTitleRepository.save(ColumnTitle.builder().teamId(teamId).topic("happy").build());

        session.send(BASE_ENDPOINT_URL + "/create",
                objectMapper.writeValueAsBytes(sentThought));

        Thought responseThought = takeObjectInSocket(Thought.class);

        Thought savedThought = thoughtRepository.findById(responseThought.getId()).orElseThrow();

        assertThat(savedThought.getColumnTitle()).isEqualTo(savedColumnTitle);
    }

    @Test
    public void should_not_create_thought_unauthorized() throws Exception {
        StompSession session = getUnauthorizedSession();
        subscribe(session, BASE_SUB_URL);

        Thought sentThought = Thought.builder().teamId(teamId).message("message").build();

        session.send(BASE_ENDPOINT_URL + "/create",
                objectMapper.writeValueAsBytes(sentThought));

        Thought responseThought = takeObjectInSocket(Thought.class);

        assertThat(responseThought).isNull();
        assertThat(thoughtRepository.count()).isEqualTo(0);
    }

    @Test
    public void should_get_thoughts_on_same_team() throws Exception {

        List<Thought> savedThoughts = Arrays.asList(
                Thought.builder().message("message 1").teamId(teamId).build(),
                Thought.builder().message("message 2").teamId(teamId).build(),
                Thought.builder().message("message 2").teamId("team 2").build()
        );

        thoughtRepository.saveAll(savedThoughts);

        MvcResult result = mockMvc.perform(get(BASE_GET_URL + "/thoughts")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", getBearerAuthToken()))
                .andExpect(status().isOk())
                .andReturn();

        Thought[] response = objectMapper.readValue(result.getResponse().getContentAsByteArray(), Thought[].class);

        assertThat(response).hasSize(2);
    }

    @Test
    public void should_not_get_thoughts_unauthorized() throws Exception {

        List<Thought> savedThoughts = Collections.singletonList(
                Thought.builder().message("message 1").teamId(teamId).build()
        );

        thoughtRepository.saveAll(savedThoughts);

        mockMvc.perform(get(BASE_GET_URL + "/thoughts")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("unauthorized")))
                .andExpect(status().isForbidden());
    }

}
