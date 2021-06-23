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

import com.ford.labs.retroquest.users.User;
import com.ford.labs.retroquest.users.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;

@Service
public class ApiAuthorization {

    private final UserRepository userRepository;

    public ApiAuthorization(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean requestIsAuthorized(Authentication authentication, String teamId) {
        return teamId.equals(authentication.getPrincipal()) || teamBelongsToUser(authentication, teamId);
    }

    private boolean teamBelongsToUser(Authentication authentication, String teamId) {
        Optional<User> foundUser = userRepository.findByName(authentication.getPrincipal().toString());
        return foundUser.map(user -> user.getTeams()
                .stream()
                .anyMatch(team -> Objects.requireNonNull(team.getId()).equals(teamId))).orElse(false);
    }
}
