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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
@ResponseBody
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {
    private static class ErrorDetails{
        private final String reason;
        public ErrorDetails(String reasonForError){
            this.reason = reasonForError;
        }

        public String getReason() {
            return reason;
        }
    }

    @ResponseStatus(value = HttpStatus.CONFLICT)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ErrorDetails duplicateUriConflict() {
        return new ErrorDetails("This team name is already in use. Please try another one.");
    }

    @ResponseStatus(value = HttpStatus.NOT_FOUND)
    @ExceptionHandler(ColumnNotFoundException.class)
    public ErrorDetails columnNotFound() {
        return new ErrorDetails("Column Title with that ID not found");
    }

    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    @ExceptionHandler(SpecialCharacterTeamNameException.class)
    public ErrorDetails badTeamNameWithSpecialCharactersRequest() {
        return new ErrorDetails("Please enter a team name without any special characters.");
    }

    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    @ExceptionHandler(EmptyTeamNameException.class)
    public ErrorDetails emptyTeamNameRequest() {
        return new ErrorDetails("Please enter a team name.");
    }

    @ResponseStatus(value = HttpStatus.FORBIDDEN)
    @ExceptionHandler(TeamDoesNotExistException.class)
    public ErrorDetails noTeamExceptionHandler() {
        return new ErrorDetails("Incorrect team name or password. Please try again.");
    }

    @ResponseStatus(value = HttpStatus.FORBIDDEN)
    @ExceptionHandler(PasswordInvalidException.class)
    public ErrorDetails badPasswordExceptionHandler() {
        return new ErrorDetails("Incorrect team name or password. Please try again.");
    }

    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    @ExceptionHandler(BadResetTokenException.class)
    public ErrorDetails badPasswordResetTokenExceptionHandler() {
        return new ErrorDetails("Reset token incorrect or expired.");
    }

    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    @ExceptionHandler(PasswordTooShortException.class)
    public ErrorDetails passwordTooShortExceptionHandler() {
        return new ErrorDetails("Password must be 8 characters or longer.");
    }

    @ExceptionHandler(EmailNotValidException.class)
    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    public ErrorDetails emailRequiredExceptionHandler() {
        return new ErrorDetails("Team email is required.");
    }

    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    @ExceptionHandler(PasswordMissingNumberException.class)
    public ErrorDetails passwordMissingNumberExceptionHandler() {
        return new ErrorDetails("Password must contain at least one numeric character.");
    }

    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    @ExceptionHandler(PasswordMissingUpperCaseAlphaException.class)
    public ErrorDetails passwordMissingUpperCaseAlphaExceptionHandler() {
        return new ErrorDetails("Password must contain at least one capital letter.");
    }

    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    @ExceptionHandler(PasswordMissingLowerCaseAlphaException.class)
    public ErrorDetails passwordMissingLowerCaseAlphaExceptionHandler() {
        return new ErrorDetails("Password must contain at least one lower case letter.");
    }

    @ExceptionHandler(EmailNotAssociatedWithAnyTeamsException.class)
    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    public ErrorDetails emailNotAssociatedWithAnyTeamsExceptionHandler() {
        return new ErrorDetails("This email is not associated with any RetroQuest team.");
    }

    @ExceptionHandler(ThoughtNotFoundException.class)
    public ResponseEntity<String> thoughtNotFoundExceptionHandler(ThoughtNotFoundException thoughtNotFoundException) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(thoughtNotFoundException.getMessage());
    }

    @ResponseStatus(value = HttpStatus.NOT_FOUND)
    @ExceptionHandler(ActionItemDoesNotExistException.class)
    public ErrorDetails actionItemDoesNotExistExceptionHandler() {
        return new ErrorDetails("The requested action item cannot be found.");
    }
}
