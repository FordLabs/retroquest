package com.ford.labs.retroquest.team.validation;

import com.ford.labs.retroquest.exception.CaptchaInvalidException;
import com.ford.labs.retroquest.exception.CaptchaMissingException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class CaptchaValidator {

    private final RestTemplate restTemplate;
    private final CaptchaProperties captchaProperties;

    public CaptchaValidator (RestTemplate restTemplate, CaptchaProperties captchaProperties) {
        this.restTemplate = restTemplate;
        this.captchaProperties = captchaProperties;
    }

    public boolean isValid (String captcha) throws CaptchaMissingException, CaptchaInvalidException {
        if (captcha == null || captcha.isEmpty()) {
            throw new CaptchaMissingException();
        }

        ReCaptchaRequestBody reCaptchaRequestBody = new ReCaptchaRequestBody(captchaProperties.getSecret(), captcha);
        ReCaptchaResponse reCaptchaResponse = restTemplate.postForObject(captchaProperties.getUrl(), reCaptchaRequestBody, ReCaptchaResponse.class);

        if (!reCaptchaResponse.isSuccess()) {
            throw new CaptchaInvalidException();
        }

        return true;
    }
}
