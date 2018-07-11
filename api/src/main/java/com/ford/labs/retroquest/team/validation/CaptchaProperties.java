package com.ford.labs.retroquest.team.validation;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix ="com.retroquest.captcha")
public class CaptchaProperties {
    private String secret;
    private String url;
}
