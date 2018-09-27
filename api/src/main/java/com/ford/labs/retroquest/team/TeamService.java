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

import com.ford.labs.retroquest.actionitem.ActionItem;
import com.ford.labs.retroquest.actionitem.ActionItemRepository;
import com.ford.labs.retroquest.columntitle.ColumnTitle;
import com.ford.labs.retroquest.columntitle.ColumnTitleRepository;
import com.ford.labs.retroquest.exception.BoardDoesNotExistException;
import com.ford.labs.retroquest.exception.PasswordInvalidException;
import com.ford.labs.retroquest.thought.Thought;
import com.ford.labs.retroquest.thought.ThoughtRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class TeamService {
    private final ThoughtRepository thoughtRepository;
    private final ActionItemRepository actionItemRepository;
    private final TeamRepository teamRepository;
    private final PasswordEncoder passwordEncoder;
    private final ColumnTitleRepository columnTitleRepository;

    public TeamService(
            ThoughtRepository thoughtRepository,
            ActionItemRepository actionItemRepository,
            TeamRepository teamRepository,
            PasswordEncoder passwordEncoder,
            ColumnTitleRepository columnTitleRepository
    ) {
        this.thoughtRepository = thoughtRepository;
        this.actionItemRepository = actionItemRepository;
        this.teamRepository = teamRepository;
        this.passwordEncoder = passwordEncoder;
        this.columnTitleRepository = columnTitleRepository;
    }

    public String convertTeamNameToURI(String teamName) {
        return teamName.toLowerCase().replace(" ", "-");
    }

    public CsvFile buildCsvFileFromTeam(String team) {
        List<Thought> thoughts = thoughtRepository.findAllByTeamIdOrderByTopic(team);
        List<ActionItem> actionItems = actionItemRepository.findAllByTeamId(team);
        return new CsvFile(team, thoughts, actionItems);
    }

    public Team createNewTeam(CreateTeamRequest createTeamRequest) {
        String requestedName = createTeamRequest.getName();

        Team teamEntity = new Team();
        teamEntity.setName(requestedName);
        teamEntity.setUri(convertTeamNameToURI(requestedName));
        teamEntity.setDateCreated(LocalDate.now());

        String encryptedPassword = passwordEncoder.encode(createTeamRequest.getPassword());
        teamEntity.setPassword(encryptedPassword);

        teamEntity = teamRepository.save(teamEntity);

        ColumnTitle happyColumnTitle = new ColumnTitle();
        happyColumnTitle.setTeamId(teamEntity.getUri());
        happyColumnTitle.setTopic("happy");
        happyColumnTitle.setTitle("Happy");

        ColumnTitle confusedColumnTitle = new ColumnTitle();
        confusedColumnTitle.setTeamId(teamEntity.getUri());
        confusedColumnTitle.setTopic("confused");
        confusedColumnTitle.setTitle("Confused");

        ColumnTitle unhappyColumnTitle = new ColumnTitle();
        unhappyColumnTitle.setTeamId(teamEntity.getUri());
        unhappyColumnTitle.setTopic("unhappy");
        unhappyColumnTitle.setTitle("Sad");

        columnTitleRepository.save(happyColumnTitle);
        columnTitleRepository.save(confusedColumnTitle);
        columnTitleRepository.save(unhappyColumnTitle);

        return teamEntity;
    }

    public Team login(LoginRequest loginRequest) {
        Team savedTeam = getTeamByName(loginRequest.getName());

        if (loginRequest.getPassword() == null || !passwordEncoder.matches(loginRequest.getPassword(), savedTeam.getPassword())) {
            Integer failedAttempts = savedTeam.getFailedAttempts() != null ? savedTeam.getFailedAttempts() : 0;
            updateFailedAttempts(savedTeam, failedAttempts + 1);
            throw new PasswordInvalidException();
        }

        savedTeam.setLastLoginDate(LocalDate.now());
        teamRepository.save(savedTeam);
        updateFailedAttempts(savedTeam, 0);
        return savedTeam;
    }

    private void updateFailedAttempts(Team savedTeam, int failedAttempts) {
        savedTeam.setFailedAttempts(failedAttempts);
        teamRepository.save(savedTeam);
    }

    public Team getTeamByName(String teamName) {
        Optional<Team> team = teamRepository.findTeamByName(teamName);
        if (team.isPresent()) {
            return team.get();
        }
        throw new BoardDoesNotExistException();
    }

    public Team getTeamByUri(String teamUri) {
        Optional<Team> team = teamRepository.findTeamByUri(teamUri.toLowerCase());
        if (team.isPresent()) {
            return team.get();
        }
        throw new BoardDoesNotExistException();
    }

    public long getTeamCount() {
        return teamRepository.count();
    }

}
