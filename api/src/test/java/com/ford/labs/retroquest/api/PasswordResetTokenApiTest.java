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
import com.ford.labs.retroquest.password_reset_token.PasswordResetToken;
import com.ford.labs.retroquest.password_reset_token.PasswordResetTokenRepository;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Tag("api")
class PasswordResetTokenApiTest extends ApiTestBase {

    @Autowired
    private PasswordResetTokenRepository passwordResetRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    private final String passwordResetTokenRootPath = "/api/password-reset-token";

    private Team team;

    @BeforeEach
    void beforeClass() {
        clean();
        team = new Team("teamuri", "TeamName", "%$&357", "e@ma.il");
        teamRepository.save(team);
    }

    @AfterEach
    void clean() {
        passwordResetRepository.deleteAllInBatch();
        teamRepository.deleteAllInBatch();
        assertThat(passwordResetRepository.count()).isZero();
        assertThat(teamRepository.count()).isZero();
    }

    @Test
    public void get_reset_token_validity_seconds__shouldReportCorrectPasswordTokenExpirationTime() throws Exception {
        String tokenLifeTimePath = passwordResetTokenRootPath + "/lifetime-in-seconds";
        MvcResult mvcResult = mockMvc.perform(get(tokenLifeTimePath)).andExpect(status().isOk()).andReturn();
        assertThat(mvcResult.getResponse().getContentAsString()).isEqualTo("600");
    }

    @Test
    void check_reset_token_status__should_return_true_when_password_reset_token_is_valid() throws Exception {
        PasswordResetToken passwordResetToken = new PasswordResetToken();
        passwordResetToken.setTeam(team);
        passwordResetRepository.save(passwordResetToken);

        var mvcResult = mockMvc.perform(get(getIsResetTokenValidPath(passwordResetToken)))
                .andExpect(status().is2xxSuccessful())
                .andReturn();

        assertThat(mvcResult.getResponse().getContentAsString()).isEqualTo("true");
    }

    @Test
    void check_reset_token_status__should_return_false_when_password_reset_token_is_expired() throws Exception {
        PasswordResetToken passwordResetToken = new PasswordResetToken();
        passwordResetToken.setDateCreated(LocalDateTime.MIN);
        passwordResetToken.setTeam(team);
        passwordResetRepository.save(passwordResetToken);

        var mvcResult = mockMvc.perform(get(getIsResetTokenValidPath(passwordResetToken)))
                .andExpect(status().is2xxSuccessful())
                .andReturn();

        assertThat(mvcResult.getResponse().getContentAsString()).isEqualTo("false");
    }

    @Test
    void check_reset_token_status__should_return_false_when_password_reset_token_does_not_exist() throws Exception {
        PasswordResetToken passwordResetToken = new PasswordResetToken();
        passwordResetToken.setDateCreated(LocalDateTime.MIN);
        passwordResetToken.setTeam(team);
        passwordResetRepository.save(passwordResetToken);

        var mvcResult = mockMvc.perform(get(getIsResetTokenValidPath(passwordResetToken)))
                .andExpect(status().is2xxSuccessful())
                .andReturn();

        assertThat(mvcResult.getResponse().getContentAsString()).isEqualTo("false");
    }

    private String getIsResetTokenValidPath(PasswordResetToken passwordResetToken) {
        return passwordResetTokenRootPath + "/" + passwordResetToken.getResetToken() + "/is-valid";
    }
}
