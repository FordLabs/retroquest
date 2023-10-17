package com.ford.labs.retroquest.team2;

import com.ford.labs.retroquest.team2.exception.TeamAlreadyExistsException;
import com.ford.labs.retroquest.teamusermapping.TeamUserMappingService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Service
public class TeamService2 {

    private final TeamRepository2 repository;
    private final TeamUserMappingService teamUserMappingService;

    public TeamService2(TeamRepository2 repository, TeamUserMappingService teamUserMappingService) {
        this.repository = repository;
        this.teamUserMappingService = teamUserMappingService;
    }
    public Team createTeam(String teamName, String userId) throws TeamAlreadyExistsException {
        try {
            var savedTeam = repository.save(new Team(teamName));
            teamUserMappingService.addUserToTeam(savedTeam.getId(), userId);
            return savedTeam;
        } catch (DataIntegrityViolationException exception) {
            throw new TeamAlreadyExistsException();
        }
    }
}
