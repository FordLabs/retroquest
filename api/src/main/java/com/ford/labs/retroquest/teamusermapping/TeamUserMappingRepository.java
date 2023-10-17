package com.ford.labs.retroquest.teamusermapping;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TeamUserMappingRepository extends JpaRepository<TeamUserMapping, UUID> {
    Optional<TeamUserMapping> findByTeamIdAndUserId(UUID teamId, String userId);
}
