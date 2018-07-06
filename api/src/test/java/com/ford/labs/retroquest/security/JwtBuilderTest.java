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

import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import org.apache.commons.lang3.StringUtils;
import org.junit.Test;
import org.springframework.security.crypto.codec.Base64;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class JwtBuilderTest {

    private static final String JWT_SECRET = "IMSUCHAGOODSECRET";

    private JwtBuilder jwtBuilder = new JwtBuilder(JWT_SECRET);

    @Test
    public void canCreateSignedJwtWithParameters() {
        String teamId = "team-id";

        String jwt = jwtBuilder.buildJwt(teamId);
        String jwtHeader = StringUtils.substringBefore(jwt,".");

        assertEquals("{\"alg\":\"HS512\"}", new String(Base64.decode(jwtHeader.getBytes())));

        JwtParser parser = Jwts.parser();
        parser.requireIssuer("RetroQuest")
                .requireSubject("team-id")
                .setSigningKey(JWT_SECRET.getBytes())
                .parse(jwt);
        assertTrue(parser.isSigned(jwt));
    }
}