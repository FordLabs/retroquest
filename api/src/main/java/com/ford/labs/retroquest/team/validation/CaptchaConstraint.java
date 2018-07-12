package com.ford.labs.retroquest.team.validation;


import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = CaptchaValidator.class)
@Target( { ElementType.METHOD, ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface CaptchaConstraint {
    String message() default "Invalid Captcha Response";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
