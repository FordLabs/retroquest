package com.ford.labs.retroquest.team2.invite;

import com.ford.labs.retroquest.team2.Team;
import com.ford.labs.retroquest.team2.TeamRepository2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@DataJpaTest
class InviteRepositoryTest {

    @Autowired
    private InviteRepository subject;

    @Autowired
    private TeamRepository2 teamRepository2;

    @Test
    void save_AutoGeneratesIdAndCreationTimestamp() {
        var savedTeam = teamRepository2.saveAndFlush(new Team(null, "team name", null));

        var actual = subject.saveAndFlush(new Invite(null, savedTeam.getId(), null));

        assertThat(actual.getId()).isNotNull();
        assertThat(actual.getTeamId()).isEqualTo(savedTeam.getId());
        assertThat(actual.getCreatedAt()).isNotNull();
    }

    @Test
    void save_whenTeamDoesNotExist_ThrowsDataIntegrityViolationException() {
        assertThrows(DataIntegrityViolationException.class, () -> subject.saveAndFlush(new Invite(null, UUID.randomUUID(), null)));
    }
}