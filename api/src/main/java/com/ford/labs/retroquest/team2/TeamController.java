package com.ford.labs.retroquest.team2;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/team")
public class TeamController {

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
