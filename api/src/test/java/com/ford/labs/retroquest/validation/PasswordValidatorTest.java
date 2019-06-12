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
import org.junit.Test;

import static junit.framework.TestCase.assertTrue;

public class PasswordValidatorTest {

    private PasswordValidator validator = new PasswordValidator();

    @Test(expected = PasswordTooShortException.class)
    public void whenEmptyPasswordIsSubmitted_ThrowPasswordTooShortException() {
        validator.isValid("", null);
    }

    @Test(expected = PasswordTooShortException.class)
    public void whenNullPasswordIsSubmitted_ThrowPasswordTooShortException() {
        validator.isValid(null, null);
    }

    @Test(expected = PasswordTooShortException.class)
    public void whenPasswordShorterThanEightCharactersIsSubmitted_ThrowPasswordTooShortException() {
        validator.isValid("Passw0r", null);
    }

    @Test(expected = PasswordMissingNumberException.class)
    public void whenPasswordIsMissingANumber_ThrowPasswordMissingNumberException() {
        validator.isValid("Password", null);
    }

    @Test(expected = PasswordMissingLowerCaseAlphaException.class)
    public void whenPasswordIsMissingALowerCaseAlpha_ThrowPasswordMissingLowerCaseAlphaException() {
        validator.isValid("PASSW0RD", null);
    }

    @Test(expected = PasswordMissingUpperCaseAlphaException.class)
    public void whenPasswordIsMissingAUpperCaseAlpha_ThrowPasswordMissingUpperCaseAlphaException() {
        validator.isValid("passw0rd", null);
    }

    @Test
    public void validPasswordReturnsTrue() {
        boolean isValid = validator.isValid("Passw0rd", null);
        assertTrue(isValid);
    }

}