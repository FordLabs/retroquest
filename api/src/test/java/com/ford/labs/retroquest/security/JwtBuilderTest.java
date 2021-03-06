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

import io.jsonwebtoken.Jwts;
import org.apache.commons.lang3.StringUtils;
import org.junit.jupiter.api.Test;

import java.util.Base64;

import static org.assertj.core.api.Assertions.assertThat;

class JwtBuilderTest {

    private static final String JWT_SECRET = "IMSUCHAGOODSECRET";

    private final JwtBuilder jwtBuilder = new JwtBuilder(JWT_SECRET);

    @Test
    void canCreateSignedJwtWithParameters() {
        var teamId = "team-id";

        var jwt = jwtBuilder.buildJwt(teamId);

        var jwtHeader = StringUtils.substringBefore(jwt, ".");

        var parser = Jwts.parser();
        parser.requireIssuer("RetroQuest")
            .requireSubject("team-id")
            .setSigningKey(JWT_SECRET.getBytes())
            .parse(jwt);

        var decodedJwt = new String(Base64.getDecoder().decode(jwtHeader.getBytes()));

        assertThat(decodedJwt)
            .isEqualTo("{\"alg\":\"HS512\"}");
        assertThat(parser.isSigned(jwt)).isTrue();
    }
}
