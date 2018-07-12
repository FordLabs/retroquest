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

package com.ford.labs.retroquest.team.validation;

import com.ford.labs.retroquest.exception.PasswordMissingLowerCaseAlphaException;
import com.ford.labs.retroquest.exception.PasswordMissingNumberException;
import com.ford.labs.retroquest.exception.PasswordMissingUpperCaseAlphaException;
import com.ford.labs.retroquest.exception.PasswordTooShortException;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.regex.Pattern;


public class PasswordValidator implements ConstraintValidator<PasswordConstraint, String> {

    @Override
    public void initialize(PasswordConstraint constraintAnnotation) {
        //no initialization required
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        for (PasswordValidityChecker cur : PasswordValidityChecker.values()) {
            cur.validate(scrubForNull(value));
        }

        return true;
    }

    private String scrubForNull(String value) {
        return value == null ? "" : value;
    }

    private enum PasswordValidityChecker {
        LENGTH("^.{8,}$", new PasswordTooShortException()),
        CONTAINS_NUMBER("^.*\\d.*$", new PasswordMissingNumberException()),
        CONTAINS_LOWER("^.*[\\p{javaLowerCase}].*$", new PasswordMissingLowerCaseAlphaException()),
        CONTAINS_UPPER("^.*[\\p{javaUpperCase}].*$", new PasswordMissingUpperCaseAlphaException());

        private final Pattern pattern;
        private final RuntimeException ex;

        PasswordValidityChecker(final String regexp, final RuntimeException ex) {
            this.pattern = Pattern.compile(regexp);
            this.ex = ex;
        }

        private void validate(final String value) {

            if (!pattern.matcher(value).matches()) {
                throw ex;
            }
        }
    }
}
