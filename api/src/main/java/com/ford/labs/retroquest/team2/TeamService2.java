package com.ford.labs.retroquest.team2;

import com.ford.labs.retroquest.team2.exception.InviteExpiredException;
import com.ford.labs.retroquest.team2.exception.InviteNotFoundException;
import com.ford.labs.retroquest.team2.exception.TeamAlreadyExistsException;
import com.ford.labs.retroquest.team2.invite.InviteService;
import com.ford.labs.retroquest.teamusermapping.TeamUserMappingService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class TeamService2 {

    private final TeamRepository2 repository;
    private final TeamUserMappingService teamUserMappingService;
    private final InviteService inviteService;

    public TeamService2(TeamRepository2 repository, TeamUserMappingService teamUserMappingService, InviteService inviteService) {
        this.repository = repository;
        this.teamUserMappingService = teamUserMappingService;
        this.inviteService = inviteService;
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

    public void addUser(UUID teamId, String userId, UUID inviteId) {
        var invite = inviteService.getInvite(teamId, inviteId);
        if(invite.isEmpty()) {
            throw new InviteNotFoundException();
        }
        if(invite.get().getCreatedAt().plusHours(3).isBefore(LocalDateTime.now())) {
            throw new InviteExpiredException();
        }
        teamUserMappingService.addUserToTeam(teamId, userId);
    }
}
