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
class CaptchaServiceTest {

    @Mock
    private TeamRepository teamRepository;

    @Test
    void returnsTrueWhenFailedLoginAttemptsIsAboveThreshold() {
        Team team = new Team();
        team.setFailedAttempts(5);

        var captchaProperties = new CaptchaProperties(null, null, true, 4);
        var captchaService = new CaptchaService(teamRepository, captchaProperties);

        when(teamRepository.findTeamByNameIgnoreCase("some team")).thenReturn(Optional.of(team));

        assertTrue(captchaService.isCaptchaEnabledForTeam("some team"));
    }

    @Test
    void returnsFalseWhenFailedLoginAttemptsIsBelowThreshold() {
        Team team = new Team();
        team.setFailedAttempts(5);

        var captchaProperties = new CaptchaProperties(null, null, true, 10);
        var captchaService = new CaptchaService(teamRepository, captchaProperties);

        when(teamRepository.findTeamByNameIgnoreCase("some team")).thenReturn(Optional.of(team));

        assertFalse(captchaService.isCaptchaEnabledForTeam("some team"));
    }

    @Test
    void returnsFalseWhenCaptchaIsDisabled() {
        Team team = new Team();
        team.setFailedAttempts(5);

        var captchaProperties = new CaptchaProperties(null, null, false, 0);
        var captchaService = new CaptchaService(teamRepository, captchaProperties);

        assertFalse(captchaService.isCaptchaEnabledForTeam("some team"));
    }

    @Test
    void trimsSpaceFromTramName() {
        Team team = new Team();
        team.setFailedAttempts(5);

        var captchaProperties = new CaptchaProperties(null, null, true, 4);
        var captchaService = new CaptchaService(teamRepository, captchaProperties);

        when(teamRepository.findTeamByNameIgnoreCase("some team")).thenReturn(Optional.of(team));

        assertTrue(captchaService.isCaptchaEnabledForTeam("    some team     "));
    }

    @Test
    void handlesNullFailedAttempts() {
        Team team = new Team();

        when(teamRepository.findTeamByNameIgnoreCase("some team")).thenReturn(Optional.of(team));
        var captchaProperties = new CaptchaProperties(null, null, true, 1);

        var captchaService = new CaptchaService(teamRepository, captchaProperties);

        assertFalse(captchaService.isCaptchaEnabledForTeam("some team"));
    }
}
