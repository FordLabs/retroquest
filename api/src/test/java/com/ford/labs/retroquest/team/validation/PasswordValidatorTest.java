/*
 * Copyright (c) 2021 Ford Motor Company
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

package com.ford.labs.retroquest.team.validation;

import com.ford.labs.retroquest.exception.PasswordMissingNumberException;
import com.ford.labs.retroquest.exception.PasswordMissingUpperCaseAlphaException;
import com.ford.labs.retroquest.exception.PasswordTooShortException;
import com.ford.labs.retroquest.team.PasswordValidator;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

class PasswordValidatorTest {

    private final PasswordValidator validator = new PasswordValidator();

    @Test
    void whenEmptyPasswordIsSubmitted_ThrowPasswordTooShortException() {
        assertThrows(
                PasswordTooShortException.class,
                () -> validator.isValid("", null)
        );
    }

    @Test
    void whenNullPasswordIsSubmitted_ThrowPasswordTooShortException() {
        assertThrows(
                PasswordTooShortException.class,
                () -> validator.isValid(null, null)
        );
    }

    @Test
    void whenPasswordShorterThanEightCharactersIsSubmitted_ThrowPasswordTooShortException() {
        assertThrows(
                PasswordTooShortException.class,
                () -> validator.isValid("Passw0r", null)
        );
    }

    @Test
    void whenPasswordIsMissingANumber_ThrowPasswordMissingNumberException() {
        assertThrows(
                PasswordMissingNumberException.class,
                () -> validator.isValid("Password", null)
        );
    }

    @Test
    void whenPasswordIsMissingAUpperCaseAlpha_ThrowPasswordMissingUpperCaseAlphaException() {
        assertThrows(
                PasswordMissingUpperCaseAlphaException.class,
                () -> validator.isValid("passw0rd", null)
        );
    }

    @Test
    void validPasswordReturnsTrue() {
        assertThat(validator.isValid("Passw0rd", null)).isTrue();
    }

}
