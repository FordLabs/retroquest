/*
 * Copyright (c) 2022 Ford Motor Company
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.ford.labs.retroquest.team;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import javax.validation.Valid;
import java.io.IOException;
import java.net.URISyntaxException;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping(value = "/api/team")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @PostMapping
    @Transactional(rollbackOn = URISyntaxException.class)
    public ResponseEntity<String> createTeam(@RequestBody @Valid CreateTeamRequest createTeamRequest) {
        var team = teamService.createNewTeam(createTeamRequest);
        var teamId = team.getUri();

        var headers = new HttpHeaders();
        headers.add(HttpHeaders.LOCATION, teamId);

        return new ResponseEntity<>(headers, CREATED);
    }

    @GetMapping("/{teamId}")
    @Transactional(rollbackOn = URISyntaxException.class)
    @PreAuthorize("@teamAuthorization.requestIsAuthorized(authentication, #teamId)")
    public ResponseEntity<Team> getTeam(@PathVariable("teamId") String teamId) {
        return ResponseEntity.ok(teamService.getTeamByUri(teamId));
    }

    @GetMapping("/{teamId}/name")
    public String getTeamName(@PathVariable("teamId") String teamUri) {
        return teamService.getTeamByUri(teamUri).getName();
    }
}
