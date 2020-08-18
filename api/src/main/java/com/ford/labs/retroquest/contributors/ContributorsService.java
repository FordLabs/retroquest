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
