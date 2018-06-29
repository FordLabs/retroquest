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

package com.fordfacto.fordfactoweb.team.validation;


import com.fordfacto.fordfactoweb.exception.EmptyTeamNameException;
import com.fordfacto.fordfactoweb.exception.SpecialCharacterTeamNameException;
import org.junit.Test;

import static org.junit.Assert.assertTrue;

public class TeamNameValidatorTest {

    private TeamNameValidator validator = new TeamNameValidator();

    @Test(expected = EmptyTeamNameException.class)
    public void cannotSubmitEmptyTeamName() {
        validator.isValid("", null);
    }

    @Test(expected = EmptyTeamNameException.class)
    public void cannotSubmitNullTeamName() {
        validator.isValid(null, null);
    }

    @Test(expected = SpecialCharacterTeamNameException.class)
    public void cannotSubmitTeamNameWithSpecialCharacters() {
        String teamName = "Ford~!@#$%^&*()+=<>?`.,/|[]{};:'Labs\"";
        validator.isValid(teamName, null);
    }

    @Test
    public void canSubmitValidTeamName() {
        boolean isValid = validator.isValid("Ford Labs", null);
        assertTrue(isValid);
    }

    @Test
    public void canSubmitValidTeamNameWithNumbers() {
        boolean isValid = validator.isValid("Ford Labs 2018", null);
        assertTrue(isValid);
    }

    @Test(expected = EmptyTeamNameException.class)
    public void cannotSubmitTeamNameWithOnlyWhitespace() {
        validator.isValid("            ", null);
    }

}
