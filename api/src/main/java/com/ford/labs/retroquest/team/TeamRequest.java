package com.ford.labs.retroquest.team;


import com.ford.labs.retroquest.team.validation.CaptchaConstraint;

@CaptchaConstraint
public interface TeamRequest {
    String getName();
    String getPassword();
    String getCaptchaResponse();

    void setName(String name);
    void setPassword(String password);
    void setCaptchaResponse(String captchaResponse);
}
