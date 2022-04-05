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

package com.ford.labs.retroquest.security;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

class TeamAuthorizationTest {

    private final Authentication authentication = mock(Authentication.class);
    private final TeamAuthorization teamAuthorization = new TeamAuthorization();

    @Test
    void requestIsAuthorized_WithMatchingPrincipal_ReturnsTrue() {
        given(authentication.getPrincipal()).willReturn("teamId");
        assertThat(teamAuthorization.requestIsAuthorized(authentication, "teamId")).isTrue();
    }

    @Test
    void requestIsAuthorized_WithoutMatchingPrincipal_ReturnsFalse() {
        given(authentication.getPrincipal()).willReturn("notAuthorized");
        assertThat(teamAuthorization.requestIsAuthorized(authentication, "teamId")).isFalse();
    }

}
