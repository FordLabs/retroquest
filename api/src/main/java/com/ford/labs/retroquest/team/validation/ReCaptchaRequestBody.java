package com.ford.labs.retroquest.team.validation;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReCaptchaRequestBody {
    private String secret;
    private String response;
}
