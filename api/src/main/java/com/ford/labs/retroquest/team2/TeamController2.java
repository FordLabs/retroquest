package com.ford.labs.retroquest.team2;

import com.ford.labs.retroquest.team2.exception.InviteExpiredException;
import com.ford.labs.retroquest.team2.exception.InviteNotFoundException;
import com.ford.labs.retroquest.team2.exception.TeamAlreadyExistsException;
import com.ford.labs.retroquest.team2.exception.TeamNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.security.Principal;
import java.util.UUID;

@RestController
@RequestMapping("/api/team2")
public class TeamController2 {

    private final TeamService2 teamService;

    public TeamController2(TeamService2 teamService) {
        this.teamService = teamService;
    }

    @PostMapping
    public ResponseEntity<Void> createTeam(@RequestBody CreateTeamRequest createTeamRequest, Principal principal) {
        var team = teamService.createTeam(createTeamRequest.name(), principal.getName());
        return ResponseEntity.created(URI.create("/api/team/%s".formatted(team.getId()))).build();
    }

    @GetMapping
    public ResponseEntity getTeams() {
        throw new UnsupportedOperationException();
    }

    @GetMapping("/{id}")
    public ResponseEntity getTeam(@PathVariable("id") UUID teamId){
        throw new UnsupportedOperationException();
    }

    @PostMapping("/{id}/users")
    public ResponseEntity<Void> addUser(@PathVariable("id") UUID teamId, @RequestBody AddUserToTeamRequest request, Principal principal) {
        teamService.addUser(teamId, principal.getName(), request.inviteId());
        return ResponseEntity.ok().build();
    }

    @ResponseStatus(value=HttpStatus.CONFLICT, reason="A team with that name already exists")
    @ExceptionHandler(TeamAlreadyExistsException.class)
    public void handleTeamAlreadyExists() {}

    @ResponseStatus(value=HttpStatus.NOT_FOUND, reason="Team not found")
    @ExceptionHandler(TeamNotFoundException.class)
    public void handleTeamNotFoundException() {}

    @ResponseStatus(value= HttpStatus.NOT_FOUND, reason="Invite not found for team")
    @ExceptionHandler(InviteNotFoundException.class)
    public void handleInviteNotFoundException() {}

    @ResponseStatus(value=HttpStatus.BAD_REQUEST, reason="Invite expired")
    @ExceptionHandler(InviteExpiredException.class)
    public void handleInviteExpiredException() {}
}
