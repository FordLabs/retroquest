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

package com.ford.labs.retroquest.deprecated_tests;

import com.ford.labs.retroquest.columntitle.ColumnTitle;
import com.ford.labs.retroquest.columntitle.ColumnTitleRepository;
import com.ford.labs.retroquest.exception.BoardDoesNotExistException;
import com.ford.labs.retroquest.exception.PasswordInvalidException;
import com.ford.labs.retroquest.team.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.AdditionalAnswers.returnsFirstArg;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TeamServiceTest {

    @Mock
    private TeamRepository teamRepository;

    @Mock
    private ColumnTitleRepository columnTitleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private TeamService teamService;

    @Test
    void convertValidTeamNametoURI() {
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
    void updatePassword_WithValidInformation_SavesNewPassword() {
        Team savedTeam = new Team();
        savedTeam.setUri("a-name");
        savedTeam.setName("A name");
        savedTeam.setPassword("encryptedPassword");
        savedTeam.setDateCreated(LocalDate.now());

        UpdatePasswordRequest updatePasswordRequest = new UpdatePasswordRequest();
        updatePasswordRequest.setTeamId("a-name");
        updatePasswordRequest.setNewPassword("newPassword");
        updatePasswordRequest.setPreviousPassword("password");

        when(passwordEncoder.matches("password", "encryptedPassword")).thenReturn(true);
        when(passwordEncoder.encode("newPassword")).thenReturn("newEncryptedPassword");
        when(teamRepository.findTeamByUri("a-name")).thenReturn(Optional.of(savedTeam));
        when(teamRepository.save(any(Team.class))).then(returnsFirstArg());

        savedTeam = teamService.updatePassword(updatePasswordRequest);
        assertEquals("newEncryptedPassword", savedTeam.getPassword());
        verify(teamRepository).save(any(Team.class));
    }

    @Test
    void updatePassword_WithIncorrectOldPassword_DoesNotSavePassword() {
        Team savedTeam = new Team();
        savedTeam.setUri("a-name");
        savedTeam.setName("A name");
        savedTeam.setPassword("encryptedPassword");
        savedTeam.setDateCreated(LocalDate.now());

        UpdatePasswordRequest updatePasswordRequest = new UpdatePasswordRequest();
        updatePasswordRequest.setTeamId("a-name");
        updatePasswordRequest.setNewPassword("newPassword");
        updatePasswordRequest.setPreviousPassword("incorrectPassword");

        when(passwordEncoder.matches("incorrectPassword", "encryptedPassword")).thenReturn(false);
        when(teamRepository.findTeamByUri("a-name")).thenReturn(Optional.of(savedTeam));

        assertThrows(
                PasswordInvalidException.class,
                () -> teamService.updatePassword(updatePasswordRequest)
        );
    }

    @Test
    void returnsSavedTeamOnSuccessfulLogin() {
        LoginRequest loginRequest = new LoginRequest("beach-bums", "password", "captcha");
        Team expectedTeam = new Team();
        expectedTeam.setPassword("encryptedPassword");

        when(passwordEncoder.matches("password", "encryptedPassword")).thenReturn(true);
        when(teamRepository.findTeamByNameIgnoreCase("beach-bums")).thenReturn(Optional.of(expectedTeam));
        Team actualTeam = teamService.login(loginRequest);

        assertEquals(expectedTeam, actualTeam);
    }

    @Test
    void trimsTeamNameWhenLoggingIn() {
        LoginRequest loginRequest = new LoginRequest("  beach-bums    ", "password", "captcha");
        Team expectedTeam = new Team();
        expectedTeam.setPassword("encryptedPassword");

        when(passwordEncoder.matches("password", "encryptedPassword")).thenReturn(true);
        when(teamRepository.findTeamByNameIgnoreCase("beach-bums")).thenReturn(Optional.of(expectedTeam));
        Team actualTeam = teamService.login(loginRequest);

        assertEquals(expectedTeam, actualTeam);
    }

    @Test
    void login_throwsBoardDoesNotExistExceptionWhenTeamDoesNotExist() {
        LoginRequest loginRequest = new LoginRequest("beach-bums", "password", "captcha");

        when(teamRepository.findTeamByNameIgnoreCase("beach-bums")).thenReturn(Optional.empty());
        assertThrows(
                BoardDoesNotExistException.class,
                () -> teamService.login(loginRequest)
        );
    }

    @Test
    void throwsPasswordInvalidExceptionWhenNoPasswordGiven() {
        LoginRequest loginRequest = new LoginRequest("beach-bums", null, "captcha");
        when(teamRepository.findTeamByNameIgnoreCase("beach-bums")).thenReturn(Optional.of(new Team()));

        assertThrows(
                PasswordInvalidException.class,
                () -> teamService.login(loginRequest)
        );
    }

    @Test
    void throwsPasswordInvalidExceptionWhenPasswordsDoNotMatch() {
        LoginRequest loginRequest = new LoginRequest("beach-bums", "notPassword", "captcha");
        Team expectedTeam = new Team();

        expectedTeam.setPassword("encryptedPassword");
        expectedTeam.setName("beach-bums");

        when(passwordEncoder.matches("notPassword", "encryptedPassword")).thenReturn(false);
        when(teamRepository.findTeamByNameIgnoreCase("beach-bums")).thenReturn(Optional.of(expectedTeam));

        assertThrows(
                PasswordInvalidException.class,
                () -> teamService.login(loginRequest)
        );
    }

    @Test
    void incrementFailedAttemptsCountWhenPasswordsDoNotMatch() {
        String teamName = "beach-bums";
        String teamPassword = "encryptedPassword";

        LoginRequest loginRequest = new LoginRequest(teamName, "notPassword", "captcha");

        Team team = new Team("", teamName, teamPassword);
        Team teamAfterFailedAttempt = new Team("", teamName, teamPassword);
        teamAfterFailedAttempt.setFailedAttempts(1);

        when(teamRepository.findTeamByNameIgnoreCase(teamName)).thenReturn(Optional.of(team));
        when(passwordEncoder.matches("notPassword", teamPassword)).thenReturn(false);

        try {
            teamService.login(loginRequest);
        } catch (PasswordInvalidException ex) {
            verify(teamRepository).save(teamAfterFailedAttempt);
        }
    }

    @Test
    void resetsFailedAttemptsCountWhenPasswordsMatch() {
        String teamName = "beach-bums";
        String teamPassword = "encryptedPassword";

        LoginRequest loginRequest = new LoginRequest(teamName, teamPassword, "captcha");

        Team team = new Team("", teamName, teamPassword);
        team.setFailedAttempts(1);

        when(teamRepository.findTeamByNameIgnoreCase(teamName)).thenReturn(Optional.of(team));
        when(passwordEncoder.matches(teamPassword, teamPassword)).thenReturn(true);

        teamService.login(loginRequest);

        assertEquals(Integer.valueOf(0), team.getFailedAttempts());
    }

    @Test
    void creatingTeamAlsoCreatesThreeColumnTitles() {
        when(teamRepository.save(any(Team.class))).then(returnsFirstArg());
        when(teamRepository.findTeamByUri("beach-bums")).thenReturn(Optional.empty());

        CreateTeamRequest requestedTeam = new CreateTeamRequest("beach-bums", "password", "captcha");
        teamService.createNewTeam(requestedTeam);

        ColumnTitle happyColumnTitle = ColumnTitle.builder().teamId("beach-bums").topic("happy").title("Happy").build();
        verify(columnTitleRepository, times(1)).save(happyColumnTitle);

        ColumnTitle confusedColumnTitle = ColumnTitle.builder().teamId("beach-bums").topic("confused").title("Confused").build();
        verify(columnTitleRepository, times(1)).save(confusedColumnTitle);

        ColumnTitle unhappyColumnTitle = ColumnTitle.builder().teamId("beach-bums").topic("unhappy").title("Sad").build();
        verify(columnTitleRepository, times(1)).save(unhappyColumnTitle);
    }

    @Test
    void getTeamByName_throwsBoardDoesNotExistExceptionWhenTeamDoesNotExist() {
        when(teamRepository.findTeamByNameIgnoreCase("beach-bums")).thenReturn(Optional.empty());
        assertThrows(
                BoardDoesNotExistException.class,
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
                BoardDoesNotExistException.class,
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

    @Test
    void loggingInUpdatesLastLoginDateOfTeam() {

        Team savedTeam = new Team();
        savedTeam.setName("Name");
        savedTeam.setPassword("Password");
        when(teamRepository.findTeamByNameIgnoreCase(savedTeam.getName())).thenReturn(Optional.of(savedTeam));

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setName("Name");
        loginRequest.setPassword("Password");
        when(passwordEncoder.matches(loginRequest.getPassword(), savedTeam.getPassword())).thenReturn(true);

        teamService.login(loginRequest);

        assertTrue(savedTeam.getLastLoginDate().isEqual(LocalDate.now()));
        verify(teamRepository, times(2)).save(savedTeam);
    }
}
