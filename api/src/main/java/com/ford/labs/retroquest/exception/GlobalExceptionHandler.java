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

package com.ford.labs.retroquest.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {
    @ResponseStatus(value = HttpStatus.CONFLICT, reason = "This team name is already in use. Please try another one.")
    @ExceptionHandler(DataIntegrityViolationException.class)
    public void duplicateUriConflict() {
        // Used by Spring for Controller Advice
    }

    @ResponseStatus(value = HttpStatus.NOT_FOUND, reason = "Column Title with that ID not found")
    @ExceptionHandler(ColumnNotFoundException.class)
    public void columnNotFound() {
        // Used by Spring for Controller Advice
    }

    @ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "Please enter a team name without any special characters.")
    @ExceptionHandler(SpecialCharacterTeamNameException.class)
    public void badTeamNameWithSpecialCharactersRequest() {
        // Used by Spring for Controller Advice
    }

    @ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "Please enter a team name.")
    @ExceptionHandler(EmptyTeamNameException.class)
    public void emptyTeamNameRequest() {
        // Used by Spring for Controller Advice
    }

    @ResponseStatus(value = HttpStatus.FORBIDDEN, reason = "Incorrect team name or password. Please try again.")
    @ExceptionHandler(TeamDoesNotExistException.class)
    public void noTeamExceptionHandler() {
        // Used by Spring for Controller Advice
    }

    @ResponseStatus(value = HttpStatus.FORBIDDEN, reason = "Incorrect team name or password. Please try again.")
    @ExceptionHandler(PasswordInvalidException.class)
    public void badPasswordExceptionHandler() {
        // Used by Spring for Controller Advice
    }

    @ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "Reset token incorrect or expired.")
    @ExceptionHandler(BadResetTokenException.class)
    public void badPasswordResetTokenExceptionHandler() {
        // Used by Spring for Controller Advice
    }

    @ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "Password must be 8 characters or longer.")
    @ExceptionHandler(PasswordTooShortException.class)
    public void passwordTooShortExceptionHandler() {
        // Used by Spring for Controller Advice
    }

    @ExceptionHandler(EmailNotValidException.class)
    @ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "Team email is required.")
    public void emailRequiredExceptionHandler() {
        // Used by Spring for Controller Advice
    }

    @ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "Password must contain at least one numeric character.")
    @ExceptionHandler(PasswordMissingNumberException.class)
    public void passwordMissingNumberExceptionHandler() {
        // Used by Spring for Controller Advice
    }

    @ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "Password must contain at least one capital letter.")
    @ExceptionHandler(PasswordMissingUpperCaseAlphaException.class)
    public void passwordMissingUpperCaseAlphaExceptionHandler() {
        // Used by Spring for Controller Advice
    }

    @ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "Password must contain at least one lower case letter.")
    @ExceptionHandler(PasswordMissingLowerCaseAlphaException.class)
    public void passwordMissingLowerCaseAlphaExceptionHandler() {
        // Used by Spring for Controller Advice
    }

    @ExceptionHandler(ThoughtNotFoundException.class)
    public ResponseEntity<String> thoughtNotFoundExceptionHandler(ThoughtNotFoundException thoughtNotFoundException) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(thoughtNotFoundException.getMessage());
    }

    @ResponseStatus(value = HttpStatus.NOT_FOUND)
    @ExceptionHandler(ActionItemDoesNotExistException.class)
    public void actionItemDoesNotExistExceptionHandler() {
        // Used by Spring for Controller Advice
    }
}
