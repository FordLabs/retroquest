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

package com.fordfacto.fordfactoweb.security;

import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import java.io.IOException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.mockito.Mockito.*;

public class JwtAuthenticationFilterTest {
    
    @Test
    public void callsDoFilterWhenSecurityIsNotSet() throws ServletException, IOException {
        JwtAuthenticationFilter authenticationFilter = new JwtAuthenticationFilter("SOSECRET");
        FilterChain filterChainMock = mock(FilterChain.class);
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = mock(MockHttpServletResponse.class);

        authenticationFilter.doFilterInternal(request, response, filterChainMock);

        assertNull(SecurityContextHolder.getContext().getAuthentication());
        verify(filterChainMock).doFilter(request, response);
    }

    @Test
    public void ifValidBearerHeaderIsSet_DontCallDoFilterAndSetAuthentication() throws ServletException, IOException {
        JwtAuthenticationFilter authenticationFilter = new JwtAuthenticationFilter("SOSECRET");
        String expectedJwt = new JwtBuilder("SOSECRET").buildJwt("anyteam");
        FilterChain filterChainMock = mock(FilterChain.class);
        MockHttpServletResponse response = mock(MockHttpServletResponse.class);
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer " + expectedJwt);

        JwtAuthentication expectedJwtAuthentication = new JwtAuthentication(expectedJwt, false, "SOSECRET");

        authenticationFilter.doFilterInternal(request, response, filterChainMock);

        assertEquals(expectedJwtAuthentication.getPrincipal(), SecurityContextHolder.getContext().getAuthentication().getPrincipal());
    }

    @Test
    public void ifRequestDoesnotHaveATokenInHeader_CallDoFilter() throws ServletException, IOException {
        JwtAuthenticationFilter authenticationFilter = new JwtAuthenticationFilter("SOSECRET");
        FilterChain filterChainMock = mock(FilterChain.class);
        MockHttpServletResponse response = mock(MockHttpServletResponse.class);
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer ");

        authenticationFilter.doFilterInternal(request, response, filterChainMock);

        assertNull(SecurityContextHolder.getContext().getAuthentication());

    }

}