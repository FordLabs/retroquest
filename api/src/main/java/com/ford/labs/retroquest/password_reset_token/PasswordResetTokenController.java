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
package com.ford.labs.retroquest.password_reset_token;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/password-reset-token")
@Tag(name = "Password Reset Token Controller", description = "The controller that manages password reset tokens")
public class PasswordResetTokenController {

    private final PasswordResetTokenRepository passwordResetTokenRepository;

    public PasswordResetTokenController(PasswordResetTokenRepository passwordResetRepository) {
        this.passwordResetTokenRepository = passwordResetRepository;
    }

    @GetMapping("/lifetime-in-seconds")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    @Operation(description = "Get the number of seconds before a password reset token expires")
    public ResponseEntity<Integer> getResetTokenValiditySeconds(@Value("${retroquest.password.reset.token-lifetime-seconds:600}") int tokenSeconds){
        return ResponseEntity.ok(tokenSeconds);
    }

    @GetMapping("/{passwordResetToken}/is-valid")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    @Operation(description = "Check if the password reset token is valid")
    public boolean checkResetTokenStatus(@PathVariable("passwordResetToken") String passwordResetToken) {
        PasswordResetToken token = passwordResetTokenRepository.findByResetToken(passwordResetToken);
        return token != null && !token.isExpired();
    }
}
