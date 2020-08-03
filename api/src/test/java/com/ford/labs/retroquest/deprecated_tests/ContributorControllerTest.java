package com.ford.labs.retroquest.deprecated_tests;

import com.ford.labs.retroquest.contributors.Contributor;
import com.ford.labs.retroquest.contributors.ContributorController;
import com.ford.labs.retroquest.contributors.GithubContributor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;

@ExtendWith(MockitoExtension.class)
public class ContributorControllerTest {
    @Mock
    private RestTemplate restTemplate;
    private ContributorController contributorController;

    @BeforeEach
    public void setUp() {
        contributorController = new ContributorController(restTemplate);
    }

    @Test
    public void getContributors_GetsTheRepositoryDataFromGithub() {
        GithubContributor[] data = {};

        given(restTemplate.getForObject(
                Mockito.eq("https://api.github.com/repos/FordLabs/retroquest/contributors"),
                Mockito.eq(GithubContributor[].class)
        )).willReturn(data);

        contributorController.cacheContributors();
        contributorController.getContributors();

        then(restTemplate).should().getForObject(
                Mockito.eq("https://api.github.com/repos/FordLabs/retroquest/contributors"),
                Mockito.eq(GithubContributor[].class)
        );
    }

    @Test
    public void getContributorsShouldGetTheAvatarsForEachContributor() {
        GithubContributor[] data = {
                new GithubContributor("avatarUrl", "")
        };

        given(restTemplate.getForObject(
                Mockito.eq("https://api.github.com/repos/FordLabs/retroquest/contributors"),
                Mockito.eq(GithubContributor[].class)
        )).willReturn(data);

        contributorController.cacheContributors();
        contributorController.getContributors();

        then(restTemplate).should().getForObject(
                Mockito.eq("avatarUrl"),
                Mockito.eq(byte[].class)
        );
    }
    @Test
    public void getContributorsShouldSetEmptyContributorsWhenEmailIsInvalid() {
        GithubContributor[] data = {
                new GithubContributor("avatarUrl", "person/invalid-email-address")
        };

        given(restTemplate.getForObject(
                Mockito.eq("https://api.github.com/repos/FordLabs/retroquest/contributors"),
                Mockito.eq(GithubContributor[].class)
        )).willReturn(data);

        contributorController.cacheContributors();
        then(restTemplate).should(never()).getForObject( Mockito.eq("avatarUrl"), Mockito.eq(byte[].class));
        assertThat(contributorController.getContributors()).isEmpty();
    }

    @Test
    public void getContributorsShouldConvertReturnedGithubContributorsToContributors() {
        GithubContributor[] data = {
                new GithubContributor("avatarUrl", "accountUrl")
        };

        given(restTemplate.getForObject(
                Mockito.eq("https://api.github.com/repos/FordLabs/retroquest/contributors"),
                Mockito.eq(GithubContributor[].class)
        )).willReturn(data);

        given(restTemplate.getForObject(
                Mockito.eq("avatarUrl"),
                Mockito.eq(byte[].class)
        )).willReturn("AVATAR".getBytes());

        contributorController.cacheContributors();
        List<Contributor> response = contributorController.getContributors();

        assertThat(response.get(0)).hasFieldOrPropertyWithValue("image", "AVATAR".getBytes());
        assertThat(response.get(0)).hasFieldOrPropertyWithValue("accountUrl", "accountUrl");
    }

    @Test
    public void getContributorsShouldFilterContributorWithAccountUrlEndingInInvalidEmailAddress() {
        GithubContributor[] data = {
                new GithubContributor("avatarUrl", "acount/invalid-email-address")
        };
        given(restTemplate.getForObject(
                Mockito.eq("https://api.github.com/repos/FordLabs/retroquest/contributors"),
                Mockito.eq(GithubContributor[].class)
        )).willReturn(data);
        contributorController.cacheContributors();
        List<Contributor> response = contributorController.getContributors();
        then(restTemplate).should(never()).getForObject(
                Mockito.eq("avatarUrl"),
                Mockito.any()
        );
        assertThat(response).hasSize(0);
    }

    @Test
    public void getContributorsShouldNotQueryGithubApiWhenLastUpdateWasLessThanADayAgo() {
        contributorController.getContributors();
        then(restTemplate).should(never()).getForObject(Mockito.any(String.class), Mockito.any());
    }

    @Test
    public void getContributorsShouldQueryGithubApiIfTheTimeSinceLastUpdateIsMoreThanADay() {
        GithubContributor[] data = {
                new GithubContributor("avatarUrl", "account/email-address")
        };
        given(restTemplate.getForObject(
                Mockito.eq("https://api.github.com/repos/FordLabs/retroquest/contributors"),
                Mockito.eq(GithubContributor[].class)
        )).willReturn(data);

        contributorController.cacheContributors();
        contributorController.getContributors();

        then(restTemplate).should(times(1)).getForObject(Mockito.eq("avatarUrl"), Mockito.any());
    }

    @Test
    public void getContributorsShouldLoadResultsIntoCacheWhenCalled() {

        GithubContributor[] data = {
                new GithubContributor("avatarUrl", "account/email-address")
        };
        given(restTemplate.getForObject(
                Mockito.eq("https://api.github.com/repos/FordLabs/retroquest/contributors"),
                Mockito.eq(GithubContributor[].class)
        )).willReturn(data);
        contributorController.cacheContributors();
        List<Contributor> result = contributorController.getContributors();
        assertThat(result).isEqualTo(contributorController.getContributors());
    }

    @Test
    public void getContributorsShouldReturnCachedResultsWhenNotCallingTheGithubApi() {
        contributorController.setCachedContributors(Collections.singletonList(new Contributor(new byte[]{}, "accountUrl")));
        List<Contributor> result = contributorController.getContributors();
        assertThat(result).isEqualTo(contributorController.getContributors());
    }

}
