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

import com.ford.labs.retroquest.team.Team;
import org.springframework.stereotype.Service;

@Service
public class EmailResetTokenService {
    private final EmailResetTokenRepository emailResetTokenRepository;

    public EmailResetTokenService(EmailResetTokenRepository emailResetTokenRepository) {
        this.emailResetTokenRepository = emailResetTokenRepository;
    }

    public EmailResetToken getNewEmailResetToken(Team team) {
        EmailResetToken emailResetToken = new EmailResetToken();
        emailResetToken.setTeam(team);
        emailResetTokenRepository.deleteAllByTeam(team);
        emailResetTokenRepository.save(emailResetToken);
        return emailResetToken;
    }
}
