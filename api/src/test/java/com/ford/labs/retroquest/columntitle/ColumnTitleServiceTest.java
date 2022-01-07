package com.ford.labs.retroquest.columntitle;

import com.ford.labs.retroquest.exception.ColumnTitleNotFoundException;
import org.junit.jupiter.api.AfterEach;
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

    @AfterEach
    void afterEach() {
        columnTitleRepository.deleteAll();
    }

    private final ColumnTitle.ColumnTitleBuilder columnTitleBuilder = ColumnTitle.builder();

    @Test
    void given_teamid_get_column_titles() {
        String teamId = "some team id";
        String teamId2 = "some other team id";
        var columnTitle1 = columnTitleRepository.save(columnTitleBuilder.topic("happy").title("Some Title").teamId(teamId).build());
        var columnTitle2 = columnTitleRepository.save(columnTitleBuilder.topic("meh").title("Some Other Title").teamId(teamId).build());
        var columnTitle3 = columnTitleRepository.save(columnTitleBuilder.topic("happy").title("Some Title").teamId(teamId2).build());

        assertThat(columnTitleService.getColumnTitlesByTeamId(teamId)).containsExactlyInAnyOrder(columnTitle1, columnTitle2);
        assertThat(columnTitleService.getColumnTitlesByTeamId(teamId2)).containsExactlyInAnyOrder(columnTitle3);
    }

    @Test
    void given_column_id_and_column_title_rename_column_in_db_and_return_new_column_title() {
        var columnTitle = columnTitleRepository.save(columnTitleBuilder.topic("happy").title("Some Title").teamId("some team ID").build());

        String newColumnName = "Some new Title";
        var savedColumnTitle = columnTitleService.editColumnTitleName(columnTitle.getId(), newColumnName);

        assertThat(savedColumnTitle.getTitle()).isEqualTo(newColumnName);
        assertThat(savedColumnTitle.getId()).isEqualTo(columnTitle.getId());
    }

    @Test
    void throws_column_title_not_found_exception_when_column_title_not_in_db() {
        try {
            columnTitleService.editColumnTitleName(42L, "some name");
        } catch (RuntimeException exception) {
            assertThat(exception).isInstanceOf(ColumnTitleNotFoundException.class);
        }
    }
}