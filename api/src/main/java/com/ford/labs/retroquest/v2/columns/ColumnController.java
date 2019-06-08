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
 */

package com.ford.labs.retroquest.v2.columns;

import com.ford.labs.retroquest.apiAuthorization.ApiAuthorization;
import com.ford.labs.retroquest.users.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController()
@RequestMapping(value = "/api/v2/team")
public class ColumnController {

    private ColumnCombinerService columnCombinerService;
    private ApiAuthorization apiAuthorization;

    ColumnController(ColumnCombinerService columnCombinerService, ApiAuthorization apiAuthorization) {
        this.columnCombinerService = columnCombinerService;
        this.apiAuthorization = apiAuthorization;
    }

    @GetMapping("/{teamId}/columns")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    public ColumnCombinerResponse getThoughtsForTeam(@PathVariable("teamId") String teamId, Authentication authentication) {
        return columnCombinerService.aggregateResponse(teamId);

    }
}
