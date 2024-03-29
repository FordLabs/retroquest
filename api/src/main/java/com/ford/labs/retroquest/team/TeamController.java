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

import com.ford.labs.retroquest.email_reset_token.EmailResetToken;
import com.ford.labs.retroquest.email_reset_token.EmailResetTokenRepository;
import com.ford.labs.retroquest.exception.BadResetTokenException;
import com.ford.labs.retroquest.security.JwtBuilder;
import com.ford.labs.retroquest.password_reset_token.PasswordResetToken;
import com.ford.labs.retroquest.password_reset_token.PasswordResetTokenRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import javax.validation.Valid;
import java.io.IOException;
import java.net.URISyntaxException;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping(value = "/api/team")
@Tag(name = "Team Controller", description = "The controller that manages teams")
public class TeamController {

    private final TeamService teamService;
    private final JwtBuilder jwtBuilder;
    private final PasswordResetTokenRepository passwordResetRepository;

    private final EmailResetTokenRepository emailResetTokenRepository;
    private final PasswordEncoder passwordEncoder;

    public TeamController(
            TeamService teamService,
            JwtBuilder jwtBuilder,
            PasswordResetTokenRepository passwordResetRepository,
            EmailResetTokenRepository emailResetTokenRepository, PasswordEncoder passwordEncoder
    ) {
        this.teamService = teamService;
        this.jwtBuilder = jwtBuilder;
        this.passwordResetRepository = passwordResetRepository;
        this.emailResetTokenRepository = emailResetTokenRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping
    @Transactional(rollbackOn = URISyntaxException.class)
    @Operation(summary = "Creates a new team", description = "createTeam")
    @ApiResponses(value = {@ApiResponse(responseCode = "201", description = "Created")})
    public ResponseEntity<String> createTeam(@RequestBody @Valid CreateTeamRequest createTeamRequest) {
        var team = teamService.createNewTeam(createTeamRequest);
        var teamId = team.getUri();
        var jwt = jwtBuilder.buildJwt(teamId);

        var headers = new HttpHeaders();
        headers.add(HttpHeaders.LOCATION, teamId);

        return new ResponseEntity<>(jwt, headers, CREATED);
    }

    @GetMapping("/{teamId}")
    @Transactional(rollbackOn = URISyntaxException.class)
    @PreAuthorize("@teamAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Get an entire team by team id", description = "getTeam")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    public ResponseEntity<Team> getTeam(@PathVariable("teamId") String teamId){
        return ResponseEntity.ok(teamService.getTeamByUri(teamId));
    }

    @PutMapping("/{teamId}/email-addresses")
    @PreAuthorize("@teamAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Update one or both team email addresses", description = "updateEmailAddresses")
    public void updateEmailAddresses(@PathVariable("teamId") String teamId, @RequestBody UpdateTeamEmailAddressesRequest request) {
        teamService.updateTeamEmailAddresses(teamId, request);
    }

    @GetMapping("/{teamId}/name")
    @Operation(description = "Get a team name given the team id")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    public String getTeamName(@PathVariable("teamId") String teamUri) {
        return teamService.getTeamByUri(teamUri).getName();
    }

    @PostMapping("/password/reset")
    @Operation(description = "Use password reset token to update team password")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    public void resetPassword(@RequestBody ResetPasswordRequest resetPasswordRequest) {
        PasswordResetToken passwordResetToken = passwordResetRepository.findByResetToken(resetPasswordRequest.getResetToken());
        if(passwordResetToken == null || passwordResetToken.isExpired()) throw new BadResetTokenException();
        teamService.changePassword(passwordResetToken.getTeam(), passwordEncoder.encode(resetPasswordRequest.getPassword()));
        passwordResetRepository.delete(passwordResetToken);
    }

    @PostMapping("/email/reset")
    @Operation(description = "Use email reset token to update team email(s)")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    public void changeTeamEmailsWithEmailResetToken(@RequestBody ResetEmailsRequest resetEmailsRequest) {
        EmailResetToken emailResetToken = emailResetTokenRepository.findByResetToken(resetEmailsRequest.getResetToken());
        if(emailResetToken == null || emailResetToken.isExpired()) throw new BadResetTokenException();
        teamService.updateTeamEmailAddresses(
                emailResetToken.getTeam().getId(),
                new UpdateTeamEmailAddressesRequest(resetEmailsRequest.getEmail(), resetEmailsRequest.getSecondaryEmail())
        );
        emailResetTokenRepository.delete(emailResetToken);
    }

    @GetMapping(value = "/{teamId}/csv", produces = "application/board.csv")
    @PreAuthorize("@teamAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(description = "downloads a team board")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    public ResponseEntity<byte[]> downloadTeamBoard(@PathVariable("teamId") String teamId) throws IOException {
        var file = teamService.buildCsvFileFromTeam(teamId);
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + file.getFileName())
            .contentType(MediaType.parseMediaType("text/csv"))
            .body(file.getCsvString().getBytes());
    }

    @GetMapping(value = "/{teamId}/validate")
    @PreAuthorize("@teamAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(description = "Validates a team id")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    public ResponseEntity<Void> validateTeamId(@PathVariable("teamId") String teamId) {
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    @Operation(description = "Logs in a user given a login request")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    public ResponseEntity<String> login(@RequestBody @Valid LoginRequest team) {
        var savedTeamEntity = teamService.login(team);
        var teamId = savedTeamEntity.getUri();
        var jwt = jwtBuilder.buildJwt(teamId);

        var headers = new HttpHeaders();
        headers.add(HttpHeaders.LOCATION, teamId);

        return new ResponseEntity<>(jwt, headers, OK);
    }
}
