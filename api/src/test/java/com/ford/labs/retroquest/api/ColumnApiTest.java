package com.ford.labs.retroquest.api;

import com.ford.labs.retroquest.api.setup.ApiTestBase;
import com.ford.labs.retroquest.columntitle.ColumnTitle;
import com.ford.labs.retroquest.columntitle.ColumnTitleRepository;
import com.ford.labs.retroquest.thought.Thought;
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

        var happyThought = new Thought(null, "something1", 0, "happy", false, teamId, happyColumn, null);
        var sadThought = new Thought(null, "something2", 0, "sad", false, teamId, sadColumn, null);
        thoughtRepository.save(happyThought);
        thoughtRepository.save(sadThought);

        mockMvc.perform(get(format("/api/team/%s/columns", teamId))
                .header("Authorization", "Bearer " + getBearerAuthToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.[0].id").value(happyColumn.getId()))
                .andExpect(jsonPath("$.[0].title").value(happyColumn.getTitle()))
                .andExpect(jsonPath("$.[0].thoughts.[0].message").value("something1"))
                .andExpect(jsonPath("$.[1].id").value(sadColumn.getId()))
                .andExpect(jsonPath("$.[1].title").value(sadColumn.getTitle()))
                .andExpect(jsonPath("$.[1].thoughts.[0].message").value("something2"));
    }

    @Test
    public void getColumns_WithInvalidCredential_Returns403() throws Exception {
        mockMvc.perform(get(format("/api/team/%s/columns", teamId))
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("not-beach-bums")))
                .andExpect(status().isForbidden());
    }
}
