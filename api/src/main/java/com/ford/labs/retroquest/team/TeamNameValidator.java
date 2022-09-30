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

import com.ford.labs.retroquest.exception.EmptyTeamNameException;
import com.ford.labs.retroquest.exception.SpecialCharacterTeamNameException;
import org.apache.commons.lang3.StringUtils;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class TeamNameValidator implements ConstraintValidator<TeamNameConstraint, String> {
    @Override
    public boolean isValid(String teamName, ConstraintValidatorContext context) {
        if (StringUtils.isBlank(teamName)) {
            throw new EmptyTeamNameException();
        }
        if (!StringUtils.isAlphanumericSpace(teamName)) {
            throw new SpecialCharacterTeamNameException();
        }

        return true;
    }
}
