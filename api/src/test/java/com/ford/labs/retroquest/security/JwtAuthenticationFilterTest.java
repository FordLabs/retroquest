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

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

class JwtAuthenticationFilterTest {

    private MockHttpServletRequest request;
    private MockHttpServletResponse response;
    private FilterChain filterChainMock;

    @BeforeEach
    void setup() {
        request = new MockHttpServletRequest();
        response = mock(MockHttpServletResponse.class);
        SecurityContextHolder.getContext().setAuthentication(null);
        filterChainMock = mock(FilterChain.class);
    }

    @Test
    void should_call_security_filter_when_security_is_not_set() throws ServletException, IOException {

        JwtAuthenticationFilter authenticationFilter = new JwtAuthenticationFilter("SOSECRET");

        authenticationFilter.doFilterInternal(request, response, filterChainMock);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(filterChainMock).doFilter(request, response);
    }

    @Test
    void ifValidBearerHeaderIsSet_DontCallDoFilterAndSetAuthentication() throws ServletException, IOException {
        JwtAuthenticationFilter authenticationFilter = new JwtAuthenticationFilter("SOSECRET");

        String expectedJwt = new JwtBuilder("SOSECRET").buildJwt("anyteam");

        request.addHeader("Authorization", "Bearer " + expectedJwt);

        JwtAuthentication expectedJwtAuthentication = new JwtAuthentication(expectedJwt, false, "SOSECRET");

        authenticationFilter.doFilterInternal(request, response, filterChainMock);

        assertThat(expectedJwtAuthentication.getPrincipal()).isEqualTo(SecurityContextHolder.getContext().getAuthentication().getPrincipal());
    }

    @Test
    void ifRequestDoesnotHaveATokenInHeader_CallDoFilter() throws ServletException, IOException {
        request.addHeader("Authorization", "Bearer ");

        JwtAuthenticationFilter authenticationFilter = new JwtAuthenticationFilter("SOSECRET");
        authenticationFilter.doFilterInternal(request, response, filterChainMock);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();

    }

}