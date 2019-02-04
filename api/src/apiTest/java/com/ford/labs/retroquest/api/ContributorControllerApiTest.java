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

package com.ford.labs.retroquest.api;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class ContributorControllerApiTest extends ControllerTest {

    @Autowired
    private RestTemplate restTemplate;

    @Test
    public void canRetrieveFromGithubApi() throws Exception {
        MockRestServiceServer mockGithub = MockRestServiceServer.bindTo(restTemplate).build();
        mockGithub.expect(requestTo("https://api.github.com/repos/FordLabs/retroquest/contributors"))
                .andRespond(withSuccess("" +
                        "[\n" +
                        "    {\n" +
                        "        \"avatar_url\": \"https://avatars0.githubusercontent.com/u/0000000?v=4\",\n" +
                        "        \"html_url\": \"profileUrl\"\n" +
                        "    }" +
                        "]", MediaType.APPLICATION_JSON));
        mockGithub.expect(requestTo("https://avatars0.githubusercontent.com/u/0000000?v=4"))
                .andRespond(withSuccess("THIS IS AN IMAGE", MediaType.IMAGE_PNG));
        mockMvc.perform(get("/api/contributors"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].accountUrl", is("profileUrl")))
                .andExpect(jsonPath("$[0].image", is(Base64.getEncoder().encodeToString("THIS IS AN IMAGE".getBytes()))));
    }
}
