package com.ford.labs.retroquest.api;

import com.ford.labs.retroquest.api.setup.ApiTest;
import com.ford.labs.retroquest.columntitle.ColumnTitleRepository;
import com.ford.labs.retroquest.team.*;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.test.web.servlet.MvcResult;
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
public class TeamApiTest extends ApiTest {

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

    private static final String VALID_PASSWORD = "Passw0rd";

    @AfterEach
    public void teardown() {
        teamRepository.deleteAllInBatch();
        columnTitleRepository.deleteAllInBatch();
        assertThat(teamRepository.count()).isZero();
        assertThat(columnTitleRepository.count()).isZero();
    }

    @Test
    public void should_create_team_with_valid_name_and_password() throws Exception {
        installSuccessCaptcha();

        CreateTeamRequest sentCreateTeamRequest = CreateTeamRequest.builder()
                .name(teamId)
                .password(VALID_PASSWORD)
                .captchaResponse("some captcha")
                .build();

        MvcResult mvcResult = mockMvc.perform(post("/api/team")
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsBytes(sentCreateTeamRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        Team team = teamRepository.findById(sentCreateTeamRequest.getName().toLowerCase()).orElseThrow();

        assertThat(team.getName()).isEqualTo(teamId);
        assertThat(team.getUri()).isEqualTo(teamId.toLowerCase());
        assertThat(team.getPassword().length()).isEqualTo(60);
        assertThat(mvcResult.getResponse().getContentAsString()).isNotNull();
    }

    @Test
    public void should_not_create_team_with_empty_password() throws Exception {
        installSuccessCaptcha();

        CreateTeamRequest sentCreateTeamRequest = CreateTeamRequest.builder()
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
    public void should_not_create_team_with_invalid_captcha() throws Exception {
        installInvalidCaptcha();

        CreateTeamRequest sentCreateTeamRequest = CreateTeamRequest.builder()
                .name(teamId)
                .password(VALID_PASSWORD)
                .captchaResponse("some captcha")
                .build();

        mockMvc.perform(post("/api/team")
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsBytes(sentCreateTeamRequest)))
                .andExpect(status().isForbidden())
                .andExpect(status().reason(containsString("Incorrect board or password. Please try again.")));
    }

    @Test
    public void should_not_create_team_with_empty_name() throws Exception {
        installSuccessCaptcha();

        CreateTeamRequest sentCreateTeamRequest = CreateTeamRequest.builder()
                .password(VALID_PASSWORD)
                .captchaResponse("some captcha")
                .build();

        mockMvc.perform(post("/api/team")
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsBytes(sentCreateTeamRequest)))
                .andExpect(status()
                        .reason(containsString("Please enter a board name.")))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void should_not_create_team_with_special_characters_in_name() throws Exception {
        installSuccessCaptcha();

        CreateTeamRequest sentCreateTeamRequest = CreateTeamRequest.builder()
                .name("The@Mild$Ones")
                .password(VALID_PASSWORD)
                .captchaResponse("some captcha")
                .build();

        mockMvc.perform(post("/api/team")
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsBytes(sentCreateTeamRequest)))
                .andExpect(status().reason(containsString("Please enter a board name without any special characters.")))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void should_not_create_team_with_duplicate_name() throws Exception {
        installSuccessCaptcha();

        CreateTeamRequest sentCreateTeamRequest = CreateTeamRequest.builder()
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
                .andExpect(status().reason(containsString("This board name is already in use. Please try another one.")))
                .andExpect(status().isConflict());
    }

    @Test
    public void should_not_create_team_with_duplicate_lower_case_name() throws Exception {
        installSuccessCaptcha();

        CreateTeamRequest upperCaseCreateTeamRequest = CreateTeamRequest.builder()
                .name("someTeam".toUpperCase())
                .password(VALID_PASSWORD)
                .captchaResponse("some captcha")
                .build();

        CreateTeamRequest lowerCaseCreateTeamRequest = upperCaseCreateTeamRequest.toBuilder().name(upperCaseCreateTeamRequest.getName().toLowerCase()).build();

        teamRepository.save(Team.builder()
                .uri(upperCaseCreateTeamRequest.getName().toLowerCase())
                .name(upperCaseCreateTeamRequest.getName())
                .password(upperCaseCreateTeamRequest.getPassword())
                .build());

        mockMvc.perform(post("/api/team")
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsBytes(lowerCaseCreateTeamRequest)))
                .andExpect(status().reason(containsString("This board name is already in use. Please try another one.")))
                .andExpect(status().isConflict());
    }

    @Test
    public void should_not_create_team_with_duplicate_upper_case_name() throws Exception {
        installSuccessCaptcha();

        CreateTeamRequest upperCaseCreateTeamRequest = CreateTeamRequest.builder()
                .name("someTeam".toUpperCase())
                .password(VALID_PASSWORD)
                .captchaResponse("some captcha")
                .build();

        CreateTeamRequest lowerCaseCreateTeamRequest = upperCaseCreateTeamRequest.toBuilder().name(upperCaseCreateTeamRequest.getName().toLowerCase()).build();

        teamRepository.save(Team.builder()
                .uri(lowerCaseCreateTeamRequest.getName().toLowerCase())
                .name(lowerCaseCreateTeamRequest.getName())
                .password(lowerCaseCreateTeamRequest.getPassword())
                .build());

        mockMvc.perform(post("/api/team")
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsBytes(upperCaseCreateTeamRequest)))
                .andExpect(status().reason(containsString("This board name is already in use. Please try another one.")))
                .andExpect(status().isConflict());
    }

