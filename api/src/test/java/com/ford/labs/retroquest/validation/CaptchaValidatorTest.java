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

package com.ford.labs.retroquest.validation;

import com.ford.labs.retroquest.exception.CaptchaInvalidException;
import com.ford.labs.retroquest.team.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;

import static org.junit.Assert.assertThrows;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class CaptchaValidatorTest {

    @Mock
    private RestTemplate restTemplate;

    private CaptchaProperties captchaProperties = new CaptchaProperties();

    @Mock
    private TeamService teamService;

    @Mock
    private CaptchaService captchaService;

    private CaptchaValidator validator;

    @BeforeEach
    public void setUp () {
        captchaProperties.setSecret("secret");
        captchaProperties.setUrl("http://myUrl");
        captchaProperties.setFailedLoginThreshold(5);
        validator = new CaptchaValidator(restTemplate, captchaProperties, captchaService);
    }

    @Test
    public void whenCaptchaIsDisabled_returnsTrue () {
        captchaProperties.setEnabled(false);
        validator = new CaptchaValidator(restTemplate, captchaProperties, captchaService);

        LoginRequest loginRequest = new LoginRequest("name", "password", "invalidCaptcha");

        assertTrue(validator.isValid(loginRequest, null));
    }

    @Test
    public void whenFailedLoginAttemptsIsBelowThreshold_returnsTrue() {
        Team team = new Team();
        team.setFailedAttempts(2);

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setName("a-team");

        assertTrue(validator.isValid(loginRequest, null));
    }

    @Test
    public void whenFailedLoginAttemptsIsAboveThreshold_AndCaptchaIsEmpty_throwsCaptchaInvalidException () {
        Team team = new Team();
        team.setFailedAttempts(7);

        when(captchaService.isCaptchaEnabledForTeam("a-team")).thenReturn(true);

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setName("a-team");

        assertThrows(
                CaptchaInvalidException.class,
                () -> validator.isValid(loginRequest, null)
        );
    }

    @Test
    public void whenFailedLoginAttemptsIsAboveThreshold_AndCaptchaIsValid_returnsTrue () {
        Team team = new Team();
        team.setFailedAttempts(7);

        LoginRequest loginRequest = new LoginRequest("a-team", "password", "ValidCaptcha");

        assertTrue(validator.isValid(loginRequest, null));
    }

    @Test
    public void whenTeamIsNull_AndCaptchaIsInvalid_throwsCaptchaInvalidException() {
        when(restTemplate.getForObject("http://myUrl?secret={secret}&response={response}", ReCaptchaResponse.class, "secret", "InvalidCaptcha"))
                .thenReturn(new ReCaptchaResponse(false, Collections.emptyList()));
        CreateTeamRequest createTeamRequest = new CreateTeamRequest("name", "password", "InvalidCaptcha");

        assertThrows(
                CaptchaInvalidException.class,
                () -> validator.isValid(createTeamRequest, null)
        );
    }

    @Test
    public void whenTeamIsNull_AndCaptchaIsValid_returnsTrue() {
        when(restTemplate.getForObject("http://myUrl?secret={secret}&response={response}", ReCaptchaResponse.class, "secret", "ValidCaptcha"))
                .thenReturn(new ReCaptchaResponse(true, Collections.emptyList()));
        CreateTeamRequest createTeamRequest = new CreateTeamRequest("name", "password", "ValidCaptcha");

        validator.isValid(createTeamRequest, null);
    }
}
