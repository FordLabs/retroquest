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

package com.ford.labs.retroquest.thought;

import com.ford.labs.retroquest.column.ColumnTitle;
import lombok.*;

import javax.persistence.*;

@Data
@Getter
@Setter
@ToString
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class Thought {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;

    private int hearts;
    private String topic;
    private boolean discussed;
    private String teamId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(
        name = "topic",
        referencedColumnName = "topic",
        insertable = false,
        updatable = false
    )
    @JoinColumn(
        name = "teamId",
        referencedColumnName = "teamId",
        insertable = false,
        updatable = false
    )
    private ColumnTitle columnTitle;
    private Long boardId;
    private Long columnId;
}
