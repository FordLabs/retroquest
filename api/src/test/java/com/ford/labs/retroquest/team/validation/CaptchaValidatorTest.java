package com.ford.labs.retroquest.team.validation;

import com.ford.labs.retroquest.exception.CaptchaInvalidException;
import com.ford.labs.retroquest.exception.CaptchaMissingException;
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

    private CaptchaValidator validator;

    @Before
    public void setUp () {
        captchaProperties.setSecret("secret");
        captchaProperties.setUrl("http://myUrl");
        validator = new CaptchaValidator(restTemplate, captchaProperties);
    }

    @Test(expected = CaptchaMissingException.class)
    public void whenCaptchaIsEmpty_throwsCaptchaMissingException () {
        validator.isValid("");
    }

    @Test(expected = CaptchaInvalidException.class)
    public void whenCaptchaIsInvalid_throwsCaptchaInvalidException () {
        ReCaptchaRequestBody request = new ReCaptchaRequestBody("secret", "Invalid Captcha");
        when(restTemplate.postForObject("http://myUrl", request, ReCaptchaResponse.class))
                .thenReturn(new ReCaptchaResponse(false, Collections.emptyList()));

        validator.isValid("Invalid Captcha");
    }

    @Test
    public void whenCaptchaIsValid_returnsTrue () {
        ReCaptchaRequestBody request = new ReCaptchaRequestBody("secret", "Valid Captcha");
        when(restTemplate.postForObject("http://myUrl", request, ReCaptchaResponse.class))
                .thenReturn(new ReCaptchaResponse(true, Collections.emptyList()));

        assertTrue(validator.isValid("Valid Captcha"));
    }
}
