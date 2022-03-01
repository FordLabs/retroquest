package com.ford.labs.retroquest.api;

import com.ford.labs.retroquest.api.setup.ApiTestBase;
import com.ford.labs.retroquest.columntitle.ColumnTitle;
import com.ford.labs.retroquest.columntitle.ColumnTitleRepository;
import com.ford.labs.retroquest.thought.ThoughtRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static java.lang.String.format;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Tag("api")
public class ColumnApiTest extends ApiTestBase {

    @Autowired
    ColumnTitleRepository columnTitleRepository;

    @Autowired
    ThoughtRepository thoughtRepository;

    @BeforeEach
    void setup() {
        columnTitleRepository.deleteAllInBatch();
        thoughtRepository.deleteAllInBatch();
    }

    @Test
    public void getColumns_shouldReturnListOfColumns() throws Exception {
        var happyColumn = new ColumnTitle(null, "happy", "Happy Thoughts", teamId);
        var sadColumn = new ColumnTitle(null, "sad", "Sad Thoughts", teamId);
        happyColumn = columnTitleRepository.save(happyColumn);
        sadColumn = columnTitleRepository.save(sadColumn);

        mockMvc.perform(get(format("/api/team/%s/columns", teamId))
                .header("Authorization", "Bearer " + getBearerAuthToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.[0].id").value(happyColumn.getId()))
                .andExpect(jsonPath("$.[0].title").value(happyColumn.getTitle()))
                .andExpect(jsonPath("$.[0].topic").value(happyColumn.getTopic()))
                .andExpect(jsonPath("$.[1].id").value(sadColumn.getId()))
                .andExpect(jsonPath("$.[1].title").value(sadColumn.getTitle()))
                .andExpect(jsonPath("$.[1].topic").value(sadColumn.getTopic()));
    }

    @Test
    public void getColumns_WithInvalidCredential_Returns403() throws Exception {
        mockMvc.perform(get(format("/api/team/%s/columns", teamId))
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("not-beach-bums")))
                .andExpect(status().isForbidden());
    }
}
