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

package com.fordfacto.fordfactoweb.columntitle;

import com.fordfacto.fordfactoweb.websocket.WebsocketPutResponse;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.util.List;

@RestController
public class ColumnTitleController {

    private ColumnTitleRepository columnTitleRepository;

    public ColumnTitleController(ColumnTitleRepository columnTitleRepository) {
        this.columnTitleRepository = columnTitleRepository;
    }

    @GetMapping("/api/team/{teamId}/columns")
    @PreAuthorize("#teamId == authentication.principal")
    public List<ColumnTitle> getColumnTitlesForTeam(@PathVariable("teamId") String teamId) {
        return columnTitleRepository.findAllByTeamId(teamId);
    }

    @Transactional
    @PutMapping("/api/team/{teamId}/column/{columnId}/title")
    @PreAuthorize("#teamId == authentication.principal")
    public void updateTitleOfColumn(@PathVariable("teamId") String teamId, @RequestBody ColumnTitle columnTitle, @PathVariable("columnId") Long columnId) {
        ColumnTitle returnedColumnTitle = columnTitleRepository.findOne(columnId);
        returnedColumnTitle.setTitle(columnTitle.getTitle());
        columnTitleRepository.save(returnedColumnTitle);
    }

    @MessageMapping("/{teamId}/column-title/{columnId}/edit")
    @SendTo("/topic/{teamId}/column-titles")
    public WebsocketPutResponse<ColumnTitle> editColumnTitleWebsocket(@DestinationVariable("teamId") String teamId, @DestinationVariable("columnId") Long columnId, ColumnTitle columnTitle, Authentication authentication) {

        if (authentication.getPrincipal().equals(teamId)) {
            ColumnTitle savedColumnTitle = columnTitleRepository.findOne(columnId);
            savedColumnTitle.setTitle(columnTitle.getTitle());
            columnTitleRepository.save(savedColumnTitle);
            return new WebsocketPutResponse<>(savedColumnTitle);
        }
        return null;
    }
}
