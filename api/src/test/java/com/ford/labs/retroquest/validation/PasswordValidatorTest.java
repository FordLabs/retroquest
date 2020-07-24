/*
 * Copyright © 2018 Ford Motor Company
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.ford.labs.retroquest.validation;

import com.ford.labs.retroquest.exception.PasswordMissingLowerCaseAlphaException;
import com.ford.labs.retroquest.exception.PasswordMissingNumberException;
import com.ford.labs.retroquest.exception.PasswordMissingUpperCaseAlphaException;
import com.ford.labs.retroquest.exception.PasswordTooShortException;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertThrows;

public class PasswordValidatorTest {

    private PasswordValidator validator = new PasswordValidator();

    @Test
    public void whenEmptyPasswordIsSubmitted_ThrowPasswordTooShortException() {
        assertThrows(
                PasswordTooShortException.class,
                () -> validator.isValid("", null)
        );
    }

    @Test
    public void whenNullPasswordIsSubmitted_ThrowPasswordTooShortException() {
        assertThrows(
                PasswordTooShortException.class,
                () -> validator.isValid(null, null)
        );
    }

    @Test
    public void whenPasswordShorterThanEightCharactersIsSubmitted_ThrowPasswordTooShortException() {
        assertThrows(
                PasswordTooShortException.class,
                () -> validator.isValid("Passw0r", null)
        );
    }

    @Test
    public void whenPasswordIsMissingANumber_ThrowPasswordMissingNumberException() {
        assertThrows(
                PasswordMissingNumberException.class,
                () -> validator.isValid("Password", null)
        );
    }

    @Test
    public void whenPasswordIsMissingALowerCaseAlpha_ThrowPasswordMissingLowerCaseAlphaException() {
        assertThrows(
                PasswordMissingLowerCaseAlphaException.class,
                () -> validator.isValid("PASSW0RD", null)
        );
    }

    @Test
    public void whenPasswordIsMissingAUpperCaseAlpha_ThrowPasswordMissingUpperCaseAlphaException() {
        assertThrows(
                PasswordMissingUpperCaseAlphaException.class,
                () -> validator.isValid("passw0rd", null)
        );
    }

    @Test
    public void validPasswordReturnsTrue() {
        assertThat(validator.isValid("Passw0rd", null)).isTrue();
    }

}