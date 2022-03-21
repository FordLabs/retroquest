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

package com.ford.labs.retroquest.feedback;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int stars;

    @Column(length = 3000)
    private String comment;
    private String userEmail;
    private String teamId;

    @JsonFormat(pattern = "MM/dd/yy hh:mm:ss.SSS")
    @EqualsAndHashCode.Exclude
    @Builder.Default
    private LocalDateTime dateCreated = LocalDateTime.now();

    static Feedback fromDto(FeedbackDto dto) {
        return new Feedback(
            null,
            dto.stars(),
            dto.comment(),
            dto.userEmail(),
            dto.teamId(),
            LocalDateTime.now()
        );
    }
}
