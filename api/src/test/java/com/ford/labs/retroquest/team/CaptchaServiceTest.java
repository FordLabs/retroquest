package com.ford.labs.retroquest.team;

import com.ford.labs.retroquest.team.validation.CaptchaProperties;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.Optional;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.when;


@RunWith(MockitoJUnitRunner.class)
public class CaptchaServiceTest {

    @Mock
    private TeamRepository teamRepository;

    private CaptchaProperties captchaProperties = new CaptchaProperties();

    @Test
    public void returnsTrueWhenFailedLoginAttemptsIsAboveThreshold() {
        Team team = new Team();
        team.setFailedAttempts(5);

        captchaProperties.setEnabled(true);
        captchaProperties.setFailedLoginThreshold(4);
        CaptchaService captchaService = new CaptchaService(teamRepository, captchaProperties);

        when(teamRepository.findTeamByName("some team")).thenReturn(Optional.of(team));

        assertTrue(captchaService.isCaptchaEnabledForTeam("some team"));
    }

    @Test
    public void returnsFalseWhenFailedLoginAttemptsIsBelowThreshold() {
        Team team = new Team();
        team.setFailedAttempts(5);

        captchaProperties.setEnabled(true);
        captchaProperties.setFailedLoginThreshold(10);
        CaptchaService captchaService = new CaptchaService(teamRepository, captchaProperties);

        when(teamRepository.findTeamByName("some team")).thenReturn(Optional.of(team));

        assertFalse(captchaService.isCaptchaEnabledForTeam("some team"));
    }

    @Test
    public void returnsFalseWhenCaptchaIsDisabled() {
        Team team = new Team();
        team.setFailedAttempts(5);

        captchaProperties.setEnabled(false);
        CaptchaService captchaService = new CaptchaService(teamRepository, captchaProperties);

        assertFalse(captchaService.isCaptchaEnabledForTeam("some team"));
    }
}