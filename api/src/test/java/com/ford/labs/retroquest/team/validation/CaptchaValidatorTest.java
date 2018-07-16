package com.ford.labs.retroquest.team.validation;

import com.ford.labs.retroquest.exception.CaptchaInvalidException;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.mock.env.MockEnvironment;
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

    private MockEnvironment environment = new MockEnvironment();

    @Before
    public void setUp () {
        captchaProperties.setSecret("secret");
        captchaProperties.setUrl("http://myUrl");
        validator = new CaptchaValidator(restTemplate, captchaProperties, environment);
    }

    @Test(expected = CaptchaInvalidException.class)
    public void whenCaptchaIsEmpty_throwsCaptchaInvalidException () {
        validator.isValid("", null);
    }

    @Test(expected = CaptchaInvalidException.class)
    public void whenCaptchaIsInvalid_throwsCaptchaInvalidException () {
        when(restTemplate.getForObject("http://myUrl?secret={secret}&response={response}", ReCaptchaResponse.class, "secret", "InvalidCaptcha"))
                .thenReturn(new ReCaptchaResponse(false, Collections.emptyList()));

        validator.isValid("InvalidCaptcha", null);
    }

    @Test
    public void whenCaptchaIsValid_returnsTrue () {
        when(restTemplate.getForObject("http://myUrl?secret={secret}&response={response}", ReCaptchaResponse.class, "secret", "ValidCaptcha"))
                .thenReturn(new ReCaptchaResponse(true, Collections.emptyList()));

        assertTrue(validator.isValid("ValidCaptcha", null));
    }

    @Test
    public void whenCaptchaIsDisabled_returnsTrue () {
        environment.setProperty("spring.profiles.active", "captchaDisabled");

        validator = new CaptchaValidator(restTemplate, captchaProperties, environment);

        assertTrue(validator.isValid("invalidCaptcha", null));
    }
}
