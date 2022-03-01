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

package com.ford.labs.retroquest.api;

import com.ford.labs.retroquest.api.setup.ApiTestBase;
import com.ford.labs.retroquest.column.ColumnTitleRepository;
import com.ford.labs.retroquest.team.*;
import io.micrometer.core.instrument.MeterRegistry;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.client.ExpectedCount.times;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Tag("api")
class TeamApiTest extends ApiTestBase {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private ColumnTitleRepository columnTitleRepository;

    @Autowired
    private TestRestTemplate testRestTemplate;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private MeterRegistry meterRegistry;

    private static final String VALID_PASSWORD = "Passw0rd";

    @BeforeEach
    @AfterEach
    void clean() {
        teamRepository.deleteAllInBatch();
        columnTitleRepository.deleteAllInBatch();
        assertThat(teamRepository.count()).isZero();
        assertThat(columnTitleRepository.count()).isZero();
    }

    @Test
    void should_create_team_and_update_metric() throws Exception {
        meterRegistry.gauge("retroquest.teams.count", 0);

        installSuccessCaptcha();
        var sentCreateTeamRequest = CreateTeamRequest.builder()
            .name(teamId)
            .password(VALID_PASSWORD)
            .captchaResponse("some captcha")
            .build();

        var mvcResult = mockMvc.perform(post("/api/team")
            .contentType(APPLICATION_JSON)
            .content(objectMapper.writeValueAsBytes(sentCreateTeamRequest)))
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
    void should_create_team_with_valid_name_and_password() throws Exception {
        installSuccessCaptcha();

        var sentCreateTeamRequest = CreateTeamRequest.builder()
            .name(teamId)
            .password(VALID_PASSWORD)
            .captchaResponse("some captcha")
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
        installSuccessCaptcha();

        var sentCreateTeamRequest = CreateTeamRequest.builder()
            .name(teamId)
            .captchaResponse("some captcha")
            .build();

        mockMvc.perform(post("/api/team")
            .contentType(APPLICATION_JSON)
            .content(objectMapper.writeValueAsBytes(sentCreateTeamRequest)))
            .andExpect(status().reason(containsString("Password must be 8 characters or longer.")))
            .andExpect(status().isBadRequest());
    }

    @Test
    void should_not_create_team_with_invalid_captcha() throws Exception {
        installInvalidCaptcha();

        var sentCreateTeamRequest = CreateTeamRequest.builder()
            .name(teamId)
            .password(VALID_PASSWORD)
            .captchaResponse("some captcha")
            .build();

        mockMvc.perform(post("/api/team")
            .contentType(APPLICATION_JSON)
            .content(objectMapper.writeValueAsBytes(sentCreateTeamRequest)))
            .andExpect(status().isForbidden())
            .andExpect(status().reason(containsString("Incorrect team name or password. Please try again.")));
    }

    @Test
    void should_not_create_team_with_empty_name() throws Exception {
        installSuccessCaptcha();

        var sentCreateTeamRequest = CreateTeamRequest.builder()
            .password(VALID_PASSWORD)
            .captchaResponse("some captcha")
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
        installSuccessCaptcha();

        var sentCreateTeamRequest = CreateTeamRequest.builder()
            .name("The@Mild$Ones")
            .password(VALID_PASSWORD)
            .captchaResponse("some captcha")
            .build();

        mockMvc.perform(post("/api/team")
            .contentType(APPLICATION_JSON)
            .content(objectMapper.writeValueAsBytes(sentCreateTeamRequest)))
            .andExpect(status().reason(containsString("Please enter a team name without any special characters.")))
            .andExpect(status().isBadRequest());
    }

    @Test
    void should_not_create_team_with_duplicate_name() throws Exception {
        installSuccessCaptcha();

        var sentCreateTeamRequest = CreateTeamRequest.builder()
            .name("someTeam")
            .password(VALID_PASSWORD)
            .captchaResponse("some captcha")
            .build();

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
        installSuccessCaptcha();

        var upperCaseCreateTeamRequest = CreateTeamRequest.builder()
            .name("someTeam".toUpperCase())
            .password(VALID_PASSWORD)
            .captchaResponse("some captcha")
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
        installSuccessCaptcha();

        var upperCaseCreateTeamRequest = CreateTeamRequest.builder()
            .name("someTeam".toUpperCase())
            .password(VALID_PASSWORD)
            .captchaResponse("some captcha")
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
        installSuccessCaptcha();

        var createTeamRequest = CreateTeamRequest.builder()
            .name("someTeam")
            .password(VALID_PASSWORD)
            .captchaResponse("some captcha")
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
        installSuccessCaptcha();

        var createTeamRequest = CreateTeamRequest.builder()
            .name("someTeam")
            .password(VALID_PASSWORD)
            .captchaResponse("some captcha")
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
        installSuccessCaptcha();

        var sentCreateTeamRequest = CreateTeamRequest.builder()
            .name("    " + teamId)
            .password(VALID_PASSWORD)
            .captchaResponse("some captcha")
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
        installSuccessCaptcha();

        var sentCreateTeamRequest = CreateTeamRequest.builder()
            .name(teamId + "    ")
            .password(VALID_PASSWORD)
            .captchaResponse("some captcha")
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
    void should_update_password() throws Exception {
        installSuccessCaptcha();

        var createTeamRequest = CreateTeamRequest.builder()
            .name("Beachity Bums")
            .password(VALID_PASSWORD)
            .captchaResponse("some captcha")
            .build();

        testRestTemplate.postForObject("/api/team/", createTeamRequest, String.class);

        var updatePasswordRequest = UpdatePasswordRequest.builder()
            .teamId("beachity-bums")
            .previousPassword(VALID_PASSWORD)
            .newPassword(VALID_PASSWORD + "1")
            .build();

        mockMvc.perform(post("/api/update-password")
            .header("Authorization", "Bearer " + jwtBuilder.buildJwt("beachity-bums"))
            .contentType(APPLICATION_JSON)
            .content(objectMapper.writeValueAsBytes(updatePasswordRequest)))
            .andExpect(status().isOk());

        var team = teamRepository.findById(updatePasswordRequest.getTeamId().toLowerCase()).orElseThrow();
        assertThat(passwordEncoder.matches(
            updatePasswordRequest.getNewPassword(),
            team.getPassword())
        ).isTrue();
    }

    @Test
    void should_not_update_password_with_incorrect_previous_password() throws Exception {
        installSuccessCaptcha();

        var createTeamRequest = CreateTeamRequest.builder()
            .name("Beachity Bums")
            .password(VALID_PASSWORD)
            .captchaResponse("some captcha")
            .build();

        testRestTemplate.postForObject("/api/team/", createTeamRequest, String.class);

        var updatePasswordRequest = UpdatePasswordRequest.builder()
            .teamId("beachity-bums")
            .previousPassword("INCORRECT_PASSWORD")
            .newPassword(VALID_PASSWORD + "1")
            .build();

        mockMvc.perform(post("/api/update-password")
            .header("Authorization", "Bearer " + jwtBuilder.buildJwt("beachity-bums"))
            .contentType(APPLICATION_JSON)
            .content(objectMapper.writeValueAsBytes(updatePasswordRequest)))
            .andExpect(status().isForbidden());
    }

    @Test
    void should_not_update_password_with_an_invalid_new_password() throws Exception {
        installSuccessCaptcha();

        var createTeamRequest = CreateTeamRequest.builder()
            .name("Beachity Bums")
            .password(VALID_PASSWORD)
            .captchaResponse("some captcha")
            .build();

        testRestTemplate.postForObject("/api/team/", createTeamRequest, String.class);

        var updatePasswordRequest = UpdatePasswordRequest.builder()
            .teamId("beachity-bums")
            .previousPassword(VALID_PASSWORD)
            .newPassword("invalid-password")
            .build();

        mockMvc.perform(post("/api/update-password")
            .header("Authorization", "Bearer " + jwtBuilder.buildJwt("beachity-bums"))
            .contentType(APPLICATION_JSON)
            .content(objectMapper.writeValueAsBytes(updatePasswordRequest)))
            .andExpect(status().isBadRequest());
    }

    @Test
    void should_get_team_name() throws Exception {
        installSuccessCaptcha();

        var expectedName = "Beachity Bums";

        var createTeamRequest = CreateTeamRequest.builder()
            .name(expectedName)
            .password(VALID_PASSWORD)
            .captchaResponse("some captcha")
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
        installSuccessCaptcha();

        var createTeamRequest = CreateTeamRequest.builder()
            .name("PEACHY BEACHY")
            .password(VALID_PASSWORD)
            .captchaResponse("some captcha")
            .build();

        testRestTemplate.postForObject("/api/team/", createTeamRequest, String.class);

        var loginRequest = LoginRequest.builder()
            .name(attemptedLoginTeamName)
            .password(VALID_PASSWORD)
            .captchaResponse("some captcha")
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
        installSuccessCaptcha();

        var loginRequest = LoginRequest.builder()
            .name("not a team")
            .password(VALID_PASSWORD)
            .captchaResponse("some captcha")
            .build();

        mockMvc.perform(post("/api/team/login")
            .content(objectMapper.writeValueAsBytes(loginRequest))
            .contentType(APPLICATION_JSON))
            .andExpect(status().isForbidden())
            .andExpect(status().reason("Incorrect team name or password. Please try again."));
    }

    @Test
    void should_not_login_with_incorrect_password() throws Exception {
        installInvalidCaptchaTwice();

        var createTeamRequest = CreateTeamRequest.builder()
            .name("PEACHY BEACHY")
            .password(VALID_PASSWORD)
            .captchaResponse("some captcha")
            .build();

        testRestTemplate.postForObject("/api/team/", createTeamRequest, String.class);

        var loginRequest = LoginRequest.builder()
            .name("PEACHY BEACHY")
            .password("wr0ngPassw0rd")
            .captchaResponse("some captcha")
            .build();

        mockMvc.perform(post("/api/team/login")
            .content(objectMapper.writeValueAsBytes(loginRequest))
            .contentType(APPLICATION_JSON))
            .andExpect(status().isForbidden())
            .andExpect(status().reason("Incorrect team name or password. Please try again."));
    }

    @Test
    void should_not_login_with_team_name_with_middle_spaces_in_request() throws Exception {
        installSuccessCaptcha();

        var createTeamRequest = CreateTeamRequest.builder()
            .name("PEACHY BEACHY")
            .password(VALID_PASSWORD)
            .captchaResponse("some captcha")
            .build();

        testRestTemplate.postForObject("/api/team/", createTeamRequest, String.class);

        var loginRequest = LoginRequest.builder()
            .name("PEACHY     BEACHY")
            .password(VALID_PASSWORD)
            .captchaResponse("some captcha")
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

    @Test
    void shouldAllowCaptchaRequestWithInvalidToken() throws Exception {
        installSuccessCaptcha();

        var createTeamRequest = CreateTeamRequest.builder()
            .name("ateam")
            .password(VALID_PASSWORD)
            .captchaResponse("some captcha")
            .build();

        testRestTemplate.postForObject("/api/team/", createTeamRequest, String.class);

        mockMvc.perform(get("/api/team/ateam/captcha")
            .header("Authorization", "Bearer invalidToken")
        ).andExpect(status().isOk());
    }

    @Test
    void shouldReturnIsCaptchaEnabledWithCaptchaRequest() throws Exception {
        mockMvc.perform(get("/api/captcha")
            .header("Authorization", "Bearer " + jwtBuilder.buildJwt("teamId"))
        ).andExpect(status().isOk());
    }

    private void installSuccessCaptcha() {
        var server = MockRestServiceServer.bindTo(restTemplate).build();
        server.expect(requestTo(containsString("http://captcha.url")))
            .andRespond(withSuccess("{\"success\":true}", APPLICATION_JSON));
    }

    private void installInvalidCaptcha() {
        var server = MockRestServiceServer.bindTo(restTemplate).build();
        server.expect(requestTo(containsString("http://captcha.url")))
            .andRespond(withSuccess("{\"success\":false}", APPLICATION_JSON));
    }

    private void installInvalidCaptchaTwice() {
        var server = MockRestServiceServer.bindTo(restTemplate).build();

        server.expect(times(2), requestTo(containsString("http://captcha.url")))
            .andRespond(withSuccess("{\"success\":true}", APPLICATION_JSON));
    }
}
