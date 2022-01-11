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

import { createTeamIfNecessaryAndLogin, login, teamBoardUrl, TeamCredentials } from '../util/utils';

describe('Logging In', () => {
  const teamCredentials = {
    teamName: 'Test Login',
    teamId: 'test-login',
    password: 'Login1234',
    jwt: '',
  } as TeamCredentials;

  beforeEach(() => {
    cy.intercept('POST', '/api/team/login').as('postTeamLogin');

    createTeamIfNecessaryAndLogin(teamCredentials);
  });

  function enterThought(columnClass: string, thought: string) {
    cy.get(`div.${columnClass}.rq-thought-column-header`)
      .find('input[placeholder="Enter A Thought"]')
      .type(`${thought}{enter}`);
  }

  it('Redirects to login page when action comes back unauthorized', () => {
    cy.wait('@postTeamLogin').then(() => {
      cy.document().setCookie('token', '');
      cy.document().setCookie('JSESSIONID', '');
      enterThought('happy', 'I have a thought');
      cy.url().should('eq', Cypress.config().baseUrl + '/login');
    });
  });

  it('Displays invalid team name when logging in with bad team', () => {
    login('Something not correct', 'Something else wrong');
    cy.findByText('Incorrect board name. Please try again.').should('exist');
  });

  it('Displays invalid team name/password when using bad password', () => {
    login(teamCredentials.teamName, 'Something else wrong');
    cy.findByText('Incorrect board or password. Please try again.').should('exist');
  });

  it('Navigates to team board after successful login', () => {
    login(teamCredentials.teamName, teamCredentials.password);
    cy.url().should('eq', Cypress.config().baseUrl + teamBoardUrl(teamCredentials.teamId));
  });
});
