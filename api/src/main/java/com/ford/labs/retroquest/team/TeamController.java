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

import com.ford.labs.retroquest.api.authorization.ApiAuthorization;
import com.ford.labs.retroquest.security.JwtBuilder;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.MultiValueMap;
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
    private final CaptchaService captchaService;
    private final ApiAuthorization apiAuthorization;

    public TeamController(TeamService teamService,
                          JwtBuilder jwtBuilder,
                          CaptchaService captchaService,
                          ApiAuthorization apiAuthorization) {
        this.teamService = teamService;
        this.jwtBuilder = jwtBuilder;
        this.captchaService = captchaService;
        this.apiAuthorization = apiAuthorization;
    }

    @PostMapping("/team")
    @Transactional(rollbackOn = URISyntaxException.class)
    @Operation(summary = "Creates a new team", description = "createTeam")
    @ApiResponses(value = {@ApiResponse(responseCode = "201", description = "Created")})
    public ResponseEntity<String> createTeam(@RequestBody @Valid CreateTeamRequest createTeamRequest) {
        Team team = teamService.createNewTeam(createTeamRequest);

        MultiValueMap<String, String> headers = new HttpHeaders();
        headers.add("Location", "/team/" + team.getUri());

        String jwt = jwtBuilder.buildJwt(team.getUri());

        return new ResponseEntity<>(jwt, headers, CREATED);
    }

    @PostMapping("/update-password")
    @Transactional(rollbackOn = URISyntaxException.class)
    @PreAuthorize("#updatePasswordRequest.teamId == authentication.principal")
    @Operation(summary = "Resets a password for a team id", description = "updatePasswords")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    public ResponseEntity<String> updatePassword(@RequestBody @Valid UpdatePasswordRequest updatePasswordRequest) {
        teamService.updatePassword(updatePasswordRequest);
        return ResponseEntity.ok().body("Password Reset Successfully");
    }

    @GetMapping("/team/{teamUri}/name")
    @Operation(summary = "Gets a team name given the team uri", description = "getTeamName")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    public String getTeamName(@PathVariable("teamUri") String teamUri) {
        return teamService.getTeamByUri(teamUri).getName();
    }

    @GetMapping(value = "/team/{teamId}/csv", produces = "application/board.csv")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "downloads a team board", description = "downloadTeamBoard")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    public ResponseEntity<byte[]> downloadTeamBoard(@PathVariable("teamId") String teamId) throws IOException {
        CsvFile file = teamService.buildCsvFileFromTeam(teamId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + file.getFileName())
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(file.getCSVString().getBytes());
    }

    @GetMapping(value = "team/{teamId}/validate")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Validates a team id", description = "deprecated")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    public void validateTeamId(@PathVariable("teamId") String teamId) {
    }

    @PostMapping("/team/login")
    @Operation(summary = "Logs in a user given a login request", description = "deprecated")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    public ResponseEntity<String> login(@RequestBody @Valid LoginRequest team) {
        Team savedTeamEntity = teamService.login(team);
        String jwt = jwtBuilder.buildJwt(savedTeamEntity.getUri());

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.LOCATION, savedTeamEntity.getUri());

        return new ResponseEntity<>(jwt, headers, OK);
    }

    @GetMapping("/team/{teamName}/captcha")
    @Operation(summary = "returns whether captcha is enabled given a team name", description = "isCaptchaEnabledForTeam")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    public CaptchaResponse isCaptchaEnabledForTeam(@PathVariable("teamName") String teamName) {
        return new CaptchaResponse(captchaService.isCaptchaEnabledForTeam(teamName));
    }

    @GetMapping("/captcha")
    @Operation(summary = "Determines whether captcha is enabled globally for Retroquest", description = "isCaptchaEnabled")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    public CaptchaResponse isCaptchaEnabled() {
        return new CaptchaResponse(captchaService.isCaptchaEnabled());
    }
}
