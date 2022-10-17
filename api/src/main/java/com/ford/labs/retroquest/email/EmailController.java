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

package com.ford.labs.retroquest.email;

import com.ford.labs.retroquest.email_reset_token.EmailResetToken;
import com.ford.labs.retroquest.email_reset_token.EmailResetTokenService;
import com.ford.labs.retroquest.exception.EmailNotAssociatedWithAnyTeamsException;
import com.ford.labs.retroquest.exception.TeamDoesNotExistException;
import com.ford.labs.retroquest.password_reset_token.PasswordResetToken;
import com.ford.labs.retroquest.password_reset_token.PasswordResetTokenService;
import com.ford.labs.retroquest.team.Team;
import com.ford.labs.retroquest.team.TeamService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(value = "/api/email")
public class EmailController {

    private final TeamService teamService;

    private final EmailService emailService;

    private final PasswordResetTokenService passwordResetTokenService;

    private final EmailResetTokenService emailResetTokenService;

    public EmailController(TeamService teamService, EmailService emailService, PasswordResetTokenService passwordResetTokenService, EmailResetTokenService emailResetTokenService) {
        this.teamService = teamService;
        this.emailService = emailService;
        this.passwordResetTokenService = passwordResetTokenService;
        this.emailResetTokenService = emailResetTokenService;
    }

    @PostMapping("/recover-team-names")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    @Operation(description = "Send team name recovery email")
    public void sendRecoverTeamNamesEmail(@RequestBody RecoverTeamNamesRequest recoverTeamNamesRequest) {
        String recoveryEmail = recoverTeamNamesRequest.getRecoveryEmail();
        List<Team> teams = teamService.getTeamsByEmail(recoveryEmail);

        if (teams.isEmpty()) throw new EmailNotAssociatedWithAnyTeamsException();

        List<String> teamNames = new ArrayList<>();
        for (Team t : teams) { teamNames.add(t.getName()); }

        emailService.sendUnencryptedEmail(
                "RetroQuest Teams Names Associated with your Account",
                emailService.getTeamNameRecoveryEmailMessage(recoveryEmail, teamNames),
                recoveryEmail
        );
    }

    @PostMapping("/password-reset-request")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    @Operation(description = "Send email with team password reset link")
    public void requestTeamPasswordReset(@RequestBody ResetRequest passwordResetRequest){
        Team team = teamService.getTeamByName(passwordResetRequest.getTeamName());
        if(team != null && teamService.isEmailOnTeam(team, passwordResetRequest.getEmail())) {
            PasswordResetToken passwordResetToken = passwordResetTokenService.getNewPasswordResetToken(team);

            emailService.sendUnencryptedEmail(
                    "Your Password Reset Link From RetroQuest!",
                    emailService.getPasswordResetEmailMessage(passwordResetToken, passwordResetRequest),
                    passwordResetRequest.getEmail()
            );
        }
        else throw new TeamDoesNotExistException();
    }

    @PostMapping("/email-reset-request")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    @Operation(description = "Send email with team email reset link")
    public void requestTeamEmailReset(@RequestBody ResetRequest emailResetRequest){
        Team team = teamService.getTeamByName(emailResetRequest.getTeamName());
        if (team != null && teamService.isEmailOnTeam(team, emailResetRequest.getEmail())) {
            emailResetTokenService.deleteAllExpiredTokensByTeam(team);
            EmailResetToken emailResetToken = emailResetTokenService.getNewEmailResetToken(team);

            emailService.sendUnencryptedEmail(
                    "RetroQuest Board Owner Update Request!",
                    emailService.getResetTeamEmailMessage(emailResetToken, emailResetRequest),
                    emailResetRequest.getEmail()
            );
        }
        else throw new TeamDoesNotExistException();
    }
}
