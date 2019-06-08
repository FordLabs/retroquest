package com.ford.labs.retroquest.api;

import com.ford.labs.retroquest.users.NewUserRequest;
import com.ford.labs.retroquest.users.User;
import com.ford.labs.retroquest.users.UserRepository;
import io.jsonwebtoken.Claims;
import org.assertj.core.api.Assertions;
import org.junit.After;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class UserApiTest extends ControllerTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private NewUserRequest validNewUserRequest = NewUserRequest.builder().name("jake").password("paul").build();
    private NewUserRequest missingPasswordUser = NewUserRequest.builder().name("jake").password("").build();
    private NewUserRequest missingNameUser = NewUserRequest.builder().name("").password("paul").build();

    private NewUserRequest validNewTeamRequest = NewUserRequest.builder().name("jake").password("paul").build();

    @After
    public void teardown() {
        userRepository.deleteAll();
        Assertions.assertThat(userRepository.count()).isEqualTo(0);
    }

    @Test
    public void shouldHaveACreateNewUserEndpoint() throws Exception {

        mockMvc.perform(post("/api/user")
                .content(objectMapper.writeValueAsString(validNewUserRequest))
                .contentType(MediaType.APPLICATION_JSON)
        )
                .andExpect(status().is(201));

    }

    @Test
    public void shouldSaveANewUserToTheDatabaseWithUserNameAndEncryptedPassword() throws Exception {

        mockMvc.perform(post("/api/user")
                .content(objectMapper.writeValueAsString(validNewUserRequest))
                .contentType(MediaType.APPLICATION_JSON)
        )
                .andExpect(status().is(201));


        Assertions.assertThat(userRepository.count()).isEqualTo(1);

        User savedUser = userRepository.findAll().get(0);

        Assertions.assertThat(savedUser.getName()).isEqualTo(validNewUserRequest.getName());
        Assertions.assertThat(passwordEncoder
                .matches(validNewUserRequest.getPassword(), savedUser.getPassword()))
                .isTrue();
        Assertions.assertThat(savedUser.getId()).isNotNull();
    }

    @Test
    public void shouldNotSaveANewUserToTheDatabaseWithAMissingPassword() throws Exception {

        mockMvc.perform(post("/api/user")
                .content(objectMapper.writeValueAsString(missingPasswordUser))
                .contentType(MediaType.APPLICATION_JSON)
        )
                .andExpect(status().is(400));


        Assertions.assertThat(userRepository.count()).isEqualTo(0);
    }

    @Test
    public void shouldNotSaveANewUserToTheDatabaseWithAMissingUserName() throws Exception {

        mockMvc.perform(post("/api/user")
                .content(objectMapper.writeValueAsString(missingNameUser))
                .contentType(MediaType.APPLICATION_JSON)
        )
                .andExpect(status().is(400));


        Assertions.assertThat(userRepository.count()).isEqualTo(0);
    }

    @Test
    public void shouldReturnAJwtTokenWithTheUserNameAsTheSubject() throws Exception {

        MvcResult result = mockMvc.perform(post("/api/user")
                .content(objectMapper.writeValueAsString(validNewUserRequest))
                .contentType(MediaType.APPLICATION_JSON)
        )
                .andExpect(status().is(201))
                .andReturn();

        Claims claims = decodeJWT(result.getResponse().getContentAsString());

        Assertions.assertThat(claims.getSubject()).isEqualTo(validNewUserRequest.getName());
    }

    @Test
    public void shouldHaveTheRedirectLocationInTheHeader() throws Exception {

        MvcResult result = mockMvc.perform(post("/api/user")
                .content(objectMapper.writeValueAsString(validNewUserRequest))
                .contentType(MediaType.APPLICATION_JSON)
        )
                .andExpect(status().is(201))
                .andReturn();


        Assertions.assertThat(result.getResponse().getHeader("Location"))
                .isEqualTo("/user/" + validNewUserRequest.getName().toLowerCase());
    }

    @Test
    public void shouldBeAbleToSeeIfAUserIsValid() throws Exception {

        mockMvc.perform(post("/api/user")
                .content(objectMapper.writeValueAsString(validNewUserRequest))
                .contentType(MediaType.APPLICATION_JSON)
        );

        mockMvc.perform(get("/api/user/" + "Jake")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt(validNewUserRequest.getName()))
        )
                .andExpect(status().is(200));

    }

    @Test
    public void shouldReturnAnUnauthorizedStatusIfTokenIsNotValid() throws Exception {

        mockMvc.perform(post("/api/user")
                .content(objectMapper.writeValueAsString(validNewUserRequest))
                .contentType(MediaType.APPLICATION_JSON)
        );

        mockMvc.perform(get("/api/user/" + validNewUserRequest.getName().toLowerCase())
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("invalid-name"))
        )
                .andExpect(status().is(403));

    }

    @Test
    public void shouldReturnTokenWithAValidUsernameAndPassword() throws Exception {

        userRepository.save(User.builder()
                .name(validNewUserRequest.getName())
                .password(passwordEncoder.encode(validNewUserRequest.getPassword()))
                .build());

        MvcResult result = mockMvc.perform(post("/api/user/login")
                .content(objectMapper.writeValueAsString(validNewUserRequest))
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(status().isOk())
                .andReturn();

        String jwt = result.getResponse().getContentAsString();
        Claims claims = decodeJWT(jwt);

        Assertions.assertThat(claims.getSubject()).isEqualTo(validNewUserRequest.getName());
    }

    @Test
    public void shouldReturnNullIfUserNotFound() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/user/login")
                .content(objectMapper.writeValueAsString(validNewUserRequest))
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(status().isNotFound())
                .andReturn();

        String jwt = result.getResponse().getContentAsString();
        Claims claims = decodeJWT(jwt);

        Assertions.assertThat(claims.getSubject()).isNull();
    }

    @Test
    public void shouldReturnNullIfBadUserPassword() throws Exception {
        userRepository.save(User.builder()
                .name(validNewUserRequest.getName())
                .password(passwordEncoder.encode(validNewUserRequest.getPassword()))
                .build());


        MvcResult result = mockMvc.perform(post("/api/user/login")
                .content(objectMapper.writeValueAsString(missingPasswordUser))
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(status().isNotFound())
                .andReturn();

        String jwt = result.getResponse().getContentAsString();
        Claims claims = decodeJWT(jwt);

        Assertions.assertThat(claims.getSubject()).isNull();
    }
}
