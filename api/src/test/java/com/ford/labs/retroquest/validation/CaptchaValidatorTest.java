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
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;

import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class CaptchaValidatorTest {

    @Mock
    private RestTemplate restTemplate;

    private CaptchaProperties captchaProperties = new CaptchaProperties();

    @Mock
    private TeamService teamService;

    @Mock
    private CaptchaService captchaService;

    private CaptchaValidator validator;

    @Before
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
        when(teamService.getTeamByName("a-team")).thenReturn(team);

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setName("a-team");

        assertTrue(validator.isValid(loginRequest, null));
    }

    @Test(expected = CaptchaInvalidException.class)
    public void whenFailedLoginAttemptsIsAboveThreshold_AndCaptchaIsEmpty_throwsCaptchaInvalidException () {
        Team team = new Team();
        team.setFailedAttempts(7);

        when(teamService.getTeamByName("a-team")).thenReturn(team);
        when(captchaService.isCaptchaEnabledForTeam("a-team")).thenReturn(true);

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setName("a-team");

        validator.isValid(loginRequest, null);
    }

    @Test(expected = CaptchaInvalidException.class)
    public void whenFailedLoginAttemptsIsAboveThreshold_AndCaptchaIsInvalid_throwsCaptchaInvalidException () {
        Team team = new Team();
        team.setFailedAttempts(7);

        when(teamService.getTeamByName("a-team")).thenReturn(team);
        when(captchaService.isCaptchaEnabledForTeam("a-team")).thenReturn(true);
        when(restTemplate.getForObject("http://myUrl?secret={secret}&response={response}", ReCaptchaResponse.class, "secret", "InvalidCaptcha"))
                .thenReturn(new ReCaptchaResponse(false, Collections.emptyList()));

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setName("a-team");

        validator.isValid(loginRequest, null);
    }

    @Test
    public void whenFailedLoginAttemptsIsAboveThreshold_AndCaptchaIsValid_returnsTrue () {
        Team team = new Team();
        team.setFailedAttempts(7);

        when(teamService.getTeamByName("a-team")).thenReturn(team);
        when(restTemplate.getForObject("http://myUrl?secret={secret}&response={response}", ReCaptchaResponse.class, "secret", "ValidCaptcha"))
                .thenReturn(new ReCaptchaResponse(true, Collections.emptyList()));

        LoginRequest loginRequest = new LoginRequest("a-team", "password", "ValidCaptcha");

        assertTrue(validator.isValid(loginRequest, null));
    }

    @Test(expected = CaptchaInvalidException.class)
    public void whenTeamIsNull_AndCaptchaIsInvalid_throwsCaptchaInvalidException() {
        when(teamService.getTeamByName("b-team")).thenReturn(null);
        when(restTemplate.getForObject("http://myUrl?secret={secret}&response={response}", ReCaptchaResponse.class, "secret", "InvalidCaptcha"))
                .thenReturn(new ReCaptchaResponse(false, Collections.emptyList()));
        CreateTeamRequest createTeamRequest = new CreateTeamRequest("name", "password", "InvalidCaptcha");

        validator.isValid(createTeamRequest, null);
    }

    @Test
    public void whenTeamIsNull_AndCaptchaIsValid_returnsTrue() {
        when(teamService.getTeamByName("b-team")).thenReturn(null);
        when(restTemplate.getForObject("http://myUrl?secret={secret}&response={response}", ReCaptchaResponse.class, "secret", "ValidCaptcha"))
                .thenReturn(new ReCaptchaResponse(true, Collections.emptyList()));
        CreateTeamRequest createTeamRequest = new CreateTeamRequest("name", "password", "ValidCaptcha");

        validator.isValid(createTeamRequest, null);
    }
}
