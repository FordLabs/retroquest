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

package com.ford.labs.retroquest.actionitem;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ford.labs.retroquest.thought.Thought;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.sql.Date;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Data
@Entity
@NoArgsConstructor
@EqualsAndHashCode(exclude = "linkedThoughts")
public class ActionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String task;
    private boolean completed;
    private String teamId;
    private String assignee;
    private Date dateCreated;

    @ManyToMany(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    @JoinTable(name = "action_thought_map",
            joinColumns = @JoinColumn(name = "thought_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "action_item_id", referencedColumnName = "id"))
    private Set<Thought> linkedThoughts;

    private String getCompletedString() {
        return completed ? "yes" : "no";
    }

    @JsonIgnore
    public List<String> getCSVFields() {
        return Arrays.asList("action item", task, "", getCompletedString(), assignee);
    }

    public void toggleCompleted() {
        completed = !completed;
    }

    public ActionItem(Long id, String task, boolean completed, String teamId, String assignee, Date dateCreated, Thought... thoughts) {
        this.id = id;
        this.task = task;
        this.completed = completed;
        this.teamId = teamId;
        this.assignee = assignee;
        this.dateCreated = dateCreated;
        this.linkedThoughts = Stream.of(thoughts)
                .collect(Collectors.toSet());
        this.linkedThoughts.forEach(t -> t.getLinkedActionItems()
                .add(this));
    }

}
