/*
 * Copyright (c) 2022 Ford Motor Company
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
package com.ford.labs.retroquest.email_reset_token;

import com.ford.labs.retroquest.exception.BadResetTokenException;
import com.ford.labs.retroquest.team.Team;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/email-reset-token")
@Tag(name = "Password Reset Token Controller", description = "The controller that manages password reset tokens")
public class EmailResetTokenController {

    private final EmailResetTokenRepository emailResetTokenRepository;

    public EmailResetTokenController(EmailResetTokenRepository passwordResetRepository) {
        this.emailResetTokenRepository = passwordResetRepository;
    }

    @GetMapping("/lifetime-in-seconds")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    @Operation(description = "Get the number of seconds before an email reset token expires")
    public ResponseEntity<Integer> getResetTokenValiditySeconds(@Value("${retroquest.email.reset.token-lifetime-seconds:600}") int tokenSeconds){
        return ResponseEntity.ok(tokenSeconds);
    }

    @GetMapping("/{emailResetToken}/is-valid")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    @Operation(description = "Check if the email reset token is valid")
    public boolean checkResetTokenStatus(@PathVariable("emailResetToken") String emailResetToken) {
        EmailResetToken token = emailResetTokenRepository.findByResetToken(emailResetToken);
        return token != null && !token.isExpired();
    }

    @GetMapping("/{emailResetToken}/team")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    @Operation(description = "Get Team by reset token")
    public Team getTeamByResetToken(@PathVariable("emailResetToken") String emailResetToken) {
        EmailResetToken token = emailResetTokenRepository.findByResetToken(emailResetToken);
        if (token == null || token.isExpired()) throw new BadResetTokenException();
        return token.getTeam();
    }
}
