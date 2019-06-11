package com.ford.labs.retroquest.api.refactor;

import com.ford.labs.retroquest.api.refactor.setup.ApiTest;
import com.ford.labs.retroquest.columntitle.ColumnTitle;
import com.ford.labs.retroquest.columntitle.ColumnTitleRepository;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Arrays;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class ColumnTitleApiTest extends ApiTest {

    @Autowired
    private ColumnTitleRepository columnTitleRepository;

    private String BASE_SUB_URL;
    private String BASE_ENDPOINT_URL;

    @Before
    public void setup() {
        BASE_SUB_URL = "/topic/" + teamId + "/column-titles";
        BASE_ENDPOINT_URL = "/app/" + teamId + "/column-title";
    }

    @After
    public void teardown() {
        columnTitleRepository.deleteAll();
        assertThat(columnTitleRepository.count()).isEqualTo(0);
    }

    @Test
    public void canEditColumnTitleWithWebSockets() throws Exception {

        ColumnTitle savedColumnTitle = columnTitleRepository.save(ColumnTitle.builder()
                .title("old title")
                .teamId("beach-bums")
                .build());

        StompSession session = getAuthorizedSession();
        subscribe(session, BASE_SUB_URL);

        ColumnTitle sentColumnTitle = ColumnTitle.builder()
                .id(savedColumnTitle.getId())
                .title("new title")
                .teamId(savedColumnTitle.getTeamId())
                .build();

        session.send(BASE_ENDPOINT_URL + "/" + sentColumnTitle.getId() + "/edit",
                objectMapper.writeValueAsBytes(sentColumnTitle));

        ColumnTitle response = takeObjectInSocket(ColumnTitle.class);

        assertThat(response).isEqualTo(sentColumnTitle);
        assertThat(columnTitleRepository.count()).isEqualTo(1);
        assertThat(columnTitleRepository.findAll().get(0)).isEqualTo(sentColumnTitle);
    }

    @Test
    public void canRetrieveListOfColumnNamesForTeam() throws Exception {
        ColumnTitle columnTitle1 = new ColumnTitle();
        columnTitle1.setTeamId("BeachBums");
        ColumnTitle columnTitle2 = new ColumnTitle();
        columnTitle2.setTeamId("BeachBums");
        ColumnTitle columnTitle3 = new ColumnTitle();
        columnTitle3.setTeamId("BeachBums");

        columnTitleRepository.save(Arrays.asList(columnTitle1, columnTitle2, columnTitle3));

        MvcResult columnListRequest = mockMvc.perform(get("/api/team/BeachBums/columns").contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", getBearerAuthToken()))
                .andReturn();

        ColumnTitle[] columnTitles = objectMapper.readValue(columnListRequest.getResponse().getContentAsByteArray(), ColumnTitle[].class);

        assertEquals(3, columnTitles.length);
    }

    @Test
    public void should_update_column_title() throws Exception {

        ColumnTitle savedColumnTitle = columnTitleRepository.save(ColumnTitle.builder()
                .teamId("BeachBums")
                .title("old title")
                .build());

        ColumnTitle sentColumnTitle = ColumnTitle.builder()
                .id(savedColumnTitle.getId())
                .teamId("BeachBums")
                .title("new title")
                .build();

        mockMvc.perform(put("/api/team/BeachBums/column/" + savedColumnTitle.getId() + "/title")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsBytes(sentColumnTitle))
                .header("Authorization", getBearerAuthToken()))
                .andExpect(status().isOk());

        assertThat(columnTitleRepository.count()).isEqualTo(1);
        assertThat(columnTitleRepository.findAll().get(0)).isEqualTo(sentColumnTitle);
    }
}