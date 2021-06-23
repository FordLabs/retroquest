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

package com.ford.labs.retroquest.deprecated_tests;

import com.ford.labs.retroquest.contributors.Contributor;
import com.ford.labs.retroquest.contributors.ContributorsService;
import com.ford.labs.retroquest.contributors.GithubContributor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class ContributorServiceTest {
    @Mock(lenient = true)
    private RestTemplate restTemplate;
    private ContributorsService contributorService;
    private final String githubContributorsUrl = "https://api.github.com/repos/FordLabs/retroquest/contributors";
    private final String avatarUrl1 = "avatarUrl1";
    private final String accountUrl1 = "account1/email-address";
    private final String avatarUrl2 = "avatarUrl2";
    private final String accountUrl2 = "account2/email-address";
    private Contributor contributor1;
    private Contributor contributor2;

    @BeforeEach
    void setUp() {
        contributorService = new ContributorsService(restTemplate);
        contributor1 = new Contributor(avatarUrl1.getBytes(), accountUrl1);
        contributor2 = new Contributor(avatarUrl2.getBytes(), accountUrl2);
        given(restTemplate.getForObject(anyString(), eq(byte[].class)))
                .willAnswer(invocation -> invocation.getArgument(0, String.class).getBytes());
    }

    @Test
    void given_a_list_of_two_contributors_when_fetching_return_the_contributors() {
        GithubContributor[] githubContributors = {
                new GithubContributor(avatarUrl1, accountUrl1),
                new GithubContributor(avatarUrl2, accountUrl2),
        };

        List<Contributor> contributors = Arrays.asList(contributor1, contributor2);

        given(restTemplate.getForObject(
                githubContributorsUrl,
                GithubContributor[].class
        )).willReturn(githubContributors);

        List<Contributor> result = contributorService.getContributors();
        assertThat(result).isEqualTo(contributors);
    }


    @Test
    void given_a_list_of_two_contributors_with_one_invalid_email_address_when_fetching_return_one_valid_contributor() {

        GithubContributor[] githubContributors = {
                new GithubContributor(avatarUrl1, accountUrl1),
                new GithubContributor(avatarUrl2, accountUrl2 + "/invalid-email-address"),
        };

        given(restTemplate.getForObject(
                githubContributorsUrl,
                GithubContributor[].class
        )).willReturn(githubContributors);

        List<Contributor> result = contributorService.getContributors();
        assertThat(result).isEqualTo(Collections.singletonList(contributor1));
    }

    @Test
    void given_a_call_to_github_contributors_returns_null_when_fetching_contributors_return_empty_list() {
        given(restTemplate.getForObject(
                githubContributorsUrl,
                GithubContributor[].class))
                .willReturn(null);

        assertThat(contributorService.getContributors()).isEmpty();
    }
}
