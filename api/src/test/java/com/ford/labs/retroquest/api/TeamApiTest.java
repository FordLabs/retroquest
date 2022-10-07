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
import com.ford.labs.retroquest.email.RequestPasswordResetRequest;
import com.ford.labs.retroquest.team.*;
import com.ford.labs.retroquest.team.password.PasswordResetToken;
import com.ford.labs.retroquest.team.password.PasswordResetTokenRepository;
import io.micrometer.core.instrument.MeterRegistry;
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Tag("api")
class TeamApiTest extends ApiTestBase {

    @Autowired
    private PasswordResetTokenRepository passwordResetRepository;

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

    @BeforeEach
    void beforeClass() {
        clean();
        validTeamRequestBuilder = CreateTeamRequest.builder()
                .name(teamId)
                .password(VALID_PASSWORD)
                .email(VALID_EMAIL);
    }

    @AfterEach
    void clean() {
        passwordResetRepository.deleteAllInBatch();
        teamRepository.deleteAllInBatch();
        columnRepository.deleteAllInBatch();
        assertThat(passwordResetRepository.count()).isZero();
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

        assertThat(mvcResult.getResponse().getContentAsString())
                .isEqualTo(jwtBuilder.buildJwt("beachbums"));

        assertThat(meterRegistry.get("retroquest.teams.count").gauge().value())
                .isEqualTo(1);
    }

