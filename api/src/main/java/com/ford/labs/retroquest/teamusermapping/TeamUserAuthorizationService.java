package com.ford.labs.retroquest.teamusermapping;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class TeamUserAuthorizationService {

    private final TeamUserMappingRepository repository;

    public TeamUserAuthorizationService(TeamUserMappingRepository repository) {
        this.repository = repository;
    }

    public boolean isUserMemberOfTeam(Authentication authentication, UUID teamId) {
        return repository.findByTeamIdAndUserId(teamId, authentication.getName()).isPresent();
    }
}
