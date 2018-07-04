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
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.util.Arrays;
import java.util.List;

import static org.apache.commons.lang3.StringUtils.defaultString;

@Data
@Entity
@NoArgsConstructor
@Builder
public class ActionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String task;
    private boolean completed;
    private String teamId;
    private String assignee;

    public ActionItem(Long id, String task, boolean completed, String teamId, String assignee) {
        this.id = id;
        setTask(task);
        this.completed = completed;
        this.teamId = teamId;
        setAssignee(assignee);
    }

    /**
     * Sets task body. Will sanitize the string for html.
     * @param task
     */
    public void setTask(String task) {
        this.task = Jsoup.clean(defaultString(task), Whitelist.basic());
    }

    public void setAssignee(String assignee) { this.assignee = Jsoup.clean(defaultString(assignee), Whitelist.basic()); }

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
}
