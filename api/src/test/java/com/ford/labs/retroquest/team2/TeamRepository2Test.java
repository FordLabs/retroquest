package com.ford.labs.retroquest.team2;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.dao.DataIntegrityViolationException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;

@DataJpaTest
class TeamRepository2Test {

    @Autowired
    private TeamRepository2 subject;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    void save_SavesTeamWithCreatedDate() {
        var savedTeam = entityManager.persist(new Team2("default team"));
        assertThat(savedTeam.getId()).isNotNull();
        assertThat(savedTeam.getName()).isEqualTo("default team");
        assertThat(savedTeam.getCreatedAt()).isNotNull();
    }

    @Test
    void findTeamByName_ReturnsTeamWithName() {
        entityManager.persist(new Team2("team With name"));
        var actual = subject.findTeam2ByName("team With name").orElseThrow();
        assertThat(actual.getName()).isEqualTo("team With name");
    }

    @Test
    void save_WhenSameNameSavedTwice_ThrowsException() {
        subject.saveAndFlush(new Team2("Duplicate Name"));
        assertThatExceptionOfType(DataIntegrityViolationException.class)
                .isThrownBy(() -> subject.saveAndFlush(new Team2("Duplicate Name")));
    }
}