    @Test
    public void should_not_create_team_with_duplicate_with_leading_spaces() throws Exception {
        installSuccessCaptcha();

        CreateTeamRequest createTeamRequest = CreateTeamRequest.builder()
                .name("someTeam")
                .password(VALID_PASSWORD)
                .captchaResponse("some captcha")
                .build();

        CreateTeamRequest leadingSpacesRequest = createTeamRequest.toBuilder().name("    "+createTeamRequest.getName()).build();

        teamRepository.save(Team.builder()
                .uri(createTeamRequest.getName().toLowerCase())
                .name(createTeamRequest.getName())
                .password(createTeamRequest.getPassword())
                .build());

        mockMvc.perform(post("/api/team")
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsBytes(leadingSpacesRequest)))
                .andExpect(status().reason(containsString("This board name is already in use. Please try another one.")))
                .andExpect(status().isConflict());
    }

    @Test
    public void should_not_create_team_with_duplicate_with_trailing_spaces() throws Exception {
        installSuccessCaptcha();

        CreateTeamRequest createTeamRequest = CreateTeamRequest.builder()
                .name("someTeam")
                .password(VALID_PASSWORD)
                .captchaResponse("some captcha")
                .build();

        CreateTeamRequest trailingSpacesRequest = createTeamRequest.toBuilder().name(createTeamRequest.getName()+"    ").build();

        teamRepository.save(Team.builder()
                .uri(createTeamRequest.getName().toLowerCase())
                .name(createTeamRequest.getName())
                .password(createTeamRequest.getPassword())
                .build());

        mockMvc.perform(post("/api/team")
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsBytes(trailingSpacesRequest)))
                .andExpect(status().reason(containsString("This board name is already in use. Please try another one.")))
                .andExpect(status().isConflict());
    }

    @Test
    public void should_create_team_with_leading_spaces_dropped_from_team_name_and_uri() throws Exception {
        installSuccessCaptcha();

        CreateTeamRequest sentCreateTeamRequest = CreateTeamRequest.builder()
                .name("    "+teamId)
                .password(VALID_PASSWORD)
                .captchaResponse("some captcha")
                .build();

        MvcResult mvcResult = mockMvc.perform(post("/api/team")
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsBytes(sentCreateTeamRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        Team team = teamRepository.findById(sentCreateTeamRequest.getName().trim().toLowerCase()).orElseThrow();

        assertThat(team.getName()).isEqualTo(teamId);
        assertThat(team.getUri()).isEqualTo(teamId.toLowerCase());
        assertThat(team.getPassword().length()).isEqualTo(60);
        assertThat(mvcResult.getResponse().getContentAsString()).isNotNull();
    }

    @Test
    public void should_create_team_with_trailing_spaces_dropped_from_team_name_and_uri() throws Exception {
        installSuccessCaptcha();

        CreateTeamRequest sentCreateTeamRequest = CreateTeamRequest.builder()
                .name(teamId+"    ")
                .password(VALID_PASSWORD)
                .captchaResponse("some captcha")
                .build();

        MvcResult mvcResult = mockMvc.perform(post("/api/team")
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsBytes(sentCreateTeamRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        Team team = teamRepository.findById(sentCreateTeamRequest.getName().trim().toLowerCase()).orElseThrow();

        assertThat(team.getName()).isEqualTo(teamId);
        assertThat(team.getUri()).isEqualTo(teamId.toLowerCase());
        assertThat(team.getPassword().length()).isEqualTo(60);
        assertThat(mvcResult.getResponse().getContentAsString()).isNotNull();
    }

    @Test
    public void should_update_password() throws Exception {
        installSuccessCaptcha();

        CreateTeamRequest createTeamRequest = CreateTeamRequest.builder()
                .name("Beachity Bums")
                .password(VALID_PASSWORD)
                .captchaResponse("some captcha")
                .build();

        testRestTemplate.postForObject("/api/team/", createTeamRequest, String.class);

        UpdatePasswordRequest updatePasswordRequest = UpdatePasswordRequest.builder()
                .teamId("beachity-bums")
                .previousPassword(VALID_PASSWORD)
                .newPassword(VALID_PASSWORD + "1")
                .build();

        mockMvc.perform(post("/api/update-password")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("beachity-bums"))
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsBytes(updatePasswordRequest)))
                .andExpect(status().isOk());

        Team team = teamRepository.findById(updatePasswordRequest.getTeamId().toLowerCase()).orElseThrow();
        assertThat(passwordEncoder.matches(updatePasswordRequest.getNewPassword(),
                team.getPassword())).isTrue();
    }

    @Test
    public void should_not_update_password_with_incorrect_previous_password() throws Exception {
        installSuccessCaptcha();

        CreateTeamRequest createTeamRequest = CreateTeamRequest.builder()
                .name("Beachity Bums")
                .password(VALID_PASSWORD)
                .captchaResponse("some captcha")
                .build();

        testRestTemplate.postForObject("/api/team/", createTeamRequest, String.class);

        UpdatePasswordRequest updatePasswordRequest = UpdatePasswordRequest.builder()
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
    public void should_not_update_password_with_an_invalid_new_password() throws Exception {
        installSuccessCaptcha();

        CreateTeamRequest createTeamRequest = CreateTeamRequest.builder()
                .name("Beachity Bums")
                .password(VALID_PASSWORD)
                .captchaResponse("some captcha")
                .build();

        testRestTemplate.postForObject("/api/team/", createTeamRequest, String.class);

        UpdatePasswordRequest updatePasswordRequest = UpdatePasswordRequest.builder()
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
    public void should_get_team_name() throws Exception {
        installSuccessCaptcha();

        String expectedName = "Beachity Bums";

        CreateTeamRequest createTeamRequest = CreateTeamRequest.builder()
                .name(expectedName)
                .password(VALID_PASSWORD)
                .captchaResponse("some captcha")
                .build();

        testRestTemplate.postForObject("/api/team/", createTeamRequest, String.class);

        String actualName = mockMvc.perform(get("/api/team/beachity-bums/name")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("beachity-bums")))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        assertThat(expectedName).isEqualTo(actualName);
    }

    @Test
    public void should_not_get_team_name_with_nonexistant_name() throws Exception {
        mockMvc.perform(get("/api/team/nonExistentTeamName/name"))
                .andExpect(status().isForbidden())
                .andExpect(status().reason("Incorrect board name. Please try again."));
    }

    @Test
    public void should_get_token_when_logged_in() throws Exception {
        installSuccessCaptcha();

        CreateTeamRequest createTeamRequest = CreateTeamRequest.builder()
                .name("PEACHY BEACHY")
                .password(VALID_PASSWORD)
                .captchaResponse("some captcha")
                .build();

        testRestTemplate.postForObject("/api/team/", createTeamRequest, String.class);

        LoginRequest loginRequest = LoginRequest.builder()
                .name("PEACHY BEACHY")
                .password(VALID_PASSWORD)
                .captchaResponse("some captcha")
                .build();

        MvcResult mvcResult = mockMvc.perform(post("/api/team/login")
                .content(objectMapper.writeValueAsBytes(loginRequest))
                .contentType(APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();

        assertThat(mvcResult.getResponse().getContentAsString()).isEqualTo(jwtBuilder.buildJwt("peachy-beachy"));
    }

    @Test
    public void should_login_when_failed_password_threshold_is_not_reached() throws Exception {
        installSuccessCaptcha();

        CreateTeamRequest createTeamRequest = CreateTeamRequest.builder()
                .name("PEACHY BEACHY")
                .password(VALID_PASSWORD)
                .captchaResponse("some captcha")
                .build();

        testRestTemplate.postForObject("/api/team/", createTeamRequest, String.class);

        LoginRequest loginRequest = LoginRequest.builder()
                .name("PEACHY BEACHY")
                .password(VALID_PASSWORD)
                .captchaResponse("some captcha")
                .build();

        MvcResult mvcResult = mockMvc.perform(post("/api/team/login")
                .content(objectMapper.writeValueAsBytes(loginRequest))
                .contentType(APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();

        assertThat("peachy-beachy").isEqualTo(mvcResult.getResponse().getHeader("Location"));
    }

    @Test
    public void should_not_login_with_wrong_team_name() throws Exception {
        installSuccessCaptcha();

        LoginRequest loginRequest = LoginRequest.builder()
                .name("not a team")
                .password(VALID_PASSWORD)
                .captchaResponse("some captcha")
                .build();

        mockMvc.perform(post("/api/team/login")
                .content(objectMapper.writeValueAsBytes(loginRequest))
                .contentType(APPLICATION_JSON))
                .andExpect(status().isForbidden())
                .andExpect(status().reason("Incorrect board name. Please try again."));
    }

    @Test
    public void should_not_login_with_incorrect_password() throws Exception {
        installInvalidCaptchaTwice();

        CreateTeamRequest createTeamRequest = CreateTeamRequest.builder()
                .name("PEACHY BEACHY")
                .password(VALID_PASSWORD)
                .captchaResponse("some captcha")
                .build();

        testRestTemplate.postForObject("/api/team/", createTeamRequest, String.class);

        LoginRequest loginRequest = LoginRequest.builder()
                .name("PEACHY BEACHY")
                .password("wr0ngPassw0rd")
                .captchaResponse("some captcha")
                .build();

        mockMvc.perform(post("/api/team/login")
                .content(objectMapper.writeValueAsBytes(loginRequest))
                .contentType(APPLICATION_JSON))
                .andExpect(status().isForbidden())
                .andExpect(status().reason("Incorrect board or password. Please try again."));
    }

    @Test
    public void should_login_with_lower_case_board_name_in_request() throws Exception {
        installSuccessCaptcha();

        CreateTeamRequest createTeamRequest = CreateTeamRequest.builder()
                .name("PEACHY BEACHY".toUpperCase())
                .password(VALID_PASSWORD)
                .captchaResponse("some captcha")
                .build();

        testRestTemplate.postForObject("/api/team/", createTeamRequest, String.class);

        LoginRequest loginRequest = LoginRequest.builder()
                .name("PEACHY BEACHY".toLowerCase())
                .password(VALID_PASSWORD)
                .captchaResponse("some captcha")
                .build();

         MvcResult mvcResult = mockMvc.perform(post("/api/team/login")
                .content(objectMapper.writeValueAsBytes(loginRequest))
                .contentType(APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();

        assertThat("peachy-beachy").isEqualTo(mvcResult.getResponse().getHeader("Location"));
    }
    
    @Test
    public void should_login_with_upper_case_board_name_in_request() throws Exception {
        installSuccessCaptcha();

        CreateTeamRequest createTeamRequest = CreateTeamRequest.builder()
                .name("PEACHY BEACHY".toLowerCase())
                .password(VALID_PASSWORD)
                .captchaResponse("some captcha")
                .build();

        testRestTemplate.postForObject("/api/team/", createTeamRequest, String.class);

        LoginRequest loginRequest = LoginRequest.builder()
                .name("PEACHY BEACHY".toUpperCase())
                .password(VALID_PASSWORD)
                .captchaResponse("some captcha")
                .build();

        MvcResult mvcResult = mockMvc.perform(post("/api/team/login")
                .content(objectMapper.writeValueAsBytes(loginRequest))
                .contentType(APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();

        assertThat("peachy-beachy").isEqualTo(mvcResult.getResponse().getHeader("Location"));
    }

    @Test
    public void should_login_with_board_name_with_leading_spaces_in_request() throws Exception {
        installSuccessCaptcha();

        CreateTeamRequest createTeamRequest = CreateTeamRequest.builder()
                .name("PEACHY BEACHY")
                .password(VALID_PASSWORD)
                .captchaResponse("some captcha")
                .build();

        testRestTemplate.postForObject("/api/team/", createTeamRequest, String.class);

        LoginRequest loginRequest = LoginRequest.builder()
                .name("    PEACHY BEACHY")
                .password(VALID_PASSWORD)
                .captchaResponse("some captcha")
                .build();

        MvcResult mvcResult = mockMvc.perform(post("/api/team/login")
                .content(objectMapper.writeValueAsBytes(loginRequest))
                .contentType(APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();

        assertThat("peachy-beachy").isEqualTo(mvcResult.getResponse().getHeader("Location"));
    }

    @Test
    public void should_login_with_board_name_with_trailing_spaces_in_request() throws Exception {
        installSuccessCaptcha();

        CreateTeamRequest createTeamRequest = CreateTeamRequest.builder()
                .name("PEACHY BEACHY")
                .password(VALID_PASSWORD)
                .captchaResponse("some captcha")
                .build();

        testRestTemplate.postForObject("/api/team/", createTeamRequest, String.class);

        LoginRequest loginRequest = LoginRequest.builder()
                .name("PEACHY BEACHY    ")
                .password(VALID_PASSWORD)
                .captchaResponse("some captcha")
                .build();

        MvcResult mvcResult = mockMvc.perform(post("/api/team/login")
                .content(objectMapper.writeValueAsBytes(loginRequest))
                .contentType(APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();

        assertThat("peachy-beachy").isEqualTo(mvcResult.getResponse().getHeader("Location"));
    }

    @Test
    public void should_login_with_board_name_with_leading_and_trailing_spaces_in_request() throws Exception {
        installSuccessCaptcha();

        CreateTeamRequest createTeamRequest = CreateTeamRequest.builder()
                .name("PEACHY BEACHY")
                .password(VALID_PASSWORD)
                .captchaResponse("some captcha")
                .build();

        testRestTemplate.postForObject("/api/team/", createTeamRequest, String.class);

        LoginRequest loginRequest = LoginRequest.builder()
                .name("    PEACHY BEACHY  ")
                .password(VALID_PASSWORD)
                .captchaResponse("some captcha")
                .build();

        MvcResult mvcResult = mockMvc.perform(post("/api/team/login")
                .content(objectMapper.writeValueAsBytes(loginRequest))
                .contentType(APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();

        assertThat("peachy-beachy").isEqualTo(mvcResult.getResponse().getHeader("Location"));
    }

    @Test
    public void should_not_login_with_board_name_with_middle_spaces_in_request() throws Exception {
        installSuccessCaptcha();

        CreateTeamRequest createTeamRequest = CreateTeamRequest.builder()
                .name("PEACHY BEACHY")
                .password(VALID_PASSWORD)
                .captchaResponse("some captcha")
                .build();

        testRestTemplate.postForObject("/api/team/", createTeamRequest, String.class);

        LoginRequest loginRequest = LoginRequest.builder()
                .name("PEACHY     BEACHY")
                .password(VALID_PASSWORD)
                .captchaResponse("some captcha")
                .build();

        mockMvc.perform(post("/api/team/login")
                .content(objectMapper.writeValueAsBytes(loginRequest))
                .contentType(APPLICATION_JSON))
                .andExpect(status().isForbidden())
                .andExpect(status().reason("Incorrect board name. Please try again."));
    }

    @Test
    public void should_return_ok_for_valid_token() throws Exception {
        mockMvc.perform(get("/api/team/teamId/validate")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("teamId")))
                .andExpect(status().isOk());
    }

    @Test
    public void should_return_forbidden_token_doesnt_match_teamid() throws Exception {
        mockMvc.perform(get("/api/team/wrongTeamId/validate")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("teamId")))
                .andExpect(status().isForbidden());
    }

    @Test
    public void shouldAllowCaptchaRequestWithInvalidToken() throws Exception {
        installSuccessCaptcha();

        CreateTeamRequest createTeamRequest = CreateTeamRequest.builder()
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
    public void shouldReturnIsCaptchaEnabledWithCaptchaRequest() throws Exception {
        mockMvc.perform(get("/api/captcha")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("teamId"))
        ).andExpect(status().isOk());
    }

    private void installSuccessCaptcha() {
        MockRestServiceServer server = MockRestServiceServer.bindTo(restTemplate).build();
        server.expect(requestTo(containsString("http://captcha.url")))
                .andRespond(withSuccess("{\"success\":true}", APPLICATION_JSON));
    }

    private void installInvalidCaptcha() {
        MockRestServiceServer server = MockRestServiceServer.bindTo(restTemplate).build();
        server.expect(requestTo(containsString("http://captcha.url")))
                .andRespond(withSuccess("{\"success\":false}", APPLICATION_JSON));
    }

    private void installInvalidCaptchaTwice() {
        MockRestServiceServer server = MockRestServiceServer.bindTo(restTemplate).build();

        server.expect(times(2), requestTo(containsString("http://captcha.url")))
                .andRespond(withSuccess("{\"success\":true}", APPLICATION_JSON));
    }

}
