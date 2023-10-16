package com.ford.labs.retroquest.teamusermapping;

import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class TeamUserMappingService {

    private final TeamUserMappingRepository repository;

    public TeamUserMappingService(TeamUserMappingRepository repository) {
        this.repository = repository;
    }

    void addUserToTeam(UUID teamId, String userId) {
        this.repository.save(new TeamUserMapping(null, teamId, userId, null));
    }
}
