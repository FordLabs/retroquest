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

import { getRetroPagePathWithTeamId } from '../../src/react/routes/RouteConstants';
import { CREATE_TEAM_API_PATH, LOGIN_API_PATH } from '../../src/react/services/ApiConstants';

import TeamCredentials from './types/teamCredentials';

Cypress.Commands.add('createTeam', ({ teamName, password }: TeamCredentials) => {
  cy.log('**Creating Team via api**');
  cy.request({
    url: CREATE_TEAM_API_PATH,
    failOnStatusCode: false,
    method: 'POST',
    body: {
      name: teamName,
      password,
    },
  });
});

Cypress.Commands.add('createTeamAndLogin', (teamCredentials: TeamCredentials) => {
  cy.createTeam(teamCredentials).then(() => {
    cy.log('**Logging in via api**');
    cy.request({
      url: LOGIN_API_PATH,
      failOnStatusCode: false,
      method: 'POST',
      body: {
        name: teamCredentials.teamName,
        password: teamCredentials.password,
        captchaResponse: null,
      },
    }).then((response) => {
      if (response.status === 200) {
        const token = response.body as string;
        cy.setCookie('token', token);
        const retroPagePath = getRetroPagePathWithTeamId(teamCredentials.teamId);
        cy.visit(retroPagePath);
        cy.contains(teamCredentials.teamName).should('exist');
      } else {
        cy.log('**Login via api failed with status code: **' + response.status);
      }
    });
  });
});

Cypress.Commands.add('enterThought', (columnClass: string, thought: string) => {
  cy.get(`div.${columnClass}.rq-thought-column-header`)
    .find('input[placeholder="Enter A Thought"]')
    .type(`${thought}{enter}`);
});

Cypress.Commands.add('shouldBeOnRetroPage', (teamId: string) => {
  cy.log('**Should be on retro page**');
  cy.url().should('eq', Cypress.config().baseUrl + getRetroPagePathWithTeamId(teamId));
  cy.findByText('Happy').should('exist');
  cy.findByText('Confused').should('exist');
  cy.findByText('Sad').should('exist');
});
