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

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
import '@testing-library/cypress/add-commands';

import TeamCredentials from './types/teamCredentials';

Cypress.Commands.add('login', (teamCredentials: TeamCredentials) => {
  cy.visit('/login');
  enterText('[data-testid=teamNameInput]', teamCredentials.teamName);
  enterText('[data-testid=teamPasswordInput]', teamCredentials.password);
  click('[data-testid=formSubmitButton]');
});

Cypress.Commands.add('createTeam', (teamCredentials: TeamCredentials) => {
  cy.visit('/create');
  enterText('#teamNameInput', teamCredentials.teamName);
  enterText('#teamPasswordInput', teamCredentials.password);
  enterText('#teamPasswordConfirmInput', teamCredentials.password);
  click('#createRetroButton');
});

Cypress.Commands.add('createTeamIfNecessaryAndLogin', (teamCredentials: TeamCredentials) => {
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
      cy.login(teamCredentials);
    } else {
      cy.createTeam(teamCredentials);
    }
  });
});

Cypress.Commands.add('enterThought', (columnClass: string, thought: string) => {
  cy.get(`div.${columnClass}.rq-thought-column-header`)
    .find('input[placeholder="Enter A Thought"]')
    .type(`${thought}{enter}`);
});

function click(selector: string) {
  cy.get(selector).click();
}

function enterText(selector: string, textToEnter: string) {
  cy.get(selector).type(textToEnter);
}
