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
import com.ford.labs.retroquest.team.Team;
import com.ford.labs.retroquest.team.TeamRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;

import static org.assertj.core.api.Assertions.assertThat;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Tag("api")
public class EmailApiTest extends ApiTestBase {
    @Autowired
    private TeamRepository teamRepository;

    @MockBean
    private EmailService emailService;

    @AfterEach
    void clean() {
        teamRepository.deleteAllInBatch();
        assertThat(teamRepository.count()).isZero();
    }

    @Test
    void should_send_team_name_recovery_email_if_teams_with_email_are_found() throws Exception {
        String recoveryEmail = "recovery@mail.com";
        Team team1 = new Team("team-name-1", "Team Name 1", "P@ssword1", recoveryEmail);
        teamRepository.save(team1);
        Team team2 = new Team("team-name-2", "TeamName 2", "P@ssword2", "e@mail.com", recoveryEmail);
        teamRepository.save(team2);

        when(emailService.getTeamNameRecoveryEmailMessage(any(), any())).thenReturn("expectedMessage");

        mockMvc.perform(post("/api/email/recover-team-names")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsBytes(new RecoverTeamNamesRequest(recoveryEmail)))
                )
                .andExpect(status().isOk());

        verify(emailService).sendUnencryptedEmail("RetroQuest Teams Names Associated with your Account", "expectedMessage", recoveryEmail);
    }
}
