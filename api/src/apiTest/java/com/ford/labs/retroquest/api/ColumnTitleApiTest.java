package com.ford.labs.retroquest.api;

import com.ford.labs.retroquest.columntitle.ColumnTitle;
import com.ford.labs.retroquest.columntitle.ColumnTitleRepository;
import org.junit.After;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Arrays;

import static org.junit.Assert.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class ColumnTitleApiTest extends ControllerTest {

    @Autowired
    private ColumnTitleRepository columnTitleRepository;

    @After
    public void tearDown() {
        columnTitleRepository.deleteAll();
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
    public void submittingModifiedTitleUpdatesTitle() throws Exception {
        ColumnTitle columnTitle = new ColumnTitle();
        columnTitle.setTeamId("BeachBums");
        columnTitle.setTitle("Unmodified title");

        ColumnTitle createdColumnTitle = columnTitleRepository.save(columnTitle);
        String columnTitleJsonBody = "{ \"title\" : \"modified title\" }";

        mockMvc.perform(put("/api/team/BeachBums/column/" + createdColumnTitle.getId() + "/title")
                .contentType(MediaType.APPLICATION_JSON)
                .content(columnTitleJsonBody)
                .header("Authorization", getBearerAuthToken()))
            .andExpect(status().isOk());

        MvcResult columnListRequest = mockMvc.perform(get("/api/team/BeachBums/columns").contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", getBearerAuthToken()))
                .andReturn();

        ColumnTitle[] columnTitles = objectMapper.readValue(columnListRequest.getResponse().getContentAsByteArray(), ColumnTitle[].class);

        assertEquals("modified title", columnTitles[0].getTitle());
    }

    @Test
    public void submittingModifiedTitleDoesNotCreateNewColumnTitle() throws Exception {

        ColumnTitle columnTitle = new ColumnTitle();
        columnTitle.setTeamId("BeachBums");
        columnTitle.setTitle("Unmodified title");

        ColumnTitle createdColumnTitle = columnTitleRepository.save(columnTitle);
        int startingSize = columnTitleRepository.findAll().size();

        String columnTitleJsonBody = "{ \"title\" : \"modified title\" }";

        mockMvc.perform(put("/api/team/BeachBums/column/" + createdColumnTitle.getId() + "/title")
                .contentType(MediaType.APPLICATION_JSON)
                .content(columnTitleJsonBody)
                .header("Authorization", getBearerAuthToken()))
                .andExpect(status().isOk());

        assertEquals(startingSize, columnTitleRepository.findAll().size());
    }
}
