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

package com.ford.labs.retroquest.contributors;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

@RestController
public class ContributorController {

    private static final long MILLISECONDS_IN_DAY = 86400000;

    private final RestTemplate restTemplate;

    private CopyOnWriteArrayList<Contributor> cachedContributors = new CopyOnWriteArrayList<>();

    public ContributorController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @GetMapping("/api/contributors")
    public List<Contributor> getContributors() {
        return cachedContributors;
    }

    @Scheduled(fixedRate = MILLISECONDS_IN_DAY)
    public void cacheContributors() {
        GithubContributor[] response = this.restTemplate.getForObject(
                "https://api.github.com/repos/FordLabs/retroquest/contributors",
                GithubContributor[].class
        );

        List<Contributor> newContributors = Arrays.stream(response)
                .filter(githubContributor -> !githubContributor.getAccountUrl().endsWith("/invalid-email-address"))
                .map(githubContributor -> new Contributor(
                        getAvatar(githubContributor.getAvatarUrl()), githubContributor.getAccountUrl()
                )).collect(Collectors.toList());

        this.setCachedContributors(newContributors);
    }

    private byte[] getAvatar(String avatarUrl) {
        return this.restTemplate.getForObject(avatarUrl, byte[].class);
    }

    public List<Contributor> getCachedContributors() {
        return cachedContributors;
    }

    public void setCachedContributors(List<Contributor> contributors) {
        this.cachedContributors.clear();
        this.cachedContributors.addAll(contributors);
    }
}
