/*
 * Copyright (c) 2022 Ford Motor Company
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

import com.ford.labs.retroquest.actionitem.ActionItemRepository;
import com.ford.labs.retroquest.column.Column;
import com.ford.labs.retroquest.column.ColumnRepository;
import com.ford.labs.retroquest.exception.TeamDoesNotExistException;
import com.ford.labs.retroquest.thought.ThoughtRepository;
import com.ford.labs.retroquest.websocket.WebsocketService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class TeamService {
    private final ThoughtRepository thoughtRepository;
    private final ActionItemRepository actionItemRepository;
    private final TeamRepository teamRepository;
    private final PasswordEncoder passwordEncoder;
    private final ColumnRepository columnRepository;

    public TeamService(
        ThoughtRepository thoughtRepository,
        ActionItemRepository actionItemRepository,
        TeamRepository teamRepository,
        PasswordEncoder passwordEncoder,
        ColumnRepository columnRepository
    ) {
        this.thoughtRepository = thoughtRepository;
        this.actionItemRepository = actionItemRepository;
        this.teamRepository = teamRepository;
        this.passwordEncoder = passwordEncoder;
        this.columnRepository = columnRepository;
    }

    public Team getTeamByName(String teamName) {
        return teamRepository.findTeamByNameIgnoreCase(teamName.trim())
            .orElseThrow(TeamDoesNotExistException::new);
    }

    public Team getTeamByUri(String teamUri) {
        return teamRepository.findTeamByUri(teamUri.toLowerCase())
            .orElseThrow(TeamDoesNotExistException::new);
    }

    public String convertTeamNameToURI(String teamName) {
        return teamName.toLowerCase().replace(" ", "-");
    }

    public String encodePassword(String password) {
        return passwordEncoder.encode(password);
    }

    public Team createNewTeam(CreateTeamRequest createTeamRequest) {
        var encryptedPassword = this.encodePassword(createTeamRequest.getPassword());

        var trimmedName = createTeamRequest.getName().trim();
        var uri = convertTeamNameToURI(trimmedName);
        teamRepository
            .findTeamByUri(uri)
            .ifPresent(s -> {
                throw new DataIntegrityViolationException(s.getUri());
            });

        var team = new Team(
                uri,
                trimmedName,
                encryptedPassword
        );
        team = teamRepository.save(team);
        generateColumns(team);

        return team;
    }

    public void generateColumns(Team team) {
        var happyColumn = new Column(null, "happy", "Happy", team.getUri());
        var confusedColumn = new Column(null, "confused", "Confused", team.getUri());
        var unhappyColumn = new Column(null, "unhappy", "Sad", team.getUri());

        columnRepository.save(happyColumn);
        columnRepository.save(confusedColumn);
        columnRepository.save(unhappyColumn);
    }
}
