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

package com.ford.labs.retroquest.contributors;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static java.util.stream.Collectors.toList;

@Service
public class ContributorsService {
    private static final long MILLISECONDS_IN_DAY = 86400000;
    private final RestTemplate restTemplate;

    public ContributorsService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Cacheable("contributors")
    public List<Contributor> getContributors() {
        GithubContributor[] response = Optional.ofNullable(restTemplate.getForObject(
                "https://api.github.com/repos/FordLabs/retroquest/contributors",
                GithubContributor[].class
        )).orElse(new GithubContributor[0]);

        List<GithubContributor> githubContributors = Arrays.asList(response);

        return githubContributors.stream()
                .filter(githubContributor -> !githubContributor.getAccountUrl().endsWith("/invalid-email-address"))
                .map(githubContributor -> new Contributor(
                        restTemplate.getForObject(githubContributor.getAvatarUrl(), byte[].class), githubContributor.getAccountUrl()
                )).collect(toList());
    }

    @CacheEvict(allEntries = true, value = "contributors")
    @Scheduled(fixedRate = MILLISECONDS_IN_DAY)
    public void clearContributorsCache() {
        // For Sonarqube
    }
}
