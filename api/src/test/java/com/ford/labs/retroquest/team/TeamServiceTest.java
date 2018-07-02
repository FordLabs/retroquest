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

import com.ford.labs.retroquest.actionitem.ActionItemRepository;
import com.ford.labs.retroquest.columntitle.ColumnTitle;
import com.ford.labs.retroquest.columntitle.ColumnTitleRepository;
import com.ford.labs.retroquest.exception.BoardDoesNotExistException;
import com.ford.labs.retroquest.exception.PasswordInvalidException;
import com.ford.labs.retroquest.exception.TeamAlreadyHasPasswordException;
import com.ford.labs.retroquest.thought.ThoughtRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.AdditionalAnswers.returnsFirstArg;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class TeamServiceTest {

    @Mock
    private TeamRepository teamRepository;

    @Mock
    private ThoughtRepository thoughtRepository;

    @Mock
    private ActionItemRepository actionItemRepository;

    @Mock
    private ColumnTitleRepository columnTitleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private TeamService teamService = new TeamService();

    @Test
    public void convertValidTeamNametoURI() {
        assertEquals("ford-labs", teamService.convertTeamNameToURI("Ford Labs"));
    }

    @Test
    public void createNewBoard_WithValidInformation_ReturnsSavedTeamUri() {
        Team expectedSaveEntity = new Team();
        expectedSaveEntity.setUri("a-name");
        expectedSaveEntity.setName("A name");
        expectedSaveEntity.setPassword("encryptedPassword");

        Team savedEntity = new Team();
        savedEntity.setUri("a-name");
        savedEntity.setName("A name");
        savedEntity.setPassword("encryptedPassword");
        savedEntity.setDateCreated();

        RequestedTeam requestedTeam = new RequestedTeam();
        requestedTeam.setName("A name");
        requestedTeam.setPassword("password");

        when(passwordEncoder.encode("password")).thenReturn("encryptedPassword");
        when(this.teamRepository.save(expectedSaveEntity)).thenReturn(savedEntity);

        Team actualTeam = teamService.createNewTeam(requestedTeam);

        assertEquals("A name", actualTeam.getName());
        assertEquals("a-name", actualTeam.getUri());
        assertTrue(actualTeam.getDateCreated() != null);
        assertEquals("encryptedPassword", actualTeam.getPassword());
    }

    @Test
    public void shouldSavePasswordWhenNoneInDatabase() {
        SetPasswordRequest requestedPassword = new SetPasswordRequest();
        requestedPassword.setPassword("password");

        Team savedTeam = new Team();
        savedTeam.setUri("a-team");
        savedTeam.setName("A Team");

        Team expectedTeam = new Team();
        expectedTeam.setUri("a-team");
        expectedTeam.setName("A Team");
        expectedTeam.setPassword("encryptedPassword");

        when(teamRepository.findOne("a-team")).thenReturn(savedTeam);
        when(passwordEncoder.encode("password")).thenReturn("encryptedPassword");

        teamService.setTeamPassword("a-team", requestedPassword);

        verify(teamRepository).save(expectedTeam);
    }

    @Test(expected = TeamAlreadyHasPasswordException.class)
    public void setPasswordShouldThrowExceptionWhenTeamAlreadyHasPassword() {
        SetPasswordRequest requestedPassword = new SetPasswordRequest();
        requestedPassword.setPassword("password");

        Team savedTeam = new Team();
        savedTeam.setUri("a-team");
        savedTeam.setName("A Team");
        savedTeam.setPassword("otherPassword");

        when(teamRepository.findOne("a-team")).thenReturn(savedTeam);
        when(passwordEncoder.encode("password")).thenReturn("encryptedPassword");

        teamService.setTeamPassword("a-team", requestedPassword);
    }

    @Test
    public void returnsSavedTeamOnSuccessfulLogin() {
        RequestedTeam requestedTeam = new RequestedTeam("beach-bums", "password");
        Team expectedTeam = new Team();
        expectedTeam.setPassword("encryptedPassword");

        when(passwordEncoder.matches("password", "encryptedPassword")).thenReturn(true);
        when(teamRepository.findTeamByName("beach-bums")).thenReturn(expectedTeam);
        Team actualTeam = teamService.login(requestedTeam);

        assertEquals(expectedTeam, actualTeam);
    }

    @Test(expected = BoardDoesNotExistException.class)
    public void throwsBoardDoesNotExistExceptionWhenTeamDoesNotExist() {
        RequestedTeam requestedTeam = new RequestedTeam("beach-bums", "password");

        when(teamRepository.findTeamByName("beach-bums")).thenReturn(null);
        teamService.login(requestedTeam);
    }

    @Test(expected = PasswordInvalidException.class)
    public void throwsPasswordInvalidExceptionWhenNoPasswordGiven() {
        RequestedTeam requestedTeam = new RequestedTeam("beach-bums", null);
        when(teamRepository.findTeamByName("beach-bums")).thenReturn(new Team());

        teamService.login(requestedTeam);
    }

    @Test(expected = PasswordInvalidException.class)
    public void throwsPasswordInvalidExceptionWhenPasswordsDoNotMatch() {
        RequestedTeam requestedTeam = new RequestedTeam("beach-bums", "notPassword");
        Team expectedTeam = new Team();

        expectedTeam.setPassword("encryptedPassword");
        expectedTeam.setName("beach-bums");

        when(passwordEncoder.matches("notPassword", "encryptedPassword")).thenReturn(false);
        when(teamRepository.findTeamByName("beach-bums")).thenReturn(expectedTeam);

        teamService.login(requestedTeam);
    }

    @Test
    public void creatingTeamAlsoCreatesThreeColumnTitles() {
        when(this.teamRepository.save(any(Team.class))).then(returnsFirstArg());

        RequestedTeam requestedTeam = new RequestedTeam("beach-bums", "password");
        teamService.createNewTeam(requestedTeam);

        ColumnTitle happyColumnTitle = ColumnTitle.builder().teamId("beach-bums").topic("happy").title("Happy").build();
        verify(columnTitleRepository, times(1)).save(happyColumnTitle);

        ColumnTitle confusedColumnTitle = ColumnTitle.builder().teamId("beach-bums").topic("confused").title("Confused").build();
        verify(columnTitleRepository, times(1)).save(confusedColumnTitle);

        ColumnTitle unhappyColumnTitle = ColumnTitle.builder().teamId("beach-bums").topic("unhappy").title("Sad").build();
        verify(columnTitleRepository, times(1)).save(unhappyColumnTitle);
    }
}