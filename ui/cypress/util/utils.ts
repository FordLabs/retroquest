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

export interface TeamCredentials {
  teamName: string;
  teamId: string;
  password: string;
  jwt: string;
}

export function teamBoardUrl(teamId: string): string {
  console.log(`**** ${teamId} *****`);
  return `/team/${teamId}`;
}

export function goToTeamBoard(teamCredentials: TeamCredentials) {
  cy.visit(teamBoardUrl(teamCredentials.teamId), {
    headers: {
      bearer: teamCredentials.jwt,
    },
  });
}

function enterText(selector: string, textToEnter: string) {
  cy.get(selector).type(textToEnter);
}

function click(selector: string) {
  cy.get(selector).click();
}

export function login(teamName: string, teamPassword: string) {
  cy.visit('/login');
  enterText('#teamNameInput', teamName);
  enterText('#teamPasswordInput', teamPassword);
  click('#signInButton');
}

function createBoard(teamCredentials: TeamCredentials) {
  cy.visit('/create');
  enterText('#teamNameInput', teamCredentials.teamName);
  enterText('#teamPasswordInput', teamCredentials.password);
  enterText('#teamPasswordConfirmInput', teamCredentials.password);
  click('#createRetroButton');
}

export function createTeamIfNecessaryAndLogin(
  teamCredentials: TeamCredentials
) {
  cy.request({
    url: `/api/team/login`,
    failOnStatusCode: false,
    method: 'POST',
    body: {
      name: teamCredentials.teamName,
      password: teamCredentials.password,
      captchaResponse: null,
    },
  }).then((response) => {
    console.log(response.body);
    if (response.status === 200) {
      teamCredentials.jwt = response.body;
      login(teamCredentials.teamName, teamCredentials.password);
    } else {
      createBoard(teamCredentials);
    }
  });
}
