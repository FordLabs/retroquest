/*
 * Copyright (c) 2021 Ford Motor Company
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

import com.ford.labs.retroquest.email.EmailService;
import com.ford.labs.retroquest.exception.BadResetTokenException;
import com.ford.labs.retroquest.exception.TeamDoesNotExistException;
import com.ford.labs.retroquest.security.JwtBuilder;
import com.ford.labs.retroquest.team.password.PasswordResetToken;
import com.ford.labs.retroquest.team.password.PasswordResetTokenRepository;
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
@RequestMapping(value = "/api")
@Tag(name = "Team Controller", description = "The controller that manages team boards")
public class TeamController {

    private final TeamService teamService;
    private final JwtBuilder jwtBuilder;
    private final PasswordResetTokenRepository passwordResetRepository;

    private final PasswordEncoder passwordEncoder;

    private final EmailService emailService;

    public TeamController(TeamService teamService, JwtBuilder jwtBuilder, PasswordResetTokenRepository passwordResetRepository, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.teamService = teamService;
        this.jwtBuilder = jwtBuilder;
        this.passwordResetRepository = passwordResetRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @PostMapping("/team")
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

    @GetMapping("/team/{teamUri}/name")
    @Operation(summary = "Gets a team name given the team uri", description = "getTeamName")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    public String getTeamName(@PathVariable("teamUri") String teamUri) {
        return teamService.getTeamByUri(teamUri).getName();
    }

    @PostMapping("/password/request-reset")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    public void requestPasswordReset(@RequestBody RequestPasswordResetRequest requestPasswordResetRequest){
        Team team = teamService.getTeamByName(requestPasswordResetRequest.getTeamName());
        if(team != null && TeamService.isEmailOnTeam(team, requestPasswordResetRequest.getEmail())) {
            PasswordResetToken passwordResetToken = new PasswordResetToken();
            passwordResetToken.setTeam(team);
            passwordResetRepository.deleteAllByTeam(team);
            passwordResetRepository.save(passwordResetToken);

            emailService.sendUnencryptedEmail(
                    "Your password reset link from RetroQuest!",
                    emailService.getPasswordResetMessage(passwordResetToken, requestPasswordResetRequest),
                    requestPasswordResetRequest.getEmail()
            );
        }
        else throw new TeamDoesNotExistException();
    }

    @PostMapping("/password/reset")
    public void resetPassword(@RequestBody ResetPasswordRequest resetPasswordRequest) {
        PasswordResetToken passwordResetToken = passwordResetRepository.findByResetToken(resetPasswordRequest.getResetToken());
        if(passwordResetToken == null || passwordResetToken.isExpired()) throw new BadResetTokenException();
        teamService.changePassword(passwordResetToken.getTeam(), passwordEncoder.encode(resetPasswordRequest.getPassword()));
        passwordResetRepository.delete(passwordResetToken);
    }

    @PostMapping("/password/reset/is-valid")
    public boolean checkResetTokenStatus(@RequestBody ResetTokenStatusRequest resetTokenStatusRequest) {
        PasswordResetToken passwordResetToken = passwordResetRepository.findByResetToken(resetTokenStatusRequest.getResetToken());
        if (passwordResetToken == null) return false;
        return !passwordResetToken.isExpired();
    }

    @GetMapping(value = "/team/{teamId}/csv", produces = "application/board.csv")
    @PreAuthorize("@teamAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "downloads a team board", description = "downloadTeamBoard")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    public ResponseEntity<byte[]> downloadTeamBoard(@PathVariable("teamId") String teamId) throws IOException {
        var file = teamService.buildCsvFileFromTeam(teamId);
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + file.getFileName())
            .contentType(MediaType.parseMediaType("text/csv"))
            .body(file.getCsvString().getBytes());
    }

    @GetMapping(value = "team/{teamId}/validate")
    @PreAuthorize("@teamAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Validates a team id", description = "deprecated")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    public ResponseEntity<Void> validateTeamId(@PathVariable("teamId") String teamId) {
        return ResponseEntity.ok().build();
    }

    @PostMapping("/team/login")
    @Operation(summary = "Logs in a user given a login request", description = "deprecated")
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
