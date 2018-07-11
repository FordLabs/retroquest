package com.ford.labs.retroquest.team.validation;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.Assert.assertEquals;

@TestPropertySource(properties = {
        "com.retroquest.captcha.secret:secret",
        "com.retroquest.captcha.url:http://myUrl"
})
@SpringBootTest
@RunWith(SpringRunner.class)
public class CaptchaPropertiesTest {

    @Autowired
    CaptchaProperties captchaProperties;

    @Test
    public void getSecret () {
        assertEquals("http://myUrl", captchaProperties.getUrl());
    }

    @Test
    public void getUrl () {
        assertEquals("secret", captchaProperties.getSecret());
    }
}