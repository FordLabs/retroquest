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
package com.ford.labs.retroquest;

import com.ford.labs.retroquest.email_reset_token.EmailResetTokenService;
import com.ford.labs.retroquest.password_reset_token.PasswordResetTokenRepository;
import com.ford.labs.retroquest.security.JwtBuilder;
import com.ford.labs.retroquest.team.Team;
import com.ford.labs.retroquest.team.TeamRepository;
import com.ford.labs.retroquest.team.TeamService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.net.URISyntaxException;

import static org.springframework.http.HttpStatus.CREATED;

@Profile("local")
@RestController
@RequestMapping(value = "/api/e2e")
@Tag(name = "E2E test Controller", description = "The controller that manages endpoints only available for E2E testing")
public class E2ETestController {

    private final TeamService teamService;

    private final TeamRepository teamRepository;

    private final JwtBuilder jwtBuilder;

    public E2ETestController(TeamService teamService, TeamRepository teamRepository, PasswordResetTokenRepository passwordResetTokenRepository, EmailResetTokenService emailResetTokenService, JwtBuilder jwtBuilder) {
        this.teamService = teamService;
        this.teamRepository = teamRepository;
        this.jwtBuilder = jwtBuilder;
    }

    @PostMapping("/create-team-with-no-emails")
    @Transactional(rollbackOn = URISyntaxException.class)
    @Operation(summary = "Create or reset test team without email addresses", description = "createTeamWithNoEmailAddresses")
    @ApiResponses(value = {@ApiResponse(responseCode = "201", description = "Created")})
    public ResponseEntity<String> createTeamWithNoEmailAddresses() {
        var teamName = "Team With No Email";
        var teamId = teamService.convertTeamNameToURI(teamName);
        var teamAlreadyCreated = teamRepository.findTeamByUri(teamId);

        if (teamAlreadyCreated.isEmpty()) {
            var encryptedPassword = teamService.encodePassword("Password1");

            var teamWithNoEmail = teamRepository.save(new Team(teamId, teamName , encryptedPassword, null, null));
            teamService.generateColumns(teamWithNoEmail);
        } else {
            var teamToResave = teamAlreadyCreated.get();
            teamToResave.setSecondaryEmail(null);
            teamToResave.setEmail(null);
            teamRepository.save(teamToResave);
        }

        var jwt = jwtBuilder.buildJwt(teamId);
        var headers = new HttpHeaders();
        headers.add(HttpHeaders.LOCATION, teamId);

        return new ResponseEntity<>(jwt, headers, CREATED);
    }
}
