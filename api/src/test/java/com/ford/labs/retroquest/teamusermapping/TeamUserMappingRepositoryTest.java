package com.ford.labs.retroquest.teamusermapping;

import com.ford.labs.retroquest.team2.Team;
import com.ford.labs.retroquest.team2.TeamRepository2;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class TeamUserMappingRepositoryTest {
    @Autowired
    private TeamUserMappingRepository subject;

    @Autowired
    private TeamRepository2 teamRepository2;

    @BeforeEach
    void setup() {
        subject.deleteAll();
    }

    @Test
    void save_SavesTeamAndUserIds() {
        var savedTeam = teamRepository2.saveAndFlush(new Team("name"));
        var userId = "This is a user ID";
        var actual = subject.saveAndFlush(new TeamUserMapping(null, savedTeam.getId(), userId, null));
        assertThat(actual.getTeamId()).isEqualTo(savedTeam.getId());
        assertThat(actual.getUserId()).isEqualTo(userId);
    }

    @Test
    void save_GeneratesIdAndCreatedAt() {
        var savedTeam = teamRepository2.saveAndFlush(new Team("name"));
        var actual = subject.saveAndFlush(new TeamUserMapping(null, savedTeam.getId(), "id", null));
        assertThat(actual.getId()).isNotNull();
        assertThat(actual.getCreatedAt()).isNotNull();
    }
}