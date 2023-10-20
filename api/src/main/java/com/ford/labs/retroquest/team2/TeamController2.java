package com.ford.labs.retroquest.team2;

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
    //TODO: HANDLE THE THROWN EXCEPTIONS AS REST RESPONSE CODES
    public ResponseEntity<Void> addUser(@PathVariable("id") UUID teamId, @RequestBody AddUserToTeamRequest request, Principal principal) {
        teamService.addUser(teamId, principal.getName(), request.inviteId());
        return ResponseEntity.ok().build();
    }
}
