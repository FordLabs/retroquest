package com.ford.labs.retroquest.deprecated_tests;

import com.ford.labs.retroquest.contributors.Contributor;
import com.ford.labs.retroquest.contributors.ContributorController;
import com.ford.labs.retroquest.contributors.GithubContributor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

public class ContributorControllerTest {
    private RestTemplate restTemplate;
    private ContributorController subject;

    @BeforeEach
    public void setUp() {
        restTemplate = Mockito.mock(RestTemplate.class);
        subject = new ContributorController(restTemplate);
    }

    @Test
    public void getContributors_GetsTheRepositoryDataFromGithub() {
        GithubContributor[] data = {};

        Mockito.when(restTemplate.getForObject(
                Mockito.eq("https://api.github.com/repos/FordLabs/retroquest/contributors"),
                Mockito.eq(GithubContributor[].class)
        )).thenReturn(data);

        subject.cacheContributors();
        subject.getContributors();

        verify(restTemplate).getForObject(
                Mockito.eq("https://api.github.com/repos/FordLabs/retroquest/contributors"),
                Mockito.eq(GithubContributor[].class)
        );
    }

    @Test
    public void getContributorsShouldGetTheAvatarsForEachContributor() {
        GithubContributor[] data = {
                new GithubContributor("avatarUrl", "")
        };

        Mockito.when(restTemplate.getForObject(
                Mockito.eq("https://api.github.com/repos/FordLabs/retroquest/contributors"),
                Mockito.eq(GithubContributor[].class)
        )).thenReturn(data);

        subject.cacheContributors();
        subject.getContributors();

        verify(restTemplate).getForObject(
                Mockito.eq("avatarUrl"),
                Mockito.eq(byte[].class)
        );
    }

    @Test
    public void getContributorsShouldConvertReturnedGithubContributorsToContributors() {
        GithubContributor[] data = {
                new GithubContributor("avatarUrl", "accountUrl")
        };

        Mockito.when(restTemplate.getForObject(
                Mockito.eq("https://api.github.com/repos/FordLabs/retroquest/contributors"),
                Mockito.eq(GithubContributor[].class)
        )).thenReturn(data);

        Mockito.when(restTemplate.getForObject(
                Mockito.eq("avatarUrl"),
                Mockito.eq(byte[].class)
        )).thenReturn("AVATAR".getBytes());

        subject.cacheContributors();
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
                Mockito.eq(GithubContributor[].class)
        )).thenReturn(data);
        List<Contributor> response = subject.getContributors();
        verify(restTemplate, never()).getForObject(
                Mockito.eq("avatarUrl"),
                Mockito.any()
        );
        assertThat(response).hasSize(0);
    }

    @Test
    public void getContributorsShouldNotQueryGithubApiWhenLastUpdateWasLessThanADayAgo() {
        subject.getContributors();
        verify(restTemplate, never()).getForObject(Mockito.any(String.class), Mockito.any());
    }

    @Test
    public void getContributorsShouldQueryGithubApiIfTheTimeSinceLastUpdateIsMoreThanADay() {
        GithubContributor[] data = {
                new GithubContributor("avatarUrl", "account/email-address")
        };
        Mockito.when(restTemplate.getForObject(
                Mockito.eq("https://api.github.com/repos/FordLabs/retroquest/contributors"),
                Mockito.eq(GithubContributor[].class)
        )).thenReturn(data);

        subject.cacheContributors();
        subject.getContributors();

        verify(restTemplate, times(1)).getForObject(Mockito.eq("avatarUrl"), Mockito.any());
    }

    @Test
    public void getContributorsShouldLoadResultsIntoCacheWhenCalled() {

        GithubContributor[] data = {
                new GithubContributor("avatarUrl", "account/email-address")
        };
        Mockito.when(restTemplate.getForObject(
                Mockito.eq("https://api.github.com/repos/FordLabs/retroquest/contributors"),
                Mockito.eq(GithubContributor[].class)
        )).thenReturn(data);
        List<Contributor> result = subject.getContributors();
        assertThat(result).isEqualTo(subject.getContributors());
    }

    @Test
    public void getContributorsShouldReturnCachedResultsWhenNotCallingTheGithubApi() {
        subject.setCachedContributors(Collections.singletonList(new Contributor(new byte[]{}, "accountUrl")));
        List<Contributor> result = subject.getContributors();
        assertThat(result).isEqualTo(subject.getContributors());
    }

}
