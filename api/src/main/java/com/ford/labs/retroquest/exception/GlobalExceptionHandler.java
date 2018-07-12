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

package com.ford.labs.retroquest.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ResponseStatus(value = HttpStatus.FORBIDDEN, reason = "Incorrect board or password. Please try again.")
    @ExceptionHandler(CaptchaInvalidException.class)
    public void invalidCaptchaExceptionHandler() {
    }
    
    @ResponseStatus(value = HttpStatus.CONFLICT, reason = "This board name is already in use. Please try another one.")
    @ExceptionHandler(DataIntegrityViolationException.class)
    public void duplicateUriConflict() {
    }

    @ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "Please enter a board name without any special characters.")
    @ExceptionHandler(SpecialCharacterTeamNameException.class)
    public void badTeamNameWithSpecialCharactersRequest() {
    }

    @ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "Please enter a board name.")
    @ExceptionHandler(EmptyTeamNameException.class)
    public void emptyTeamNameRequest() {
    }

    @ResponseStatus(value = HttpStatus.FORBIDDEN, reason = "Incorrect board name. Please try again.")
    @ExceptionHandler(BoardDoesNotExistException.class)
    public void noTeamExceptionHandler() {
    }

    @ResponseStatus(value = HttpStatus.FORBIDDEN, reason = "Incorrect board or password. Please try again.")
    @ExceptionHandler(PasswordInvalidException.class)
    public void badPasswordExceptionHandler() {
    }

    @ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "Password must be 8 characters or longer.")
    @ExceptionHandler(PasswordTooShortException.class)
    public void passwordTooShortExceptionHandler() {
    }

    @ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "Password must contain at least one numeric character.")
    @ExceptionHandler(PasswordMissingNumberException.class)
    public void passwordMissingNumberExceptionHandler() {
    }

    @ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "Password must contain at least one capital letter.")
    @ExceptionHandler(PasswordMissingUpperCaseAlphaException.class)
    public void passwordMissingUpperCaseAlphaExceptionHandler() {
    }

    @ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "Password must contain at least one lower case letter.")
    @ExceptionHandler(PasswordMissingLowerCaseAlphaException.class)
    public void passwordMissingLowerCaseAlphaExceptionHandler() {
    }

    @ResponseStatus(value = HttpStatus.CONFLICT, reason = "Team already has a password")
    @ExceptionHandler(TeamAlreadyHasPasswordException.class)
    public void teamAlreadyHasPasswordExceptionHandler() {
    }
}
