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
package com.ford.labs.retroquest.api;

import com.ford.labs.retroquest.api.setup.ApiTestBase;
import com.ford.labs.retroquest.email.EmailService;
import com.ford.labs.retroquest.email.RecoverTeamNamesRequest;
import com.ford.labs.retroquest.email.ResetRequest;
import com.ford.labs.retroquest.email_reset_token.EmailResetToken;
import com.ford.labs.retroquest.email_reset_token.EmailResetTokenRepository;
import com.ford.labs.retroquest.password_reset_token.PasswordResetToken;
import com.ford.labs.retroquest.password_reset_token.PasswordResetTokenRepository;
import com.ford.labs.retroquest.team.Team;
import com.ford.labs.retroquest.team.TeamRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;

import static org.assertj.core.api.Assertions.assertThat;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Tag("api")
public class EmailApiTest extends ApiTestBase {
    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private EmailResetTokenRepository emailResetTokenRepository;

    @MockBean
    private EmailService emailService;

    private final String recoverTeamNamesPath = "/api/email/recover-team-names";
    private final String passwordResetRequestPath = "/api/email/password-reset-request";
    private final String emailResetRequestPath = "/api/email/email-reset-request";

    @AfterEach
    void clean() {
        teamRepository.deleteAllInBatch();
        assertThat(teamRepository.count()).isZero();
        passwordResetTokenRepository.deleteAllInBatch();
        assertThat(passwordResetTokenRepository.count()).isZero();
        emailResetTokenRepository.deleteAllInBatch();
        assertThat(emailResetTokenRepository.count()).isZero();
    }

    @Test
    void recover_team_names__should_send_email_if_teams_with_recovery_email_are_found() throws Exception {
        String recoveryEmail = "recovery@mail.com";
        Team team1 = new Team("team-name-1", "Team Name 1", "P@ssword1", recoveryEmail);
        teamRepository.save(team1);
        Team team2 = new Team("team-name-2", "TeamName 2", "P@ssword2", "e@mail.com", recoveryEmail);
        teamRepository.save(team2);

        when(emailService.getTeamNameRecoveryEmailMessage(any(), any())).thenReturn("expectedMessage");

        mockMvc.perform(post(recoverTeamNamesPath)
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsBytes(new RecoverTeamNamesRequest(recoveryEmail)))
                )
                .andExpect(status().isOk());

