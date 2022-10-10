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

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ford.labs.retroquest.team.Team;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class PasswordResetToken {

    @Id
    @JsonIgnore
    @Builder.Default
    private String resetToken = UUID.randomUUID().toString();

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="team_id", referencedColumnName="uri")
    private Team team;

    @JsonIgnore
    @Builder.Default
    private LocalDateTime dateCreated = LocalDateTime.now();

    @Transient
    @Builder.Default
    private int maximumAge = 600;

    public boolean isExpired(){
        return Math.abs(Duration.between(LocalDateTime.now(), dateCreated).toSeconds()) > maximumAge;
    }
}
