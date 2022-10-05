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
import com.ford.labs.retroquest.exception.PasswordInvalidException;
import com.ford.labs.retroquest.thought.ThoughtRepository;
import com.ford.labs.retroquest.websocket.WebsocketService;
import com.ford.labs.retroquest.websocket.events.WebsocketTeamEvent;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

import static com.ford.labs.retroquest.websocket.events.WebsocketEventType.UPDATE;

@Service
public class TeamService {
    private final ThoughtRepository thoughtRepository;
    private final ActionItemRepository actionItemRepository;
    private final TeamRepository teamRepository;
    private final PasswordEncoder passwordEncoder;
    private final ColumnRepository columnRepository;
    private final WebsocketService websocketService;

    public TeamService(
        ThoughtRepository thoughtRepository,
        ActionItemRepository actionItemRepository,
        TeamRepository teamRepository,
        PasswordEncoder passwordEncoder,
        ColumnRepository columnRepository,
        WebsocketService websocketService) {
        this.thoughtRepository = thoughtRepository;
        this.actionItemRepository = actionItemRepository;
        this.teamRepository = teamRepository;
        this.passwordEncoder = passwordEncoder;
        this.columnRepository = columnRepository;
        this.websocketService = websocketService;
    }

    static boolean isEmailOnTeam(Team team, String email) {
        return team.getEmail().equalsIgnoreCase(email) || team.getSecondaryEmail().equalsIgnoreCase(email);
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

    public CsvFile buildCsvFileFromTeam(String team) {
        var thoughts = thoughtRepository.findAllByTeamIdAndBoardIdIsNullOrderByColumnId(team);
        var actionItems = actionItemRepository.findAllByTeamIdAndArchived(team, false);
        var columns = columnRepository.findAllByTeamId(team);
        return new CsvFile(team, thoughts, actionItems, columns);
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
                encryptedPassword,
                createTeamRequest.getEmail().trim(),
                createTeamRequest.getSecondaryEmail().trim()
        );
        team = teamRepository.save(team);
        generateColumns(team);

        return team;
    }

    public Team login(LoginRequest loginRequest) {
        var savedTeam = getTeamByName(loginRequest.getName());

        if (loginRequest.getPassword() == null || !passwordEncoder.matches(loginRequest.getPassword(), savedTeam.getPassword())) {
            int failedAttempts = savedTeam.getFailedAttempts() != null ? savedTeam.getFailedAttempts() : 0;
            updateFailedAttempts(savedTeam, failedAttempts + 1);
            throw new PasswordInvalidException();
        }

        savedTeam.setLastLoginDate(LocalDate.now());
        teamRepository.save(savedTeam);
        updateFailedAttempts(savedTeam, 0);
        return savedTeam;
    }

    public void generateColumns(Team team) {
        var happyColumn = new Column(null, "happy", "Happy", team.getUri());
        var confusedColumn = new Column(null, "confused", "Confused", team.getUri());
        var unhappyColumn = new Column(null, "unhappy", "Sad", team.getUri());

        columnRepository.save(happyColumn);
        columnRepository.save(confusedColumn);
        columnRepository.save(unhappyColumn);
    }

    public void changePassword(Team existingTeam, String newPassword){
        existingTeam.setPassword(newPassword);
        teamRepository.save(existingTeam);
    }

    private void updateFailedAttempts(Team savedTeam, int failedAttempts) {
        savedTeam.setFailedAttempts(failedAttempts);
        teamRepository.save(savedTeam);
    }

    public void updateTeamEmailAddresses(String teamId, UpdateTeamEmailAddressesRequest request) {
        Team team = this.getTeamByUri(teamId);
        team.setEmail(request.email1());
        team.setSecondaryEmail(request.email2());
        Team updatedTeam = teamRepository.save(team);
        websocketService.publishEvent(new WebsocketTeamEvent(updatedTeam.getId(), UPDATE, updatedTeam));
    }
}
