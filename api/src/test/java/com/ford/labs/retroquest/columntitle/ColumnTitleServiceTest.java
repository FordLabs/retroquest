package com.ford.labs.retroquest.columntitle;

import org.junit.jupiter.api.BeforeEach;
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

    @BeforeEach
    void beforeEach() {
        columnTitleRepository.deleteAll();
    }

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

    @Test
    void given_column_id_and_column_title_rename_column_in_db_and_return_new_column_title() {
        long columnId = 1L;
        var columnTitle = new ColumnTitle(columnId, "happy", "Some Title", "some team id");
        columnTitleRepository.save(columnTitle);

        String newColumnName = "Some new Title";
        var savedColumnTitle = columnTitleService.editColumnTitleName(columnId, newColumnName);

        assertThat(savedColumnTitle.getTitle()).isEqualTo(newColumnName);
        assertThat(savedColumnTitle.getId()).isEqualTo(columnId);
    }

}