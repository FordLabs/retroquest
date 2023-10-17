package com.ford.labs.retroquest.teamusermapping;

import com.ford.labs.retroquest.team2.Team;
import com.ford.labs.retroquest.team2.TeamRepository2;
import org.h2.jdbc.JdbcSQLIntegrityConstraintViolationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@DataJpaTest
class TeamUserMappingRepositoryTest {
    @Autowired
    private TeamUserMappingRepository subject;

    @Autowired
    private TeamRepository2 teamRepository2;

    private Team savedTeam;

    @BeforeEach
    void setup() {
        subject.deleteAll();
        this.savedTeam = teamRepository2.saveAndFlush(new Team("name"));
    }

    @Test
    void save_SavesTeamAndUserIds() {
        var userId = "This is a user ID";
        var actual = subject.saveAndFlush(new TeamUserMapping(null, savedTeam.getId(), userId, null));
        assertThat(actual.getTeamId()).isEqualTo(savedTeam.getId());
        assertThat(actual.getUserId()).isEqualTo(userId);
    }

    @Test
    void save_GeneratesIdAndCreatedAt() {
        var actual = subject.saveAndFlush(new TeamUserMapping(null, savedTeam.getId(), "id", null));
        assertThat(actual.getId()).isNotNull();
        assertThat(actual.getCreatedAt()).isNotNull();
    }

    @Test
    void save_whenSavingTheSameUserTeamCombo_ThrowsDataIntegrityViolationException() {
        subject.saveAndFlush(new TeamUserMapping(null, savedTeam.getId(), "id", null));
        assertThrows(UnsupportedOperationException.class, () -> subject.saveAndFlush(new TeamUserMapping(null, savedTeam.getId(), "id", null)));
    }

    @Test
    void save_whenSavingTheSameUserTeamCombo_ThrowsDataIntegrityViolationException2() {
        subject.saveAndFlush(new TeamUserMapping(null, savedTeam.getId(), "id", null));
        try{
            subject.saveAndFlush(new TeamUserMapping(null, savedTeam.getId(), "id", null));
        } catch (DataIntegrityViolationException e) {
            var constraintName = ((JdbcSQLIntegrityConstraintViolationException) e.getRootCause());
            System.out.println(constraintName);
        }
    }

    @Test
    void save_whenTeamDoesNotExist_ThrowsDataIntegrityViolationException() {
        assertThrows(DataIntegrityViolationException.class, () -> subject.saveAndFlush(new TeamUserMapping(null, UUID.randomUUID(), "id", null)));
    }

    @Test
    void findByTeamIdAndUserId_WithExistingRecord_ReturnsRecord() {
        subject.saveAndFlush(new TeamUserMapping(null, savedTeam.getId(), "id", null));
        var actual = subject.findByTeamIdAndUserId(savedTeam.getId(), "id");
        assertThat(actual).isPresent();
        assertThat(actual.get().getTeamId()).isEqualTo(savedTeam.getId());
        assertThat(actual.get().getUserId()).isEqualTo("id");
    }

    @Test
    void findByTeamIdAndUserId_WithNoRecord_ReturnsRecord() {
        var actual = subject.findByTeamIdAndUserId(UUID.randomUUID(), "id");
        assertThat(actual).isNotPresent();
    }
}