/*
 * Copyright © 2018 Ford Motor Company
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

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;

import static org.assertj.core.api.Assertions.assertThat;

class JwtAuthenticationProviderTest {

    private JwtAuthenticationProvider jwtAuthenticationProvider = new JwtAuthenticationProvider();

    @Test
    void jwtWithInvalidFormatThrowsException() {
        Assertions.assertThrows(
                AuthenticationException.class,
                () -> jwtAuthenticationProvider.authenticate(new JwtAuthentication("", false, "SOSECRET")
            ));
    }

    @Test
    void shouldReturnAuthenticationWithTrueIfValidToken() {
        String unverifiedJwtString = new JwtBuilder("SOSECRET").buildJwt("a-team");
        JwtAuthentication unverifiedJwt = new JwtAuthentication(unverifiedJwtString, false, "SOSECRET");

        Authentication actualAuthentication = jwtAuthenticationProvider.authenticate(unverifiedJwt);

        assertThat(actualAuthentication.isAuthenticated()).isTrue();
        assertThat("a-team").isEqualTo(actualAuthentication.getPrincipal());
    }

}