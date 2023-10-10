package com.ford.labs.retroquest.team2;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TeamUserMappingRepository extends JpaRepository<TeamUserMapping, UUID> {
}
