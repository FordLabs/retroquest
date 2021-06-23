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
import com.ford.labs.retroquest.team.LoginRequest;
import com.ford.labs.retroquest.team.TeamRequest;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

@Service
public class CaptchaValidator implements ConstraintValidator<CaptchaConstraint, TeamRequest> {

    private final RestTemplate restTemplate;
    private final CaptchaProperties captchaProperties;
    private final CaptchaService captchaService;

    public CaptchaValidator(RestTemplate restTemplate, CaptchaProperties captchaProperties, CaptchaService captchaService) {
        this.restTemplate = restTemplate;
        this.captchaProperties = captchaProperties;
        this.captchaService = captchaService;
    }

    @Override
    public boolean isValid(TeamRequest teamRequest, ConstraintValidatorContext context) {
        if (captchaIsValid(teamRequest)) {
            return true;
        }

        throw new CaptchaInvalidException();
    }

    private boolean captchaIsValid(TeamRequest teamRequest) {
        return captchaIsDisabled()
               || requestIsForLoginAndTeamHasCaptchaDisabled(teamRequest)
               || captchaResponseIsValid(teamRequest);
    }

    private boolean captchaIsDisabled() {
        return !captchaProperties.isEnabled();
    }

    private boolean requestIsForLoginAndTeamHasCaptchaDisabled(TeamRequest teamRequest) {
        return teamRequest instanceof LoginRequest
               && !captchaService.isCaptchaEnabledForTeam(teamRequest.getName());
    }

    private boolean captchaResponseIsValid(TeamRequest teamRequest) {
        if (StringUtils.isBlank(teamRequest.getCaptchaResponse())) {
            return false;
        }

        var response = restTemplate.getForObject(
            String.format("%s?secret={secret}&response={response}", captchaProperties.getUrl()),
            ReCaptchaResponse.class,
            captchaProperties.getSecret(),
            teamRequest.getCaptchaResponse()
        );

        return response != null && response.isSuccess();
    }
}
