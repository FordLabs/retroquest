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

package com.ford.labs.retroquest.team;

import com.ford.labs.retroquest.column.Column;
import com.ford.labs.retroquest.column.ColumnRepository;
import com.ford.labs.retroquest.exception.TeamDoesNotExistException;
import com.ford.labs.retroquest.websocket.WebsocketService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.AdditionalAnswers.returnsFirstArg;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TeamServiceTest {

    @Mock
    private TeamRepository teamRepository;

    @Mock
    private ColumnRepository columnRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private TeamService teamService;

    @Mock
    private WebsocketService websocketService;

    @Test
    void convertValidTeamNameToURI() {
        assertEquals("ford-labs", teamService.convertTeamNameToURI("Ford Labs"));
    }

    @Test
    void createNewBoard_WithValidInformation_ReturnsSavedTeamUri() {
        CreateTeamRequest requestedTeam = new CreateTeamRequest();
        requestedTeam.setName("A name");
        requestedTeam.setPassword("password");

        when(passwordEncoder.encode("password")).thenReturn("encryptedPassword");
        when(teamRepository.save(any(Team.class))).then(returnsFirstArg());
        when(teamRepository.findTeamByUri("a-name")).thenReturn(Optional.empty());

        Team actualTeam = teamService.createNewTeam(requestedTeam);

        assertEquals("A name", actualTeam.getName());
        assertEquals("a-name", actualTeam.getUri());
        assertNotNull(actualTeam.getDateCreated());
        assertEquals("encryptedPassword", actualTeam.getPassword());
    }

    @Test
    void createNewBoard_WithValidInformation_trimsNameWhitespaceFromTeamName() {
        CreateTeamRequest requestedTeam = new CreateTeamRequest();
        requestedTeam.setName("   A name");
        requestedTeam.setPassword("password");

        when(passwordEncoder.encode("password")).thenReturn("encryptedPassword");
        when(teamRepository.save(any(Team.class))).then(returnsFirstArg());
        when(teamRepository.findTeamByUri("a-name")).thenReturn(Optional.empty());

        Team actualTeam = teamService.createNewTeam(requestedTeam);

        assertEquals("A name", actualTeam.getName());
        assertEquals("a-name", actualTeam.getUri());
        assertNotNull(actualTeam.getDateCreated());
        assertEquals("encryptedPassword", actualTeam.getPassword());
    }

    @Test
    void creatingTeamAlsoCreatesThreeColumns() {
        when(teamRepository.save(any(Team.class))).then(returnsFirstArg());
        when(teamRepository.findTeamByUri("beach-bums")).thenReturn(Optional.empty());

        CreateTeamRequest requestedTeam = new CreateTeamRequest("beach-bums", "password");
        teamService.createNewTeam(requestedTeam);

        Column happyColumn = new Column(null, "happy", "Happy", "beach-bums");
        Column confusedColumn = new Column(null, "confused", "Confused", "beach-bums");
        Column unhappyColumn = new Column(null, "unhappy", "Sad", "beach-bums");

        var inOrder = inOrder(columnRepository);
        inOrder.verify(columnRepository, times(1)).save(happyColumn);
        inOrder.verify(columnRepository, times(1)).save(confusedColumn);
        inOrder.verify(columnRepository, times(1)).save(unhappyColumn);
    }

    @Test
    void getTeamByName_throwsBoardDoesNotExistExceptionWhenTeamDoesNotExist() {
        when(teamRepository.findTeamByNameIgnoreCase("beach-bums")).thenReturn(Optional.empty());
        assertThrows(
                TeamDoesNotExistException.class,
                () -> teamService.getTeamByName("beach-bums")
        );
    }

    @Test
    void getTeamByName_ReturnsTeam() {
        Team expectedTeam = new Team();
        String name = "expected-name";
        expectedTeam.setName(name);
        when(teamRepository.findTeamByNameIgnoreCase(name)).thenReturn(Optional.of(expectedTeam));

        Team actualTeam = teamService.getTeamByName(name);

        assertEquals(name, actualTeam.getName());
    }

    @Test
    void getTeamByName_trimsWhitespace() {
        Team expectedTeam = new Team();
        String name = "expected-name";
        expectedTeam.setName(name);
        when(teamRepository.findTeamByNameIgnoreCase(name)).thenReturn(Optional.of(expectedTeam));

        Team actualTeam = teamService.getTeamByName("    "+name+"     ");

        assertEquals(name, actualTeam.getName());
    }

    @Test
    void getTeamByUri_throwsBoardDoesNotExistExceptionWhenTeamDoesNotExist() {
        when(teamRepository.findTeamByUri("beach-bums")).thenReturn(Optional.empty());
        assertThrows(
                TeamDoesNotExistException.class,
                () -> teamService.getTeamByUri("beach-bums")
        );
    }

    @Test
    void getTeamByUri_ReturnsTeam() {
        Team expectedTeam = new Team();
        String uri = "expected-uri";
        expectedTeam.setUri(uri);
        when(teamRepository.findTeamByUri(uri)).thenReturn(Optional.of(expectedTeam));

        Team actualTeam = teamService.getTeamByUri(uri);

        assertEquals(uri, actualTeam.getUri());
    }
}