    @Test
    void should_get_team() throws Exception {
        Team expectedResetTeam = new Team("team-id", "TeamName", "%$&357", "e@ma.il");
        teamRepository.save(expectedResetTeam);

        MvcResult resultOfGet = mockMvc.perform(
            get("/api/team/team-id")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("team-id"))
        ).andExpect(status().isOk()).andReturn();
        String content = resultOfGet.getResponse().getContentAsString();
        assertThat(content).contains("\"name\":\"TeamName\"");
        assertThat(content).contains("\"email\":\"e@ma.il\"");
        assertThat(content).contains("\"secondaryEmail\":null");
        assertThat(content).contains("\"id\":\"team-id\"");
        assertThat(content).doesNotContain("password");
    }

    @Test
    void should_update_both_team_primary_email_address() throws Exception {
        Team expectedResetTeam = new Team("team-id", "TeamName", "%$&357", "");
        teamRepository.save(expectedResetTeam);

        mockMvc.perform(
                put("/api/team/team-id/email-addresses")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new UpdateTeamEmailAddressesRequest("primary@mail.com", null)))
                        .header("Authorization", "Bearer " + jwtBuilder.buildJwt("team-id"))
        ).andExpect(status().isOk()).andReturn();

        var updatedTeam = teamRepository.findTeamByUri(expectedResetTeam.getUri()).orElseThrow();
        assertThat(updatedTeam.getName()).contains("TeamName");
        assertThat(updatedTeam.getEmail()).contains("primary@mail.com");
        assertThat(updatedTeam.getSecondaryEmail()).isNull();
    }

    @Test
    void should_update_both_team_email_addresses() throws Exception {
        Team expectedResetTeam = new Team("team-id", "TeamName", "%$&357", "");
        teamRepository.save(expectedResetTeam);

        mockMvc.perform(
                put("/api/team/team-id/email-addresses")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new UpdateTeamEmailAddressesRequest("primary@mail.com", "secondary@mail.com")))
                        .header("Authorization", "Bearer " + jwtBuilder.buildJwt("team-id"))
        ).andExpect(status().isOk()).andReturn();

        var updatedTeam = teamRepository.findTeamByUri(expectedResetTeam.getUri()).orElseThrow();
        assertThat(updatedTeam.getName()).contains("TeamName");
        assertThat(updatedTeam.getEmail()).contains("primary@mail.com");
        assertThat(updatedTeam.getSecondaryEmail()).contains("secondary@mail.com");
    }

    @Test
    void should_not_get_team_with_nonexistent_id() throws Exception {
        mockMvc.perform(get("/api/team/nonExistentTeamId")
                        .header("Authorization", "Bearer " + jwtBuilder.buildJwt("nonExistentTeamId")))
                .andExpect(status().isForbidden())
                .andExpect(status().reason("Incorrect team name or password. Please try again."));
    }

    @Test
    void should_create_team_with_valid_name_and_password_and_one_email() throws Exception {
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
        assertThat(team.getEmail()).isEqualTo(VALID_EMAIL);
        assertThat(team.getSecondaryEmail()).isEqualTo("");
        assertThat(mvcResult.getResponse().getContentAsString()).isNotNull();
    }

    @Test
    void should_create_team_with_valid_name_and_password_and_two_emails() throws Exception {
        String expectedSecondaryEmail = "seconde@ma.il";
        var sentCreateTeamRequest = validTeamRequestBuilder.secondaryEmail(expectedSecondaryEmail)
                .build();

        var mvcResult = mockMvc.perform(post("/api/team")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsBytes(sentCreateTeamRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        Team team = teamRepository.findById(sentCreateTeamRequest.getName().toLowerCase()).orElseThrow();

        assertThat(team.getName()).isEqualTo(teamId);
        assertThat(team.getUri()).isEqualTo(teamId.toLowerCase());
        assertThat(team.getPassword()).hasSize(60);
        assertThat(team.getEmail()).isEqualTo(VALID_EMAIL);
        assertThat(team.getSecondaryEmail()).isEqualTo(expectedSecondaryEmail);
        assertThat(mvcResult.getResponse().getContentAsString()).isNotNull();
    }

    @Test
    public void shouldReportCorrectPasswordTokenExpirationTime() throws Exception {
        MvcResult mvcResult = mockMvc.perform(get("/api/password/reset/token-lifetime-seconds")).andExpect(status().isOk()).andReturn();
        assertThat(mvcResult.getResponse().getContentAsString()).isEqualTo("600");
    }

    @Test
    void should_return_true_when_password_reset_token_is_valid() throws Exception {
        Team team = new Team("teamuri", "TeamName", "%$&357", "e@ma.il");
        teamRepository.save(team);
        PasswordResetToken passwordResetToken = new PasswordResetToken();
        passwordResetToken.setTeam(team);
        passwordResetRepository.save(passwordResetToken);

        var mvcResult = mockMvc.perform(
                post("/api/password/reset/is-valid")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsBytes(
                                new ResetTokenStatusRequest(passwordResetToken.getResetToken()))
                        )
                )
                .andExpect(status().is2xxSuccessful())
                .andReturn();

        assertThat(mvcResult.getResponse().getContentAsString()).isEqualTo("true");
    }

    @Test
    void should_return_false_when_password_reset_token_is_expired() throws Exception {
        Team team = new Team("teamuri", "TeamName", "%$&357", "e@ma.il");
        teamRepository.save(team);
        PasswordResetToken passwordResetToken = new PasswordResetToken();
        passwordResetToken.setDateCreated(LocalDateTime.MIN);
        passwordResetToken.setTeam(team);
        passwordResetRepository.save(passwordResetToken);

        var mvcResult = mockMvc.perform(
                        post("/api/password/reset/is-valid")
                                .contentType(APPLICATION_JSON)
                                .content(objectMapper.writeValueAsBytes(
                                        new ResetTokenStatusRequest(passwordResetToken.getResetToken()))
                                )
                )
                .andExpect(status().is2xxSuccessful())
                .andReturn();

        assertThat(mvcResult.getResponse().getContentAsString()).isEqualTo("false");
    }

    @Test
    void should_return_false_when_password_reset_token_does_not_exist() throws Exception {
        Team team = new Team("teamuri", "TeamName", "%$&357", "e@ma.il");
        teamRepository.save(team);
        PasswordResetToken passwordResetToken = new PasswordResetToken();
        passwordResetToken.setDateCreated(LocalDateTime.MIN);
        passwordResetToken.setTeam(team);
        passwordResetRepository.save(passwordResetToken);

        var mvcResult = mockMvc.perform(
                        post("/api/password/reset/is-valid")
                                .contentType(APPLICATION_JSON)
                                .content(objectMapper.writeValueAsBytes(
                                        new ResetTokenStatusRequest(UUID.randomUUID().toString()))
                                )
                )
                .andExpect(status().is2xxSuccessful())
                .andReturn();

        assertThat(mvcResult.getResponse().getContentAsString()).isEqualTo("false");
    }

    @Test
    void should_not_create_password_reset_request_when_team_is_invalid() throws Exception {
        Team expectedResetTeam = new Team("teamuri", "TeamName", "%$&357", "e@ma.il");
        teamRepository.save(expectedResetTeam);

        mockMvc.perform(post("/api/password/request-reset").contentType(APPLICATION_JSON).content(objectMapper.writeValueAsBytes(new RequestPasswordResetRequest("NotTeamName", "e@ma.il"))))
                .andExpect(status().isForbidden());

        assertThat(passwordResetRepository.count()).isEqualTo(0);
    }

    @Test
    void should_change_password_and_consume_token_when_reset_token_is_valid() throws Exception {
        Team expectedResetTeam = new Team("teamuri", "TeamName", "%$&357", "e@ma.il");
        teamRepository.save(expectedResetTeam);

        PasswordResetToken passwordResetToken = new PasswordResetToken();
        passwordResetToken.setTeam(expectedResetTeam);
        passwordResetRepository.save(passwordResetToken);

        mockMvc.perform(post("/api/password/reset")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsBytes(
                                new ResetPasswordRequest("Password1", passwordResetToken.getResetToken()))
                        )
                )
                .andExpect(status().isOk());

        Optional<Team> actualTeam = teamRepository.findTeamByUri("teamuri");
        assertThat(actualTeam.isPresent()).isTrue();
        assertThat(passwordEncoder.matches("Password1", actualTeam.get().getPassword())).isTrue();
        assertThat(passwordResetRepository.count()).isZero();
    }

    @Test
    void should_not_change_password_when_reset_token_is_not_valid() throws Exception {
        Team expectedResetTeam = new Team("teamuri", "TeamName", "%$&357", "e@ma.il");
        teamRepository.save(expectedResetTeam);

        PasswordResetToken passwordResetToken = new PasswordResetToken();
        passwordResetToken.setTeam(expectedResetTeam);
        passwordResetRepository.save(passwordResetToken);

        mockMvc.perform(post("/api/password/reset")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsBytes(
                                new ResetPasswordRequest("Password1", UUID.randomUUID().toString()))
                        )
                )
                .andExpect(status().isBadRequest())
                .andExpect(status().reason("Reset token incorrect or expired."));

        Optional<Team> actualTeam = teamRepository.findTeamByUri("teamuri");
        assertThat(actualTeam.isPresent()).isTrue();
        assertThat(actualTeam.get().getPassword()).isEqualTo("%$&357");
    }

    @Test
    void should_not_change_password_when_reset_token_is_expired() throws Exception {
        Team expectedResetTeam = new Team("teamuri", "TeamName", "%$&357", "e@ma.il");
        teamRepository.save(expectedResetTeam);

        PasswordResetToken passwordResetToken = new PasswordResetToken();
        passwordResetToken.setTeam(expectedResetTeam);
        passwordResetToken.setDateCreated(LocalDateTime.MIN);
        passwordResetRepository.save(passwordResetToken);

        mockMvc.perform(post("/api/password/reset")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsBytes(
                                new ResetPasswordRequest("Password1", passwordResetToken.getResetToken()))
                        )
                )
                .andExpect(status().isBadRequest())
                .andExpect(status().reason("Reset token incorrect or expired."));

        Optional<Team> actualTeam = teamRepository.findTeamByUri("teamuri");
        assertThat(actualTeam.isPresent()).isTrue();
        assertThat(actualTeam.get().getPassword()).isEqualTo("%$&357");
    }

    @Test
    void should_not_create_team_with_empty_email() throws Exception {
        var sentCreateTeamRequest = validTeamRequestBuilder.email("")
                .build();

        mockMvc.perform(post("/api/team")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsBytes(sentCreateTeamRequest)))
                .andExpect(status().reason(containsString("Team email is required.")))
                .andExpect(status().isBadRequest());
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
                        .header("Authorization", "Bearer " + jwtBuilder.buildJwt("beachity-bums")))
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

    @ParameterizedTest
    @ValueSource(strings = {
            "PEACHY BEACHY",
            "peachy beachy",
            "    PEACHY BEACHY",
            "PEACHY BEACHY    ",
            "    PEACHY BEACHY  "
    })
    void should_log_in(String attemptedLoginTeamName) throws Exception {
        var createTeamRequest = validTeamRequestBuilder
                .name("PEACHY BEACHY")
                .build();

        testRestTemplate.postForObject("/api/team/", createTeamRequest, String.class);

        var loginRequest = LoginRequest.builder()
                .name(attemptedLoginTeamName)
                .password(VALID_PASSWORD)
                .build();

        var mvcResult = mockMvc.perform(post("/api/team/login")
                        .content(objectMapper.writeValueAsBytes(loginRequest))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();

        assertThat(mvcResult.getResponse().getContentAsString())
                .isEqualTo(jwtBuilder.buildJwt("peachy-beachy"));

        assertThat(mvcResult.getResponse().getHeader(HttpHeaders.LOCATION))
                .isEqualTo("peachy-beachy");
    }

    @Test
    void should_not_login_with_wrong_team_name() throws Exception {
        var loginRequest = LoginRequest.builder()
                .name("not a team")
                .password(VALID_PASSWORD)
                .build();

        mockMvc.perform(post("/api/team/login")
                        .content(objectMapper.writeValueAsBytes(loginRequest))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isForbidden())
                .andExpect(status().reason("Incorrect team name or password. Please try again."));
    }

    @Test
    void should_not_login_with_incorrect_password() throws Exception {
        var createTeamRequest = CreateTeamRequest.builder()
                .name("PEACHY BEACHY")
                .password(VALID_PASSWORD)
                .build();

        testRestTemplate.postForObject("/api/team/", createTeamRequest, String.class);

        var loginRequest = LoginRequest.builder()
                .name("PEACHY BEACHY")
                .password("wr0ngPassw0rd")
                .build();

        mockMvc.perform(post("/api/team/login")
                        .content(objectMapper.writeValueAsBytes(loginRequest))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isForbidden())
                .andExpect(status().reason("Incorrect team name or password. Please try again."));
    }

    @Test
    void should_not_login_with_team_name_with_middle_spaces_in_request() throws Exception {
        var createTeamRequest = CreateTeamRequest.builder()
                .name("PEACHY BEACHY")
                .password(VALID_PASSWORD)
                .build();

        testRestTemplate.postForObject("/api/team/", createTeamRequest, String.class);

        var loginRequest = LoginRequest.builder()
                .name("PEACHY     BEACHY")
                .password(VALID_PASSWORD)
                .build();

        mockMvc.perform(post("/api/team/login")
                        .content(objectMapper.writeValueAsBytes(loginRequest))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isForbidden())
                .andExpect(status().reason("Incorrect team name or password. Please try again."));
    }

    @Test
    void should_return_ok_for_valid_token() throws Exception {
        mockMvc.perform(get("/api/team/teamId/validate")
                        .header("Authorization", "Bearer " + jwtBuilder.buildJwt("teamId")))
                .andExpect(status().isOk());
    }

    @Test
    void should_return_forbidden_token_doesnt_match_teamid() throws Exception {
        mockMvc.perform(get("/api/team/wrongTeamId/validate")
                        .header("Authorization", "Bearer " + jwtBuilder.buildJwt("teamId")))
                .andExpect(status().isForbidden());
    }
}
