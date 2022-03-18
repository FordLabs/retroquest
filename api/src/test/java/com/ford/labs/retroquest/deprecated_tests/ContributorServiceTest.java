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
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ContributorServiceTest {

    private final String githubContributorsUrl = "https://api.github.com/repos/FordLabs/retroquest/contributors";
    private final String avatarUrl1 = "avatarUrl1";
    private final String accountUrl1 = "account1/email-address";
    private final String avatarUrl2 = "avatarUrl2";
    private final String accountUrl2 = "account2/email-address";
    private final Contributor contributor1 = new Contributor(avatarUrl1.getBytes(StandardCharsets.UTF_8), accountUrl1);
    private final Contributor contributor2 = new Contributor(avatarUrl2.getBytes(StandardCharsets.UTF_8), accountUrl2);

    private final RestTemplate mockRestTemplate = mock(RestTemplate.class);
    private final ContributorsService subject = new ContributorsService(mockRestTemplate);

    @BeforeEach
    void setUp() {
        when(mockRestTemplate.getForObject(avatarUrl1, byte[].class)).thenReturn(contributor1.image());
        when(mockRestTemplate.getForObject(avatarUrl2, byte[].class)).thenReturn(contributor2.image());
    }

    @Test
    void given_a_list_of_two_contributors_when_fetching_return_the_contributors() {
        var githubContributors = new GithubContributor[]{
            new GithubContributor(avatarUrl1, accountUrl1),
            new GithubContributor(avatarUrl2, accountUrl2),
        };

        when(mockRestTemplate.getForObject(githubContributorsUrl, GithubContributor[].class))
            .thenReturn(githubContributors);

        var result = subject.getContributors();
        assertThat(result).containsExactly(contributor1, contributor2);
    }


    @Test
    void given_a_list_of_two_contributors_with_one_invalid_email_address_when_fetching_return_one_valid_contributor() {

        var githubContributors = new GithubContributor[]{
            new GithubContributor(avatarUrl1, accountUrl1),
            new GithubContributor(avatarUrl2, accountUrl2 + "/invalid-email-address"),
        };

        when(mockRestTemplate.getForObject(githubContributorsUrl, GithubContributor[].class))
            .thenReturn(githubContributors);

        var result = subject.getContributors();
        assertThat(result).containsExactly(contributor1);
    }

    @Test
    void given_a_call_to_github_contributors_returns_null_when_fetching_contributors_return_empty_list() {
        when(mockRestTemplate.getForObject(githubContributorsUrl, GithubContributor[].class))
            .thenReturn(null);

        assertThat(subject.getContributors()).isEmpty();
    }
}
