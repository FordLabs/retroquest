package com.ford.labs.retroquest.team2;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.UUID;

import static java.util.Collections.emptyList;

@RestController
@RequestMapping("/api/team2")
public class TeamController2 {

    @PostMapping
    public ResponseEntity createTeam(@RequestBody CreateTeamRequest createTeamRequest) {
        throw new UnsupportedOperationException();
    }

    @GetMapping
    public ResponseEntity getTeams() {
        throw new UnsupportedOperationException();
    }

    @GetMapping("/{id}")
    public ResponseEntity getTeam(@PathVariable("id") UUID id){
        throw new UnsupportedOperationException();
    }
}
