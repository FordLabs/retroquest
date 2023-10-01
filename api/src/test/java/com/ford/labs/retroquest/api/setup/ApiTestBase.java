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

package com.ford.labs.retroquest.api.setup;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ford.labs.retroquest.contributors.ContributorController;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

@AutoConfigureMockMvc
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Disabled
@Tag("api")
public abstract class ApiTestBase {

    @Autowired
    public ObjectMapper objectMapper;

    @Autowired
    public MockMvc mockMvc;

    @MockBean
    public ContributorController contributorController;

    @Value("${local.server.port}")
    private int port;

    private String bearerAuthToken;

    public String teamId;

    public String websocketUrl;

    @BeforeEach
    public void __setup() {
        teamId = "BeachBums";
        websocketUrl = "ws://localhost:" + port + "/websocket";
        bearerAuthToken = "Bearer fake-jwt";
    }

    public String getBearerAuthToken() {
        return bearerAuthToken;
    }
}
