package com.ford.labs.retroquest.deprecated_tests;

import com.ford.labs.retroquest.team.CaptchaService;
import com.ford.labs.retroquest.team.Team;
import com.ford.labs.retroquest.team.TeamRepository;
import com.ford.labs.retroquest.validation.CaptchaProperties;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)
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

        when(teamRepository.findTeamByNameIgnoreCase("some team")).thenReturn(Optional.of(team));

        assertTrue(captchaService.isCaptchaEnabledForTeam("some team"));
    }

    @Test
    public void returnsFalseWhenFailedLoginAttemptsIsBelowThreshold() {
        Team team = new Team();
        team.setFailedAttempts(5);

        captchaProperties.setEnabled(true);
        captchaProperties.setFailedLoginThreshold(10);
        CaptchaService captchaService = new CaptchaService(teamRepository, captchaProperties);

        when(teamRepository.findTeamByNameIgnoreCase("some team")).thenReturn(Optional.of(team));

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

    @Test
    public void trimsSpaceFromTramName() {
        Team team = new Team();
        team.setFailedAttempts(5);

        captchaProperties.setEnabled(true);
        captchaProperties.setFailedLoginThreshold(4);
        CaptchaService captchaService = new CaptchaService(teamRepository, captchaProperties);

        when(teamRepository.findTeamByNameIgnoreCase("some team")).thenReturn(Optional.of(team));

        assertTrue(captchaService.isCaptchaEnabledForTeam("    some team     "));
    }

    @Test
    public void handlesNullFailedAttempts() {
        Team team = new Team();
        captchaProperties.setEnabled(true);
        captchaProperties.setFailedLoginThreshold(1);
        when(teamRepository.findTeamByNameIgnoreCase("some team")).thenReturn(Optional.of(team));

        CaptchaService captchaService = new CaptchaService(teamRepository, captchaProperties);

        assertFalse(captchaService.isCaptchaEnabledForTeam("some team"));
    }
}
