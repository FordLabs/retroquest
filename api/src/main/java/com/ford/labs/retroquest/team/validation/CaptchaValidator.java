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
        if (StringUtils.isBlank(captcha)) {
            throw new CaptchaInvalidException();
        }

        ReCaptchaRequestBody reCaptchaRequestBody = new ReCaptchaRequestBody(captchaProperties.getSecret(), captcha);
        ReCaptchaResponse reCaptchaResponse = restTemplate.postForObject(captchaProperties.getUrl(), reCaptchaRequestBody, ReCaptchaResponse.class);

        if (!reCaptchaResponse.isSuccess()) {
            throw new CaptchaInvalidException();
        }

        return true;
    }

    @Override
    public void initialize(CaptchaConstraint constraintAnnotation) {

    }
}
