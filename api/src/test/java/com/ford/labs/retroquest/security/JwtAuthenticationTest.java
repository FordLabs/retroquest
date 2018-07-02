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

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class JwtAuthenticationTest {

    @Test
    public void getNameOnTokenWithValidJwt_ReturnsSubject() {
        String jwt = new JwtBuilder("SOSECRET").buildJwt("i-am-a-team");

        JwtAuthentication authentication = new JwtAuthentication(jwt, false, "SOSECRET");

        assertEquals("i-am-a-team", authentication.getPrincipal());
    }

}