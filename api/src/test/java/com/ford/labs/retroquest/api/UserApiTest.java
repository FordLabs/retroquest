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
import com.ford.labs.retroquest.users.NewUserRequest;
import com.ford.labs.retroquest.users.User;
import com.ford.labs.retroquest.users.UserRepository;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Tag("api")
class UserApiTest extends ApiTestBase {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final NewUserRequest validNewUserRequest = NewUserRequest.builder().name("jake").password("paul").build();
    private final NewUserRequest missingPasswordUser = NewUserRequest.builder().name("jake").password("").build();
    private final NewUserRequest missingNameUser = NewUserRequest.builder().name("").password("paul").build();

    @AfterEach
    void teardown() {
        userRepository.deleteAllInBatch();
        assertThat(userRepository.count()).isZero();
    }

    @Test
    void shouldHaveACreateNewUserEndpoint() throws Exception {

        mockMvc.perform(post("/api/user")
                .content(objectMapper.writeValueAsString(validNewUserRequest))
                .contentType(MediaType.APPLICATION_JSON)
        )
                .andExpect(status().is(201));

    }

    @Test
    void shouldSaveANewUserToTheDatabaseWithUserNameAndEncryptedPassword() throws Exception {

        mockMvc.perform(post("/api/user")
                .content(objectMapper.writeValueAsString(validNewUserRequest))
                .contentType(MediaType.APPLICATION_JSON)
        )
                .andExpect(status().is(201));


        assertThat(userRepository.count()).isEqualTo(1);

        User savedUser = userRepository.findAll().get(0);

        assertThat(savedUser.getName()).isEqualTo(validNewUserRequest.getName());
        assertThat(passwordEncoder
                .matches(validNewUserRequest.getPassword(), savedUser.getPassword()))
                .isTrue();
        assertThat(savedUser.getId()).isNotNull();
    }

    @Test
    void shouldNotSaveANewUserToTheDatabaseWithAMissingPassword() throws Exception {

        mockMvc.perform(post("/api/user")
                .content(objectMapper.writeValueAsString(missingPasswordUser))
                .contentType(MediaType.APPLICATION_JSON)
        )
                .andExpect(status().is(400));


        assertThat(userRepository.count()).isZero();
    }

    @Test
    void shouldNotSaveANewUserToTheDatabaseWithAMissingUserName() throws Exception {

        mockMvc.perform(post("/api/user")
                .content(objectMapper.writeValueAsString(missingNameUser))
                .contentType(MediaType.APPLICATION_JSON)
        )
                .andExpect(status().is(400));


        assertThat(userRepository.count()).isZero();
    }

    @Test
    void shouldReturnAJwtTokenWithTheUserNameAsTheSubject() throws Exception {

        MvcResult result = mockMvc.perform(post("/api/user")
                .content(objectMapper.writeValueAsString(validNewUserRequest))
                .contentType(MediaType.APPLICATION_JSON)
        )
                .andExpect(status().is(201))
                .andReturn();

        Claims claims = decodeJWT(result.getResponse().getContentAsString());

        assertThat(claims.getSubject()).isEqualTo(validNewUserRequest.getName());
    }

    @Test
    void shouldHaveTheRedirectLocationInTheHeader() throws Exception {

        MvcResult result = mockMvc.perform(post("/api/user")
                .content(objectMapper.writeValueAsString(validNewUserRequest))
                .contentType(MediaType.APPLICATION_JSON)
        )
                .andExpect(status().is(201))
                .andReturn();


        assertThat(result.getResponse().getHeader("Location"))
                .isEqualTo("/user/" + validNewUserRequest.getName().toLowerCase());
    }

    @Test
    void shouldBeAbleToSeeIfAUserIsValid() throws Exception {

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
    void shouldReturnAnUnauthorizedStatusIfTokenIsNotValid() throws Exception {

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
    void shouldReturnTokenWithAValidUsernameAndPassword() throws Exception {

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

        assertThat(claims.getSubject()).isEqualTo(validNewUserRequest.getName());
    }

    @Test
    void shouldReturnNullIfUserNotFound() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/user/login")
                .content(objectMapper.writeValueAsString(validNewUserRequest))
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(status().isNotFound())
                .andReturn();

        String jwt = result.getResponse().getContentAsString();
        Claims claims = decodeJWT(jwt);

        assertThat(claims.getSubject()).isNull();
    }

    @Test
    void shouldReturnNullIfBadUserPassword() throws Exception {
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

        assertThat(claims.getSubject()).isNull();
    }
}
