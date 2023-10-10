package com.ford.labs.retroquest.user;

import com.ford.labs.retroquest.team2.Team;
import com.ford.labs.retroquest.team2.TeamUserMapping;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.HashSet;

import static java.util.Collections.emptySet;
import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class UserRepositoryTest {
    @Autowired
    private UserRepository subject;
    @Autowired
    private TestEntityManager entityManager;
    
    @Test
    void save_storesUser() {
        subject.saveAndFlush(new User("User ID", emptySet()));
        var actual = subject.findById("User ID").orElseThrow();
        assertThat(actual.getId()).isEqualTo("User ID");
        assertThat(actual.getTeams()).isEmpty();
    }

    @Test
    void save_storesTeamsRelatedToUser() {
        var team = new Team("Team");
        var user = new User("User ID", new HashSet<>());
        team = entityManager.persistAndFlush(team);
        user = entityManager.persistAndFlush(user);
        var mapping = new TeamUserMapping(null, team, user, null);
        mapping = entityManager.persistAndFlush(mapping);
        user.getTeams().add(mapping);
        subject.save(user);

        var actual = subject.findById("User ID").orElseThrow();

        assertThat(actual.getId()).isEqualTo("User ID");
        assertThat(actual.getTeams()).containsExactly(mapping);
    }
}