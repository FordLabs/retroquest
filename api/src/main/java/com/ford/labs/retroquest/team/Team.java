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

package com.ford.labs.retroquest.team;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ford.labs.retroquest.converters.LocalDateAttributeConverter;
import com.ford.labs.retroquest.users.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Persistable;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Team implements Persistable<String> {

    @Id
    @JsonIgnore
    private String uri;

    private String name;

    @JsonIgnore
    private String password;

    @JsonIgnore
    private LocalDate dateCreated;

    @JsonIgnore
    @Convert(converter = LocalDateAttributeConverter.class)
    private LocalDate dateCreated2;

    private Integer failedAttempts;

    @JsonIgnore
    private LocalDate lastLoginDate;

    @JsonIgnore
    @Convert(converter = LocalDateAttributeConverter.class)
    private LocalDate lastLoginDate2;

    public Team(String uri, String name, String password) {
        this.uri = uri;
        this.name = name;
        this.password = password;
        this.failedAttempts = 0;
//        this.users = new HashSet<>();
    }

    @Override
    public String getId() {
        return this.uri;
    }

    @Override
    public boolean isNew() {
        return uri == null;
    }
}
