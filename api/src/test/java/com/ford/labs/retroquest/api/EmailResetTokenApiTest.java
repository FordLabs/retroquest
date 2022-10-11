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
import com.ford.labs.retroquest.email_reset_token.EmailResetToken;
import com.ford.labs.retroquest.email_reset_token.EmailResetTokenRepository;
import com.ford.labs.retroquest.team.Team;
import com.ford.labs.retroquest.team.TeamRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Tag("api")
class EmailResetTokenApiTest extends ApiTestBase {

    @Autowired
    private EmailResetTokenRepository emailResetTokenRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    private final String emailResetTokenRootPath = "/api/email-reset-token";

    private Team team;

    @BeforeEach
    void beforeClass() {
        clean();
        team = new Team("team-id", "TeamName", "%$&357", "e@ma.il");
        teamRepository.save(team);
    }

    @AfterEach
    void clean() {
        emailResetTokenRepository.deleteAllInBatch();
        teamRepository.deleteAllInBatch();
        assertThat(emailResetTokenRepository.count()).isZero();
        assertThat(teamRepository.count()).isZero();
    }

    @Test
    public void get_reset_token_validity_seconds__shouldReportCorrectPasswordTokenExpirationTime() throws Exception {
        String tokenLifeTimePath = emailResetTokenRootPath + "/lifetime-in-seconds";
        MvcResult mvcResult = mockMvc.perform(get(tokenLifeTimePath)).andExpect(status().isOk()).andReturn();
        assertThat(mvcResult.getResponse().getContentAsString()).isEqualTo("600");
    }

    @Test
    void check_reset_token_status__should_return_true_when_password_reset_token_is_valid() throws Exception {
        EmailResetToken emailResetToken = new EmailResetToken();
        emailResetToken.setTeam(team);
        emailResetTokenRepository.save(emailResetToken);

        var mvcResult = mockMvc.perform(get(getIsResetTokenValidPath(emailResetToken)))
                .andExpect(status().is2xxSuccessful())
                .andReturn();

        assertThat(mvcResult.getResponse().getContentAsString()).isEqualTo("true");
    }

    @Test
    void check_reset_token_status__should_return_false_when_email_reset_token_is_expired() throws Exception {
        EmailResetToken emailResetToken = new EmailResetToken();
        emailResetToken.setDateCreated(LocalDateTime.MIN);
        emailResetToken.setTeam(team);
        emailResetTokenRepository.save(emailResetToken);

        var mvcResult = mockMvc.perform(get(getIsResetTokenValidPath(emailResetToken)))
                .andExpect(status().is2xxSuccessful())
                .andReturn();

        assertThat(mvcResult.getResponse().getContentAsString()).isEqualTo("false");
    }

    @Test
    void check_reset_token_status__should_return_false_when_email_reset_token_does_not_exist() throws Exception {
        EmailResetToken emailResetToken = new EmailResetToken();
        emailResetToken.setDateCreated(LocalDateTime.MIN);
        emailResetToken.setTeam(team);
        emailResetTokenRepository.save(emailResetToken);

        var mvcResult = mockMvc.perform(get(getIsResetTokenValidPath(emailResetToken)))
                .andExpect(status().is2xxSuccessful())
                .andReturn();

        assertThat(mvcResult.getResponse().getContentAsString()).isEqualTo("false");
    }

    @Test
    void get_team_by_email_reset_token__should_get_team_successfully() throws Exception {
        EmailResetToken emailResetToken = new EmailResetToken();
        emailResetToken.setTeam(team);
        emailResetTokenRepository.save(emailResetToken);

        var resultOfGet = mockMvc.perform(get(getTeamByResetTokenPath(emailResetToken.getResetToken())))
                .andExpect(status().is2xxSuccessful())
                .andReturn();

        String content = resultOfGet.getResponse().getContentAsString();
        assertThat(content).contains("\"name\":\"TeamName\"");
        assertThat(content).contains("\"email\":\"e@ma.il\"");
        assertThat(content).contains("\"secondaryEmail\":null");
        assertThat(content).contains("\"id\":\"team-id\"");
        assertThat(content).doesNotContain("password");
    }

    @Test
    void get_team_by_email_reset_token__should_throw_error_when_token_does_not_exist() throws Exception {
        var resultOfGet = mockMvc.perform(get(getTeamByResetTokenPath("non-existant-reset-token")))
                .andExpect(status().isBadRequest())
                .andExpect(status().reason("Reset token incorrect or expired."))
                .andReturn();

        String content = resultOfGet.getResponse().getContentAsString();
        assertThat(content).isEmpty();
    }

    @Test
    void get_team_by_email_reset_token__should_throw_error_when_token_is_expired() throws Exception {
        EmailResetToken expiredEmailResetToken = new EmailResetToken();
        expiredEmailResetToken.setDateCreated(LocalDateTime.MIN);
        expiredEmailResetToken.setTeam(team);
        emailResetTokenRepository.save(expiredEmailResetToken);

        var resultOfGet = mockMvc.perform(get(getTeamByResetTokenPath(expiredEmailResetToken.getResetToken())))
                .andExpect(status().isBadRequest())
                .andExpect(status().reason("Reset token incorrect or expired."))
                .andReturn();

        String content = resultOfGet.getResponse().getContentAsString();
        assertThat(content).isEmpty();
    }

    private String getIsResetTokenValidPath(EmailResetToken emailResetToken) {
        return emailResetTokenRootPath + "/" + emailResetToken.getResetToken() + "/is-valid";
    }

    private String getTeamByResetTokenPath(String emailResetToken) {
        return emailResetTokenRootPath + "/" + emailResetToken + "/team";
    }
}
