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

package com.ford.labs.retroquest.team.validation;

import com.ford.labs.retroquest.exception.CaptchaInvalidException;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

@Service
public class CaptchaValidator implements ConstraintValidator<CaptchaConstraint, String> {

    private final RestTemplate restTemplate;
    private final CaptchaProperties captchaProperties;

    public CaptchaValidator(RestTemplate restTemplate, CaptchaProperties captchaProperties) {
        this.restTemplate = restTemplate;
        this.captchaProperties = captchaProperties;
    }

    @Override
    public boolean isValid(String captcha, ConstraintValidatorContext context) {
        if (!captchaProperties.isEnabled()) {
            return true;
        }

        if (StringUtils.isBlank(captcha)) {
            throw new CaptchaInvalidException();
        }

        ReCaptchaResponse response = restTemplate.getForObject(
                captchaProperties.getUrl() + "?secret={secret}&response={response}",
                ReCaptchaResponse.class,
                captchaProperties.getSecret(),
                captcha
        );

        if (!response.isSuccess()) {
            throw new CaptchaInvalidException();
        }
        return true;
    }

    @Override
    public void initialize(CaptchaConstraint constraintAnnotation) {

    }
}
