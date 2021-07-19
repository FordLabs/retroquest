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

import com.ford.labs.retroquest.exception.UserUnauthenticatedException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class JwtAuthenticationProviderTest {

    private static final String INVALID_JWT = "eyJhbGciOiJIUzUxMiJ9.eyJleHAiOjE2MjY4ODA4NzYsInN1YiI6InRlc3QiLCJpc3MiOiJSZXRyb1F1ZXN0In0.AJgA5Bhr-MZgBFyQV64BphMKJ7ScK5roBLBL7K2KSyGMl5snrhQ6yxmIwMFffC7m3aZ1kCA-y_QvaGIqru37LQ";
    private static final String INVALID_JWT_SIGNATURE_STRING = "JWT signature does not match locally computed signature. JWT validity cannot be asserted and should not be trusted.";
    private final JwtAuthenticationProvider jwtAuthenticationProvider = new JwtAuthenticationProvider();

    @Test
    void jwtWithInvalidFormatThrowsUserUnauthenticatedException() {
        var invalidJwt = new JwtAuthentication(INVALID_JWT, false, "SOSECRET");
        var exception = Assertions.assertThrows(
                UserUnauthenticatedException.class,
                () -> jwtAuthenticationProvider.authenticate(invalidJwt)
        );
        assertThat(exception.getMessage()).isEqualTo(INVALID_JWT_SIGNATURE_STRING);
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
