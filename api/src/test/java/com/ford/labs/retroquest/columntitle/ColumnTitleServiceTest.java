package com.ford.labs.retroquest.columntitle;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class ColumnTitleServiceTest {

    @Autowired
    ColumnTitleRepository columnTitleRepository;

    @Autowired
    ColumnTitleService columnTitleService;

    @Test
    void given_teamid_get_column_titles() {
        String teamId = "some team id";
        var columnTitle = new ColumnTitle(1L, "happy", "Some Title", teamId);
        var columnTitle2 = new ColumnTitle(2L, "meh", "Some Other Title", teamId);
        String teamId2 = "some other team id";
        var columnTitle3 = new ColumnTitle(3L, "happy", "Some Title", teamId2);
        columnTitleRepository.save(columnTitle);
        columnTitleRepository.save(columnTitle2);
        columnTitleRepository.save(columnTitle3);


        assertThat(columnTitleService.getColumnTitlesByTeamId(teamId)).containsExactlyInAnyOrder(columnTitle, columnTitle2);
        assertThat(columnTitleService.getColumnTitlesByTeamId(teamId2)).containsExactlyInAnyOrder(columnTitle3);

    }

}