        verify(emailService).sendUnencryptedEmail("RetroQuest Teams Names Associated with your Account", "expectedMessage", recoveryEmail);
    }

    @Test
    void recover_team_names__should_not_send_email_when_no_teams_are_associated_with_recovery_email() throws Exception {
        String recoveryEmail = "recovery@mail.com";
        Team team1 = new Team("team-name-1", "Team Name 1", "P@ssword1", "a@b");
        teamRepository.save(team1);
        Team team2 = new Team("team-name-2", "TeamName 2", "P@ssword2", "e@mail.com", "b@d");
        teamRepository.save(team2);

        when(emailService.getTeamNameRecoveryEmailMessage(any(), any())).thenReturn("expectedMessage");

        mockMvc.perform(post(recoverTeamNamesPath)
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsBytes(new RecoverTeamNamesRequest(recoveryEmail)))
                )
                .andExpect(status().isBadRequest())
                .andExpect(status().reason("This email is not associated with any RetroQuest team."));

        verify(emailService, never()).sendUnencryptedEmail("RetroQuest Teams Names Associated with your Account", "expectedMessage", recoveryEmail);
    }

    @Test
    void password_reset_request__should_send_password_reset_request_email_when_team_is_valid() throws Exception {
        Team expectedResetTeam = new Team("teamuri", "TeamName", "%$&357", "e@ma.il");
        teamRepository.save(expectedResetTeam);
        when(emailService.getPasswordResetEmailMessage(any(), any())).thenReturn("expectedMessage");

        mockMvc.perform(post(passwordResetRequestPath).contentType(APPLICATION_JSON).content(objectMapper.writeValueAsBytes(new ResetRequest("TeamName", "e@ma.il"))))
                .andExpect(status().isOk());

        assertThat(passwordResetTokenRepository.count()).isEqualTo(1);
        PasswordResetToken actualToken = passwordResetTokenRepository.findByTeam(expectedResetTeam);
        assertThat(actualToken.getDateCreated()).isNotNull();
        assertThat(actualToken.getResetToken()).isNotBlank();

        verify(emailService).sendUnencryptedEmail("Your Password Reset Link From RetroQuest!", "expectedMessage", "e@ma.il");
    }

    @Test
    void password_reset_request__should_send_password_reset_request_email_using_secondary_email() throws Exception {
        Team expectedResetTeam = new Team("teamuri", "TeamName", "%$&357", "e@ma.il", "seconde@ma.il");
        teamRepository.save(expectedResetTeam);
        when(emailService.getPasswordResetEmailMessage(any(), any())).thenReturn("expectedMessage");

        mockMvc.perform(post(passwordResetRequestPath)
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsBytes(
                                new ResetRequest("TeamName", "seconde@ma.il"))))
                .andExpect(status().isOk());

        assertThat(passwordResetTokenRepository.count()).isEqualTo(1);
        PasswordResetToken actualToken = passwordResetTokenRepository.findByTeam(expectedResetTeam);
        assertThat(actualToken.getDateCreated()).isNotNull();
        assertThat(actualToken.getResetToken()).isNotBlank();

        verify(emailService).sendUnencryptedEmail("Your Password Reset Link From RetroQuest!", "expectedMessage", "seconde@ma.il");
    }

    @Test
    void password_reset_request__should_send_password_reset_request_email_using_secondary_email_ignoring_case() throws Exception {
        Team expectedResetTeam = new Team("teamuri", "TeamName", "%$&357", "e@ma.il", "seconde@ma.il");
        teamRepository.save(expectedResetTeam);
        when(emailService.getPasswordResetEmailMessage(any(), any())).thenReturn("expectedMessage");

        mockMvc.perform(post(passwordResetRequestPath)
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsBytes(
                                new ResetRequest("TeamName", "SecondE@MA.il"))))
                .andExpect(status().isOk());

        assertThat(passwordResetTokenRepository.count()).isEqualTo(1);
        PasswordResetToken actualToken = passwordResetTokenRepository.findByTeam(expectedResetTeam);
        assertThat(actualToken.getDateCreated()).isNotNull();
        assertThat(actualToken.getResetToken()).isNotBlank();

        verify(emailService).sendUnencryptedEmail("Your Password Reset Link From RetroQuest!", "expectedMessage", "SecondE@MA.il");
    }

    @Test
    void password_reset_request__should_send_a_second_password_reset_request_email_when_team_is_valid() throws Exception {
        Team expectedResetTeam = new Team("teamuri", "TeamName", "%$&357", "e@ma.il");
        teamRepository.save(expectedResetTeam);

        mockMvc.perform(post(passwordResetRequestPath).contentType(APPLICATION_JSON).content(objectMapper.writeValueAsBytes(new ResetRequest("TeamName", "e@ma.il"))))
                .andExpect(status().isOk());

        mockMvc.perform(post(passwordResetRequestPath).contentType(APPLICATION_JSON).content(objectMapper.writeValueAsBytes(new ResetRequest("TeamName", "e@ma.il"))))
                .andExpect(status().isOk());

        assertThat(passwordResetTokenRepository.count()).isEqualTo(1);
    }

    @Test
    void password_reset_request__should_not_create_password_reset_request_when_team_is_invalid() throws Exception {
        Team expectedResetTeam = new Team("teamuri", "TeamName", "%$&357", "e@ma.il");
        teamRepository.save(expectedResetTeam);

        mockMvc.perform(post(passwordResetRequestPath).contentType(APPLICATION_JSON).content(objectMapper.writeValueAsBytes(new ResetRequest("NotTeamName", "e@ma.il"))))
                .andExpect(status().isForbidden());

        assertThat(passwordResetTokenRepository.count()).isEqualTo(0);
    }

    @Test
    void email_reset_request__should_send_email_reset_request_email_when_team_is_valid() throws Exception {
        Team expectedResetTeam = new Team("teamuri", "TeamName", "%$&357", "e@ma.il");
        teamRepository.save(expectedResetTeam);
        when(emailService.getResetTeamEmailMessage(any(), any())).thenReturn("expectedMessage");

        mockMvc.perform(post(emailResetRequestPath).contentType(APPLICATION_JSON).content(objectMapper.writeValueAsBytes(new ResetRequest("TeamName", "e@ma.il"))))
                .andExpect(status().isOk());

        assertThat(emailResetTokenRepository.count()).isEqualTo(1);
        EmailResetToken actualToken = emailResetTokenRepository.findByTeam(expectedResetTeam);
        assertThat(actualToken.getDateCreated()).isNotNull();
        assertThat(actualToken.getResetToken()).isNotBlank();

        verify(emailService).sendUnencryptedEmail("RetroQuest Board Owner Update Request!", "expectedMessage", "e@ma.il");
    }

    @Test
    void email_reset_request__should_send_email_reset_request_email_using_secondary_email() throws Exception {
        Team expectedResetTeam = new Team("teamuri", "TeamName", "%$&357", "e@ma.il", "seconde@ma.il");
        teamRepository.save(expectedResetTeam);
        when(emailService.getResetTeamEmailMessage(any(), any())).thenReturn("expectedMessage");

        mockMvc.perform(post(emailResetRequestPath)
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsBytes(
                                new ResetRequest("TeamName", "seconde@ma.il"))))
                .andExpect(status().isOk());

        assertThat(emailResetTokenRepository.count()).isEqualTo(1);
        EmailResetToken actualToken = emailResetTokenRepository.findByTeam(expectedResetTeam);
        assertThat(actualToken.getDateCreated()).isNotNull();
        assertThat(actualToken.getResetToken()).isNotBlank();

        verify(emailService).sendUnencryptedEmail("RetroQuest Board Owner Update Request!", "expectedMessage", "seconde@ma.il");
    }

    @Test
    void email_reset_request__should_send_email_reset_request_email_using_secondary_email_ignoring_case() throws Exception {
        Team expectedResetTeam = new Team("teamuri", "TeamName", "%$&357", "e@ma.il", "seconde@ma.il");
        teamRepository.save(expectedResetTeam);
        when(emailService.getResetTeamEmailMessage(any(), any())).thenReturn("expectedMessage");

        mockMvc.perform(post(emailResetRequestPath)
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsBytes(
                                new ResetRequest("TeamName", "SecondE@MA.il"))))
                .andExpect(status().isOk());

        assertThat(emailResetTokenRepository.count()).isEqualTo(1);
        EmailResetToken actualToken = emailResetTokenRepository.findByTeam(expectedResetTeam);
        assertThat(actualToken.getDateCreated()).isNotNull();
        assertThat(actualToken.getResetToken()).isNotBlank();

        verify(emailService).sendUnencryptedEmail("RetroQuest Board Owner Update Request!", "expectedMessage", "SecondE@MA.il");
    }

    @Test
    void email_reset_request__should_send_a_second_email_reset_request_email_when_team_is_valid() throws Exception {
        Team expectedResetTeam = new Team("teamuri", "TeamName", "%$&357", "e@ma.il");
        teamRepository.save(expectedResetTeam);

        mockMvc.perform(post(emailResetRequestPath).contentType(APPLICATION_JSON).content(objectMapper.writeValueAsBytes(new ResetRequest("TeamName", "e@ma.il"))))
                .andExpect(status().isOk());

        mockMvc.perform(post(emailResetRequestPath).contentType(APPLICATION_JSON).content(objectMapper.writeValueAsBytes(new ResetRequest("TeamName", "e@ma.il"))))
                .andExpect(status().isOk());

        assertThat(emailResetTokenRepository.count()).isEqualTo(1);
    }

    @Test
    void email_reset_request__should_not_create_email_reset_request_when_team_is_invalid() throws Exception {
        Team expectedResetTeam = new Team("teamuri", "TeamName", "%$&357", "e@ma.il");
        teamRepository.save(expectedResetTeam);

        mockMvc.perform(post(emailResetRequestPath).contentType(APPLICATION_JSON).content(objectMapper.writeValueAsBytes(new ResetRequest("NotTeamName", "e@ma.il"))))
                .andExpect(status().isForbidden());

        assertThat(emailResetTokenRepository.count()).isEqualTo(0);
    }
}
