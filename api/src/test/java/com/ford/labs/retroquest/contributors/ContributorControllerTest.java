package com.ford.labs.retroquest.contributors;

import org.assertj.core.api.Assertions;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.*;
import static org.mockito.Mockito.never;

public class ContributorControllerTest {

    private RestTemplate restTemplate;
    private ContributorController subject;

    @Before
    public void setUp() {
        restTemplate = Mockito.mock(RestTemplate.class);
        subject = new ContributorController(restTemplate);
    }

    @Test
    public void getContributorsGetsTheRepositoryDataFromGithub() {
        GithubContributor[] data = {};

        Mockito.when(restTemplate.getForObject(
                Mockito.eq("https://api.github.com/repos/FordLabs/retroquest/contributors"),
                Mockito.eq(GithubContributor[].class),
                Mockito.any(Map.class)
        )).thenReturn(data);
        subject.getContributors();
        Mockito.verify(restTemplate).getForObject(
                Mockito.eq("https://api.github.com/repos/FordLabs/retroquest/contributors"),
                Mockito.eq(GithubContributor[].class),
                Mockito.any(Map.class)
        );
    }

    @Test
    public void getContributorsShouldGetTheAvatarsForEachContributor() {
        GithubContributor[] data = {
                new GithubContributor("avatarUrl", "")
        };

        Mockito.when(restTemplate.getForObject(
                Mockito.eq("https://api.github.com/repos/FordLabs/retroquest/contributors"),
                Mockito.eq(GithubContributor[].class),
                Mockito.any(Map.class)
        )).thenReturn(data);
        subject.getContributors();
        Mockito.verify(restTemplate).getForObject(
                Mockito.eq("avatarUrl"),
                Mockito.eq(byte[].class),
                Mockito.any(Map.class)
        );
    }

    @Test
    public void getContributorsShoulConvertRetrunedGithubContributorsToContributors() {
        GithubContributor[] data = {
                new GithubContributor("avatarUrl", "accountUrl")
        };

        Mockito.when(restTemplate.getForObject(
                Mockito.eq("https://api.github.com/repos/FordLabs/retroquest/contributors"),
                Mockito.eq(GithubContributor[].class),
                Mockito.any(Map.class)
        )).thenReturn(data);
        Mockito.when(restTemplate.getForObject(
                Mockito.eq("avatarUrl"),
                Mockito.eq(byte[].class),
                Mockito.any(Map.class)
        )).thenReturn("AVATAR".getBytes());
        List<Contributor> response = subject.getContributors();
        Assertions.assertThat(response.get(0)).hasFieldOrPropertyWithValue("image", "AVATAR".getBytes());
        Assertions.assertThat(response.get(0)).hasFieldOrPropertyWithValue("accountUrl", "accountUrl");
    }

    @Test
    public void getContributorsShouldFiterContributorWithAccountUrlEndingInInvalidEmailAddress() {
        GithubContributor[] data = {
                new GithubContributor("avatarUrl", "acount/invalid-email-address")
        };
        Mockito.when(restTemplate.getForObject(
                Mockito.eq("https://api.github.com/repos/FordLabs/retroquest/contributors"),
                Mockito.eq(GithubContributor[].class),
                Mockito.any(Map.class)
        )).thenReturn(data);
        List<Contributor> response = subject.getContributors();
        Mockito.verify(restTemplate, never()).getForObject(
                Mockito.eq("avatarUrl"),
                Mockito.any(),
                Mockito.any(Map.class)
        );
        Assertions.assertThat(response).hasSize(0);
    }

}