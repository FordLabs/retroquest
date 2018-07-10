package com.ford.labs.retroquest.team.validation;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReCaptchaResponse {
    @NotNull
    private boolean success;
    private List<String> errorCodes;
}
