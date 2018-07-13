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

import com.ford.labs.retroquest.security.JwtBuilder;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.when;
import static org.springframework.http.HttpStatus.OK;

@RunWith(MockitoJUnitRunner.class)
public class TeamControllerTest {

    @Mock
    private TeamService teamService;

    @Mock
    private JwtBuilder jwtBuilder;

    @Mock
    private TeamRepository teamRepository;

    @InjectMocks
    private TeamController controller;

    @Test
    public void returnsCorrectContenttypeAndDispositionWhenRequestingCsv() throws IOException {
        LocalDate today = LocalDate.now();
        String expectedFilename = String.format("\"beach-bums-retro-%d-%d-%d.csv\"", today.getMonthValue(), today.getDayOfMonth(), today.getYear());

        when(teamService.buildCsvFileFromTeam("beach-bums")).thenReturn(new CsvFile("beach-bums", new ArrayList<>(), new ArrayList<>()));

        ResponseEntity<byte[]> response = controller.downloadTeamBoard("beach-bums");

        assertEquals(OK, response.getStatusCode());
        assertEquals("[text/csv]", response.getHeaders().get(HttpHeaders.CONTENT_TYPE).toString());
        assertEquals("[attachment; filename="+ expectedFilename +"]", response.getHeaders().get(HttpHeaders.CONTENT_DISPOSITION).toString());
    }

    @Test
    public void returnsJwtOnSuccessfulLogin() {
        String expectedJwt = "I am a JWT";
        RequestedTeam requestedTeam = new RequestedTeam("A Team", "password");
        Team savedTeam = new Team();
        savedTeam.setUri("a-team");
        savedTeam.setPassword("password");

        when(teamService.login(requestedTeam)).thenReturn(savedTeam);
        when(jwtBuilder.buildJwt("a-team")).thenReturn(expectedJwt);
        when(teamRepository.findTeamByName("A Team")).thenReturn(savedTeam);

        ResponseEntity<String> actualResponse = controller.login(requestedTeam);

        assertEquals(expectedJwt, actualResponse.getBody());
    }

    @Test
    public void returnsJwtOnTeamCreation() {
        String expectedJwt = "I am a JWT";
        RequestedTeam requestedTeam = new RequestedTeam("A Team", "password");
        Team savedTeam = new Team();
        savedTeam.setUri("a-team");
        savedTeam.setPassword("password");

        when(teamService.createNewTeam(requestedTeam)).thenReturn(savedTeam);
        when(jwtBuilder.buildJwt("a-team")).thenReturn(expectedJwt);
        when(teamRepository.findTeamByName("A Team")).thenReturn(savedTeam);

        ResponseEntity<String> actualResponse = controller.createTeam(requestedTeam);

        assertEquals(expectedJwt, actualResponse.getBody());
    }
}