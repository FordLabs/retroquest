package com.ford.labs.retroquest.team2;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface TeamRepository2 extends JpaRepository<Team, UUID> {
    Optional<Team> findTeamByName(String name);
}
