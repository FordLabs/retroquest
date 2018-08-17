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

import com.ford.labs.retroquest.columntitle.ColumnTitle;
import com.ford.labs.retroquest.columntitle.ColumnTitleRepository;
import com.ford.labs.retroquest.exception.BoardDoesNotExistException;
import com.ford.labs.retroquest.exception.PasswordInvalidException;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.AdditionalAnswers.returnsFirstArg;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class TeamServiceTest {

    @Mock
    private TeamRepository teamRepository;

    @Mock
    private ColumnTitleRepository columnTitleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private TeamService teamService;

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
        savedEntity.setDateCreated(LocalDate.now());

        CreateTeamRequest requestedTeam = new CreateTeamRequest();
        requestedTeam.setName("A name");
        requestedTeam.setPassword("password");

        when(passwordEncoder.encode("password")).thenReturn("encryptedPassword");
        when(this.teamRepository.save(any(Team.class))).then(returnsFirstArg());

        Team actualTeam = teamService.createNewTeam(requestedTeam);

        assertEquals("A name", actualTeam.getName());
        assertEquals("a-name", actualTeam.getUri());
        assertTrue(actualTeam.getDateCreated() != null);
        assertEquals("encryptedPassword", actualTeam.getPassword());
    }

    @Test
    public void returnsSavedTeamOnSuccessfulLogin() {
        LoginRequest loginRequest = new LoginRequest("beach-bums", "password", "captcha");
        Team expectedTeam = new Team();
        expectedTeam.setPassword("encryptedPassword");

        when(passwordEncoder.matches("password", "encryptedPassword")).thenReturn(true);
        when(teamRepository.findTeamByName("beach-bums")).thenReturn(Optional.of(expectedTeam));
        Team actualTeam = teamService.login(loginRequest);

        assertEquals(expectedTeam, actualTeam);
    }

    @Test(expected = BoardDoesNotExistException.class)
    public void login_throwsBoardDoesNotExistExceptionWhenTeamDoesNotExist() {
        LoginRequest loginRequest = new LoginRequest("beach-bums", "password", "captcha");

        when(teamRepository.findTeamByName("beach-bums")).thenReturn(Optional.empty());
        teamService.login(loginRequest);
    }

    @Test(expected = PasswordInvalidException.class)
    public void throwsPasswordInvalidExceptionWhenNoPasswordGiven() {
        LoginRequest loginRequest = new LoginRequest("beach-bums", null, "captcha");
        when(teamRepository.findTeamByName("beach-bums")).thenReturn(Optional.of(new Team()));

        teamService.login(loginRequest);
    }

    @Test(expected = PasswordInvalidException.class)
    public void throwsPasswordInvalidExceptionWhenPasswordsDoNotMatch() {
        LoginRequest loginRequest = new LoginRequest("beach-bums", "notPassword", "captcha");
        Team expectedTeam = new Team();

        expectedTeam.setPassword("encryptedPassword");
        expectedTeam.setName("beach-bums");

        when(passwordEncoder.matches("notPassword", "encryptedPassword")).thenReturn(false);
        when(teamRepository.findTeamByName("beach-bums")).thenReturn(Optional.of(expectedTeam));

        teamService.login(loginRequest);
    }

    @Test
    public void incrementFailedAttemptsCountWhenPasswordsDoNotMatch() {
        String teamName = "beach-bums";
        String teamPassword = "encryptedPassword";

        LoginRequest loginRequest = new LoginRequest(teamName, "notPassword", "captcha");

        Team team = new Team("", teamName, teamPassword);
        Team teamAfterFailedAttempt = new Team("", teamName, teamPassword);
        teamAfterFailedAttempt.setFailedAttempts(1);

        when(teamRepository.findTeamByName(teamName)).thenReturn(Optional.of(team));
        when(passwordEncoder.matches("notPassword", teamPassword)).thenReturn(false);

        try {
            teamService.login(loginRequest);
        } catch (PasswordInvalidException ex) {
            verify(teamRepository).save(teamAfterFailedAttempt);
        }
    }

    @Test
    public void resetsFailedAttemptsCountWhenPasswordsMatch() {
        String teamName = "beach-bums";
        String teamPassword = "encryptedPassword";

        LoginRequest loginRequest = new LoginRequest(teamName, teamPassword, "captcha");

        Team team = new Team("", teamName, teamPassword);
        team.setFailedAttempts(1);

        when(teamRepository.findTeamByName(teamName)).thenReturn(Optional.of(team));
        when(passwordEncoder.matches(teamPassword, teamPassword)).thenReturn(true);

        teamService.login(loginRequest);

        assertEquals(Integer.valueOf(0), team.getFailedAttempts());
    }

    @Test
    public void creatingTeamAlsoCreatesThreeColumnTitles() {
        when(this.teamRepository.save(any(Team.class))).then(returnsFirstArg());

        CreateTeamRequest requestedTeam = new CreateTeamRequest("beach-bums", "password", "captcha");
        teamService.createNewTeam(requestedTeam);

        ColumnTitle happyColumnTitle = ColumnTitle.builder().teamId("beach-bums").topic("happy").title("Happy").build();
        verify(columnTitleRepository, times(1)).save(happyColumnTitle);

        ColumnTitle confusedColumnTitle = ColumnTitle.builder().teamId("beach-bums").topic("confused").title("Confused").build();
        verify(columnTitleRepository, times(1)).save(confusedColumnTitle);

        ColumnTitle unhappyColumnTitle = ColumnTitle.builder().teamId("beach-bums").topic("unhappy").title("Sad").build();
        verify(columnTitleRepository, times(1)).save(unhappyColumnTitle);
    }

    @Test(expected = BoardDoesNotExistException.class)
    public void getTeamByName_throwsBoardDoesNotExistExceptionWhenTeamDoesNotExist() {
        when(teamRepository.findTeamByName("beach-bums")).thenReturn(Optional.empty());
        teamService.getTeamByName("beach-bums");
    }

    @Test
    public void getTeamByName_ReturnsTeam() {
        Team expectedTeam = new Team();
        String name = "expected-name";
        expectedTeam.setName(name);
        when(teamRepository.findTeamByName(name)).thenReturn(Optional.of(expectedTeam));

        Team actualTeam = teamService.getTeamByName(name);

        assertEquals(name, actualTeam.getName());
    }

    @Test(expected = BoardDoesNotExistException.class)
    public void getTeamByUri_throwsBoardDoesNotExistExceptionWhenTeamDoesNotExist() {
        when(teamRepository.findTeamByUri("beach-bums")).thenReturn(Optional.empty());
        teamService.getTeamByUri("beach-bums");
    }

    @Test
    public void getTeamByUri_ReturnsTeam() {
        Team expectedTeam = new Team();
        String uri = "expected-uri";
        expectedTeam.setUri(uri);
        when(teamRepository.findTeamByUri(uri)).thenReturn(Optional.of(expectedTeam));

        Team actualTeam = teamService.getTeamByUri(uri);

        assertEquals(uri, actualTeam.getUri());
    }
}