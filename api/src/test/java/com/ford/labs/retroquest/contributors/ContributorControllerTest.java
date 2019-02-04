package com.ford.labs.retroquest.contributors;

import org.assertj.core.api.Assertions;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.springframework.web.client.RestTemplate;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

public class ContributorControllerTest {
    private RestTemplate restTemplate;
    private ContributorController subject;

    private long MILLISECONDS_IN_DAY = 86400000;

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
        verify(restTemplate).getForObject(
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
        verify(restTemplate).getForObject(
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
        assertThat(response.get(0)).hasFieldOrPropertyWithValue("image", "AVATAR".getBytes());
        assertThat(response.get(0)).hasFieldOrPropertyWithValue("accountUrl", "accountUrl");
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
        verify(restTemplate, never()).getForObject(
                Mockito.eq("avatarUrl"),
                Mockito.any(),
                Mockito.any(Map.class)
        );
        assertThat(response).hasSize(0);
    }

    @Test
    public void getContributorsShouldNotQueryGithubApiWhenLastUpdateWasLessThanADayAgo() {
        subject.setEpochMilisOfLastRequest(System.currentTimeMillis());
        subject.getContributors();
        verify(restTemplate, never()).getForObject(Mockito.any(String.class), Mockito.any(), Mockito.any(Map.class));
    }

    @Test
    public void getContributorsShouldQueryGithubApiIfTheTimeSinceLastUpdateIsMoreThanADay() {
        GithubContributor[] data = {
                new GithubContributor("avatarUrl", "account/email-address")
        };
        Mockito.when(restTemplate.getForObject(
                Mockito.eq("https://api.github.com/repos/FordLabs/retroquest/contributors"),
                Mockito.eq(GithubContributor[].class),
                Mockito.any(Map.class)
        )).thenReturn(data);
        subject.setEpochMilisOfLastRequest(System.currentTimeMillis() - MILLISECONDS_IN_DAY - 1);
        subject.getContributors();
        verify(restTemplate, times(1)).getForObject(Mockito.eq("avatarUrl"), Mockito.any(), Mockito.any(Map.class));
    }

    @Test
    public void getContributorsShouldLoadResultsIntoCacheWhenCalled() {

        GithubContributor[] data = {
                new GithubContributor("avatarUrl", "account/email-address")
        };
        Mockito.when(restTemplate.getForObject(
                Mockito.eq("https://api.github.com/repos/FordLabs/retroquest/contributors"),
                Mockito.eq(GithubContributor[].class),
                Mockito.any(Map.class)
        )).thenReturn(data);
        List<Contributor> result = subject.getContributors();
        assertThat(result).isEqualTo(subject.getCachedContributors());
    }

    @Test
    public void getContributorsShouldReturnCachedResultsWhenNotCallingTheGithubApi() {
        subject.setEpochMilisOfLastRequest(System.currentTimeMillis());
        subject.setCachedContributors(Arrays.asList(new Contributor(new byte[]{}, "accountUrl")));
        List<Contributor> result = subject.getContributors();
        assertThat(result).isEqualTo(subject.getCachedContributors());
    }

}