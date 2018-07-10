package com.ford.labs.retroquest.team.validation;

import com.ford.labs.retroquest.exception.CaptchaInvalidException;
import com.ford.labs.retroquest.exception.CaptchaMissingException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class CaptchaValidator {

    private RestTemplate restTemplate;

    @Value("${com.retroquest.captcha.secret}")
    private String secret = "secret";

    @Value("${com.retroquest.captcha.url}")
    private String url = "url";

    public CaptchaValidator (RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public boolean isValid (String captcha) throws CaptchaMissingException, CaptchaInvalidException {
        if (captcha == null || captcha.isEmpty()) {
            throw new CaptchaMissingException();
        }

        ReCaptchaRequestBody reCaptchaRequestBody = new ReCaptchaRequestBody(secret, captcha);
        ReCaptchaResponse reCaptchaResponse = restTemplate.postForObject(url, reCaptchaRequestBody, ReCaptchaResponse.class);

        if (!reCaptchaResponse.isSuccess()) {
            throw new CaptchaInvalidException();
        }

        return true;
    }
}
