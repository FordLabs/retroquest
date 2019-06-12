package com.ford.labs.retroquest.validation;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReCaptchaResponse {
    private boolean success;

    @JsonProperty("error-codes")
    private List<String> errorCodes;
}
