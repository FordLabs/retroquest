/*
 * Copyright (c) 2018 Ford Motor Company
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
 *
 */

package com.ford.labs.retroquest.actionThoughtLink;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ActionItemThoughtMapController {

    private ActionThoughtMapRepository actionThoughtMapRepository;

    public ActionItemThoughtMapController(ActionThoughtMapRepository actionThoughtMapRepository) {
        this.actionThoughtMapRepository = actionThoughtMapRepository;
    }

    @GetMapping("/api/team/{teamId}/action-thought-map/{actionItemId}")
    @PreAuthorize("#teamId == authentication.principal")
    public List<ActionThoughtMap> getAllThoughtsLinkedToActionItem(@PathVariable("teamId") String teamId,
                                                                   @PathVariable("actionItemId") Long actionItemId) {
        return actionThoughtMapRepository.findAllByActionItemId(actionItemId);
    }

}
