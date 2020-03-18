package com.ford.labs.retroquest.validation;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "com.retroquest.captcha")
@NoArgsConstructor
public class CaptchaProperties {
    private String secret;
    private String url;
    private boolean enabled = true;
    private int failedLoginThreshold;
}
