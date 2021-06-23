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

package com.ford.labs.retroquest.api.authorization;

import com.ford.labs.retroquest.team.Team;
import com.ford.labs.retroquest.users.User;
import com.ford.labs.retroquest.users.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class ApiAuthorizationTest {
    @Mock
    private UserRepository userRepository;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private ApiAuthorization apiAuthorization;
    private Set<Team> teams;

    @BeforeEach
    void setUp() {
        teams = new HashSet<>();
    }

    @Test
    void given_team_id_equals_the_authenticated_principal_when_request_authorized_return_true() {
        final String teamId = "bob";
        given(authentication.getPrincipal()).willReturn(teamId);

        assertThat(apiAuthorization.requestIsAuthorized(authentication, teamId)).isTrue();

    }

    @Test
    void given_logged_in_user_belongs_to_a_team_when_request_authorized_return_true() {
        final String teamName = "team";
        String loggedInUser = "bob";
        String teamId = "/team/uri";
        Team team = Team.builder()
                .name(teamName)
                .uri(teamId)
                .build();

        teams.add(team);

        User user = User.builder()
                .teams(teams)
                .build();

        given(authentication.getPrincipal()).willReturn(loggedInUser);
        Optional<User> expectedUser = Optional.ofNullable(user);
        given(userRepository.findByName(loggedInUser)).willReturn(expectedUser);

        assertThat(apiAuthorization.requestIsAuthorized(authentication, teamId)).isTrue();

    }

    @Test
    void given_a_teamId_that_is_not_authorized_a_when_request_authorized_return_false() {
        final String unauthorizedUser = "notAuthorized";
        String authorizedUser = "authorizedUser";
        given(authentication.getPrincipal()).willReturn(authorizedUser);
        Team authorizedTeam = Team.builder()
                .name(unauthorizedUser)
                .uri("/auth/team")
                .build();
        Set<Team> authorizedTeams = new HashSet<>();
        authorizedTeams.add(authorizedTeam);
        User user = User
                .builder()
                .teams(authorizedTeams)
                .build();
        given(userRepository.findByName(authorizedUser)).willReturn(Optional.ofNullable(user));

        assertThat(apiAuthorization.requestIsAuthorized(authentication, unauthorizedUser)).isFalse();
    }

}
