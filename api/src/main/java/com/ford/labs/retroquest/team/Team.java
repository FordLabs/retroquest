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
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Persistable;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import java.time.LocalDate;

@Data
@Entity
@NoArgsConstructor
public class Team implements Persistable<String> {

    @Id
    @JsonIgnore
    private String uri;

    private String name;

    @JsonIgnore
    private String password;

    @JsonIgnore
    private LocalDate dateCreated;
    private int failedAttempts;

    Team(String uri, String name, String password) {
        this.uri = uri;
        this.name = name;
        this.password = password;
        this.failedAttempts = 0;
    }

    @Override
    public String getId() {
        return this.uri;
    }

    @Override
    public boolean isNew() {
        return uri != null;
    }

    @PrePersist
    void setDateCreated() {
        dateCreated = LocalDate.now();
    }
}
