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
import com.ford.labs.retroquest.column.ColumnRepository;
import com.ford.labs.retroquest.team.CreateTeamRequest;
import com.ford.labs.retroquest.team.Team;
import com.ford.labs.retroquest.team.TeamRepository;
import io.micrometer.core.instrument.MeterRegistry;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Tag("api")
class TeamApiTest extends ApiTestBase {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private ColumnRepository columnRepository;

    @Autowired
    private TestRestTemplate testRestTemplate;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    private MeterRegistry meterRegistry;

    private static final String VALID_PASSWORD = "Passw0rd";
    private static final String VALID_EMAIL = "e@ma.il";
    private CreateTeamRequest.CreateTeamRequestBuilder validTeamRequestBuilder;

    private final String changeEmailsWithResetTokenPath = "/api/team/email/reset";
    private final String changePasswordWithResetTokenPath = "/api/team/password/reset";

    @BeforeEach
    void beforeClass() {
        clean();
        validTeamRequestBuilder = CreateTeamRequest.builder().name(teamId).password(VALID_PASSWORD);
    }

    @AfterEach
    void clean() {
        teamRepository.deleteAllInBatch();
        columnRepository.deleteAllInBatch();
        assertThat(teamRepository.count()).isZero();
        assertThat(columnRepository.count()).isZero();
    }

    @Test
    void should_create_team_and_update_metric() throws Exception {
        meterRegistry.gauge("retroquest.teams.count", 0);

        var mvcResult = mockMvc.perform(post("/api/team")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsBytes(validTeamRequestBuilder.build())))
                .andExpect(status().isCreated())
                .andReturn();

