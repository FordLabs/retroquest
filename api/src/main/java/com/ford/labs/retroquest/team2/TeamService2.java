package com.ford.labs.retroquest.team2;

import com.ford.labs.retroquest.team2.exception.TeamAlreadyExistsException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Service
public class TeamService2 {

    private final TeamRepository2 repository;

    public TeamService2(TeamRepository2 repository) {
        this.repository = repository;
    }
    public Team createTeam(String name) throws TeamAlreadyExistsException {
        try {
            return repository.save(new Team(name));
        } catch (DataIntegrityViolationException exception) {
            throw new TeamAlreadyExistsException();
        }
    }
}
