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

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Persistable;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.time.LocalDate;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class Team implements Persistable<String> {

    @Id
    @JsonIgnore
    private String uri;

    private String name;

    @Builder.Default
    private String email = "";

    @Builder.Default
    private String secondaryEmail = "";

    @JsonIgnore
    private String password;

    @JsonIgnore
    @Builder.Default
    private LocalDate dateCreated = LocalDate.now();

    private Integer failedAttempts;

    @JsonIgnore
    private LocalDate lastLoginDate;

    public Team(String uri, String name, String password){
        this(uri, name, password, "");
    }

    public Team(String uri, String name, String password, String email) {
        this.uri = uri;
        this.name = name;
        this.email = email;
        this.password = password;
        this.failedAttempts = 0;
        this.dateCreated = LocalDate.now();
    }

    public Team(String uri, String name, String password, String email, String email2) {
        this.uri = uri;
        this.name = name;
        this.email = email;
        this.secondaryEmail = email2;
        this.password = password;
        this.failedAttempts = 0;
        this.dateCreated = LocalDate.now();
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
