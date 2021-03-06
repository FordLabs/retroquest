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

package com.ford.labs.retroquest.team;

import com.ford.labs.retroquest.exception.BoardDoesNotExistException;
import com.ford.labs.retroquest.validation.CaptchaProperties;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CaptchaService {
    private TeamRepository teamRepository;
    private CaptchaProperties captchaProperties;

    public CaptchaService(TeamRepository teamRepository, CaptchaProperties captchaProperties) {
        this.teamRepository = teamRepository;
        this.captchaProperties = captchaProperties;
    }

    public boolean isCaptchaEnabledForTeam(String teamName) {
        if(!isCaptchaEnabled()) {
            return false;
        }

        Optional<Team> team = teamRepository.findTeamByNameIgnoreCase(teamName.trim());
        if(team.isPresent()) {
            Integer failedAttempts = team.get().getFailedAttempts() != null ? team.get().getFailedAttempts() : 0;
            return failedAttempts > captchaProperties.getFailedLoginThreshold();
        }
        throw new BoardDoesNotExistException();
    }

    public boolean isCaptchaEnabled() {
        return captchaProperties.isEnabled();
    }
}
