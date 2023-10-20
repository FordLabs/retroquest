package com.ford.labs.retroquest.team2.invite;

import com.ford.labs.retroquest.team2.exception.TeamNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class InviteService {

    private final InviteRepository inviteRepository;

    public InviteService(InviteRepository inviteRepository) {
        this.inviteRepository = inviteRepository;
    }

    public Invite createInvite(UUID teamId) {
        try{
            return inviteRepository.save(new Invite(null, teamId, null));
        } catch (DataIntegrityViolationException e) {
            throw new TeamNotFoundException();
        }
    }

    public Optional<Invite> getInvite(UUID teamId, UUID inviteId) {
        return inviteRepository.findByIdAndTeamId(inviteId, teamId);
    }
}
