/*
 * Copyright © 2018 Ford Motor Company
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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.net.URISyntaxException;

@Profile("test")
@RestController
public class CreateTeamWithoutPasswordController {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private TeamService teamService;

    @PostMapping("/api/team/without-password")
    public ResponseEntity createTeamWithoutPassword(@RequestBody RequestedTeam requestedTeam) throws URISyntaxException {
        Team team = new Team();
        team.setName(requestedTeam.getName());
        team.setUri(teamService.convertTeamNameToURI(requestedTeam.getName()));
        teamRepository.save(team);
        return ResponseEntity.created(new URI(team.getUri())).build();
    }

}
