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

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.AuthenticationException;

import static org.assertj.core.api.Assertions.assertThat;

class JwtAuthenticationProviderTest {

    private final JwtAuthenticationProvider jwtAuthenticationProvider = new JwtAuthenticationProvider();

    @Test
    void jwtWithInvalidFormatThrowsException() {
        var invalidJwt = new JwtAuthentication("", false, "SOSECRET");
        Assertions.assertThrows(
            AuthenticationException.class,
            () -> jwtAuthenticationProvider.authenticate(invalidJwt)
        );
    }

    @Test
    void shouldReturnAuthenticationWithTrueIfValidToken() {
        var unverifiedJwtString = new JwtBuilder("SOSECRET").buildJwt("a-team");
        var unverifiedJwt = new JwtAuthentication(unverifiedJwtString, false, "SOSECRET");

        var actualAuthentication = jwtAuthenticationProvider.authenticate(unverifiedJwt);

        assertThat(actualAuthentication.isAuthenticated()).isTrue();
        assertThat(actualAuthentication.getPrincipal())
            .isEqualTo("a-team");
    }
}
