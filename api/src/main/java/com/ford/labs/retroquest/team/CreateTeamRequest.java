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

import com.ford.labs.retroquest.team.validation.EmailConstraint;
import com.ford.labs.retroquest.team.validation.PasswordConstraint;
import com.ford.labs.retroquest.team.validation.TeamNameConstraint;
import lombok.*;
import org.springframework.boot.context.properties.bind.DefaultValue;

import javax.validation.constraints.NotBlank;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder=true)
public class CreateTeamRequest {

    @TeamNameConstraint
    private String name;

    @PasswordConstraint
    private String password;

    @EmailConstraint
    private String email;

    @Builder.Default
    private String secondaryEmail = "";

    public String getSecondaryEmail() {
        return this.secondaryEmail == null ? "" : this.secondaryEmail;
    }
}
