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

package com.ford.labs.retroquest.validation;

import com.ford.labs.retroquest.exception.CaptchaInvalidException;
import com.ford.labs.retroquest.team.CaptchaService;
import com.ford.labs.retroquest.team.CreateTeamRequest;
import com.ford.labs.retroquest.team.LoginRequest;
import com.ford.labs.retroquest.team.Team;
import org.junit.jupiter.api.Test;
import org.springframework.web.client.RestTemplate;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class CaptchaValidatorTest {
    private final RestTemplate mockRestTemplate = mock(RestTemplate.class);
    private final CaptchaService mockCaptchaService = mock(CaptchaService.class);
    private final CaptchaProperties captchaProperties = new CaptchaProperties("secret", "http://myUrl", true, 5);

    private final CaptchaValidator subject = new CaptchaValidator(mockRestTemplate, captchaProperties, mockCaptchaService);

    @Test
    void whenCaptchaIsDisabled_returnsTrue() {
        var captchaProperties = new CaptchaProperties(null, null, false, 0);
        var subject = new CaptchaValidator(mockRestTemplate, captchaProperties, mockCaptchaService);

        var loginRequest = new LoginRequest("name", "password", "invalidCaptcha");

        assertThat(subject.isValid(loginRequest, null)).isTrue();
    }

    @Test
    void whenFailedLoginAttemptsIsBelowThreshold_returnsTrue() {
        var team = new Team();
        team.setFailedAttempts(2);

        var loginRequest = new LoginRequest();
        loginRequest.setName("a-team");

        assertThat(subject.isValid(loginRequest, null)).isTrue();
    }

    @Test
    void whenFailedLoginAttemptsIsAboveThreshold_AndCaptchaIsEmpty_throwsCaptchaInvalidException() {
        var team = new Team();
        team.setFailedAttempts(7);

        when(mockCaptchaService.isCaptchaEnabledForTeam("a-team")).thenReturn(true);

        var loginRequest = new LoginRequest();
        loginRequest.setName("a-team");

        assertThrows(
            CaptchaInvalidException.class,
            () -> subject.isValid(loginRequest, null)
        );
    }

    @Test
    void whenFailedLoginAttemptsIsAboveThreshold_AndCaptchaIsValid_returnsTrue() {
        var team = new Team();
        team.setFailedAttempts(7);

        var loginRequest = new LoginRequest("a-team", "password", "ValidCaptcha");

        assertThat(subject.isValid(loginRequest, null)).isTrue();
    }

    @Test
    void whenTeamIsNull_AndCaptchaIsInvalid_throwsCaptchaInvalidException() {
        when(mockRestTemplate.getForObject("http://myUrl?secret={secret}&response={response}", ReCaptchaResponse.class,
            "secret", "InvalidCaptcha"))
            .thenReturn(new ReCaptchaResponse(false, List.of()));
        var createTeamRequest = new CreateTeamRequest("name", "password", "InvalidCaptcha");

        assertThrows(
            CaptchaInvalidException.class,
            () -> subject.isValid(createTeamRequest, null)
        );
    }

    @Test
    void whenTeamIsNull_AndCaptchaIsValid_returnsTrue() {
        when(
            mockRestTemplate.getForObject(
                "http://myUrl?secret={secret}&response={response}",
                ReCaptchaResponse.class,
                "secret",
                "ValidCaptcha"
            )
        ).thenReturn(new ReCaptchaResponse(true, List.of()));
        var createTeamRequest = new CreateTeamRequest("name", "password", "ValidCaptcha");

        assertThat(subject.isValid(createTeamRequest, null)).isTrue();
    }
}
