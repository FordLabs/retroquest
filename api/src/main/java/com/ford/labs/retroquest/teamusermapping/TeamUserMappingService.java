package com.ford.labs.retroquest.teamusermapping;

import com.ford.labs.retroquest.teamusermapping.exception.TeamNotFoundException;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class TeamUserMappingService {

    private final TeamUserMappingRepository repository;

    public TeamUserMappingService(TeamUserMappingRepository repository) {
        this.repository = repository;
    }

    public void addUserToTeam(UUID teamId, String userId) {
        try {
            this.repository.save(new TeamUserMapping(null, teamId, userId, null));
        } catch (DataIntegrityViolationException e) {
            var cause = e.getRootCause();
            if (cause instanceof ConstraintViolationException && ((ConstraintViolationException) cause).getConstraintName().equals("FK_TEAM_MAPPING")) {
                throw new TeamNotFoundException();
            } else if (cause != null && !cause.getMessage().contains("UNIQUE_TEAM_USER_MAPPING")) {
                throw e;
            }
        }
    }
}
