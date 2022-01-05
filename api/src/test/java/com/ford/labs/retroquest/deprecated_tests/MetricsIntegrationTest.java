package com.ford.labs.retroquest.deprecated_tests;

import com.ford.labs.retroquest.metrics.Metrics;
import com.ford.labs.retroquest.team.Team;
import com.ford.labs.retroquest.team.TeamRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.time.Period;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class MetricsIntegrationTest {

    @Autowired
    TeamRepository teamRepository;
    @Autowired
    Metrics metrics;

    @Test
    void getTeamLogins_whenGivenBothAStartAndEndDate_passesDatesToRepository() {

        var teamBuilder = new Team().toBuilder();

        teamRepository.save(teamBuilder.lastLoginDate(LocalDate.now()).uri("something").build());
        teamRepository.save(teamBuilder.lastLoginDate(LocalDate.now().minus(Period.ofMonths(4))).uri("somethingelse").build());

        assertThat(metrics.getActiveTeams()).isEqualTo(1);

    }
}
