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

import com.ford.labs.retroquest.team.Team;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PasswordResetTokenService {
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    public PasswordResetTokenService(PasswordResetTokenRepository passwordResetTokenRepository) {
        this.passwordResetTokenRepository = passwordResetTokenRepository;
    }

    public PasswordResetToken getNewPasswordResetToken(Team team) {
        PasswordResetToken passwordResetToken = new PasswordResetToken();
        passwordResetToken.setTeam(team);
        passwordResetTokenRepository.save(passwordResetToken);
        return passwordResetToken;
    }

    public void deleteAllExpiredTokensByTeam(Team team) {
        List<PasswordResetToken> resetTokens = passwordResetTokenRepository.findAllByTeam(team);
        resetTokens.forEach(token -> {
            if (token.isExpired()) {
                passwordResetTokenRepository.deleteByResetToken(token.getResetToken());
            }
        });
    }
}