        assertThat(mvcResult.getResponse().getHeader(HttpHeaders.LOCATION))
                .isEqualTo("beachbums");
        assertThat(meterRegistry.get("retroquest.teams.count").gauge().value())
                .isEqualTo(1);
    }

    @Test
    void should_get_team() throws Exception {
        Team expectedResetTeam = new Team("team-id", "TeamName", "%$&357");
        teamRepository.save(expectedResetTeam);

        MvcResult resultOfGet = mockMvc.perform(
            get("/api/team/team-id")
                .header("Authorization", "Bearer valid-token")
        ).andExpect(status().isOk()).andReturn();
        String content = resultOfGet.getResponse().getContentAsString();
        assertThat(content).contains("\"name\":\"TeamName\"");
        assertThat(content).contains("\"email\":\"e@ma.il\"");
        assertThat(content).contains("\"secondaryEmail\":null");
        assertThat(content).contains("\"id\":\"team-id\"");
        assertThat(content).doesNotContain("password");
    }

    @Test
    void should_not_get_team_with_nonexistent_id() throws Exception {
        mockMvc.perform(get("/api/team/nonExistentTeamId")
                        .header("Authorization", "Bearer valid-token"))
                .andExpect(status().isForbidden())
                .andExpect(status().reason("Incorrect team name or password. Please try again."));
    }

    @Test
    void should_create_team_with_valid_name_and_password() throws Exception {
        var sentCreateTeamRequest = validTeamRequestBuilder
                .build();

        var mvcResult = mockMvc.perform(post("/api/team")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsBytes(sentCreateTeamRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        var team = teamRepository.findById(sentCreateTeamRequest.getName().toLowerCase()).orElseThrow();

        assertThat(team.getName()).isEqualTo(teamId);
        assertThat(team.getUri()).isEqualTo(teamId.toLowerCase());
        assertThat(team.getPassword()).hasSize(60);
        assertThat(mvcResult.getResponse().getContentAsString()).isNotNull();
    }

    @Test
    void should_not_create_team_with_empty_password() throws Exception {
        var sentCreateTeamRequest = validTeamRequestBuilder.password("")
                .build();

        mockMvc.perform(post("/api/team")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsBytes(sentCreateTeamRequest)))
                .andExpect(status().reason(containsString("Password must be 8 characters or longer.")))
                .andExpect(status().isBadRequest());
    }

    @Test
    void should_not_create_team_with_empty_name() throws Exception {
        var sentCreateTeamRequest = validTeamRequestBuilder.name("")
                .build();

        mockMvc.perform(post("/api/team")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsBytes(sentCreateTeamRequest)))
                .andExpect(status()
                        .reason(containsString("Please enter a team name.")))
                .andExpect(status().isBadRequest());
    }

    @Test
    void should_not_create_team_with_special_characters_in_name() throws Exception {
        var sentCreateTeamRequest = validTeamRequestBuilder
                .name("The@Mild$Ones")
                .build();

        mockMvc.perform(post("/api/team")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsBytes(sentCreateTeamRequest)))
                .andExpect(status().reason(containsString("Please enter a team name without any special characters.")))
                .andExpect(status().isBadRequest());
    }

    @Test
    void should_not_create_team_with_duplicate_name() throws Exception {
        var sentCreateTeamRequest = validTeamRequestBuilder.build();

        teamRepository.save(Team.builder()
                .uri(sentCreateTeamRequest.getName().toLowerCase())
                .name(sentCreateTeamRequest.getName())
                .password(sentCreateTeamRequest.getPassword())
                .build());

        mockMvc.perform(post("/api/team")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsBytes(sentCreateTeamRequest)))
                .andExpect(status().reason(containsString("This team name is already in use. Please try another one.")))
                .andExpect(status().isConflict());
    }

    @Test
    void should_not_create_team_with_duplicate_lower_case_name() throws Exception {
        var upperCaseCreateTeamRequest = validTeamRequestBuilder
                .build();

        var lowerCaseCreateTeamRequest = upperCaseCreateTeamRequest.toBuilder().name(upperCaseCreateTeamRequest.getName().toLowerCase()).build();

        teamRepository.save(Team.builder()
                .uri(upperCaseCreateTeamRequest.getName().toLowerCase())
                .name(upperCaseCreateTeamRequest.getName())
                .password(upperCaseCreateTeamRequest.getPassword())
                .build());

        mockMvc.perform(post("/api/team")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsBytes(lowerCaseCreateTeamRequest)))
                .andExpect(status().reason(containsString("This team name is already in use. Please try another one.")))
                .andExpect(status().isConflict());
    }

    @Test
    void should_not_create_team_with_duplicate_upper_case_name() throws Exception {
        var upperCaseCreateTeamRequest = validTeamRequestBuilder
                .build();

        var lowerCaseCreateTeamRequest = upperCaseCreateTeamRequest.toBuilder().name(upperCaseCreateTeamRequest.getName().toLowerCase()).build();

        teamRepository.save(Team.builder()
                .uri(lowerCaseCreateTeamRequest.getName().toLowerCase())
                .name(lowerCaseCreateTeamRequest.getName())
                .password(lowerCaseCreateTeamRequest.getPassword())
                .build());

        mockMvc.perform(post("/api/team")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsBytes(upperCaseCreateTeamRequest)))
                .andExpect(status().reason(containsString("This team name is already in use. Please try another one.")))
                .andExpect(status().isConflict());
    }

    @Test
    void should_not_create_team_with_duplicate_with_leading_spaces() throws Exception {
        var createTeamRequest = validTeamRequestBuilder
                .build();

        var leadingSpacesRequest = createTeamRequest.toBuilder().name("    " + createTeamRequest.getName()).build();

        teamRepository.save(Team.builder()
                .uri(createTeamRequest.getName().toLowerCase())
                .name(createTeamRequest.getName())
                .password(createTeamRequest.getPassword())
                .build());

        mockMvc.perform(post("/api/team")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsBytes(leadingSpacesRequest)))
                .andExpect(status().reason(containsString("This team name is already in use. Please try another one.")))
                .andExpect(status().isConflict());
    }

    @Test
    void should_not_create_team_with_duplicate_with_trailing_spaces() throws Exception {
        var createTeamRequest = validTeamRequestBuilder
                .build();

        var trailingSpacesRequest = createTeamRequest.toBuilder().name(createTeamRequest.getName() + "    ").build();

        teamRepository.save(Team.builder()
                .uri(createTeamRequest.getName().toLowerCase())
                .name(createTeamRequest.getName())
                .password(createTeamRequest.getPassword())
                .build());

        mockMvc.perform(post("/api/team")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsBytes(trailingSpacesRequest)))
                .andExpect(status().reason(containsString("This team name is already in use. Please try another one.")))
                .andExpect(status().isConflict());
    }

    @Test
    void should_create_team_with_leading_spaces_dropped_from_team_name_and_uri() throws Exception {
        var sentCreateTeamRequest = validTeamRequestBuilder
                .name("    " + teamId)
                .build();

        var mvcResult = mockMvc.perform(post("/api/team")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsBytes(sentCreateTeamRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        var team = teamRepository.findById(sentCreateTeamRequest.getName().trim().toLowerCase()).orElseThrow();

        assertThat(team.getName()).isEqualTo(teamId);
        assertThat(team.getUri()).isEqualTo(teamId.toLowerCase());
        assertThat(team.getPassword()).hasSize(60);
        assertThat(mvcResult.getResponse().getContentAsString()).isNotNull();
    }

    @Test
    void should_create_team_with_trailing_spaces_dropped_from_team_name_and_uri() throws Exception {
        var sentCreateTeamRequest = validTeamRequestBuilder
                .name(teamId + "    ")
                .build();

        var mvcResult = mockMvc.perform(post("/api/team")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsBytes(sentCreateTeamRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        var team = teamRepository.findById(sentCreateTeamRequest.getName().trim().toLowerCase()).orElseThrow();

        assertThat(team.getName()).isEqualTo(teamId);
        assertThat(team.getUri()).isEqualTo(teamId.toLowerCase());
        assertThat(team.getPassword()).hasSize(60);
        assertThat(mvcResult.getResponse().getContentAsString()).isNotNull();
    }

    @Test
    void should_get_team_name() throws Exception {
        var expectedName = "Beachity Bums";

        var createTeamRequest = validTeamRequestBuilder
                .name(expectedName)
                .build();

        testRestTemplate.postForObject("/api/team/", createTeamRequest, String.class);

        var actualName = mockMvc.perform(get("/api/team/beachity-bums/name")
                        .header("Authorization", "Bearer valid-token"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        assertThat(actualName).isEqualTo(expectedName);
    }

    @Test
    void should_not_get_team_name_with_nonexistant_name() throws Exception {
        mockMvc.perform(get("/api/team/nonExistentTeamName/name"))
                .andExpect(status().isForbidden())
                .andExpect(status().reason("Incorrect team name or password. Please try again."));
    }
}
