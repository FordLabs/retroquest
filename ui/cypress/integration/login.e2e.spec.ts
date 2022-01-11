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

import TeamCredentials from '../support/types/teamCredentials';

describe('Logging In', () => {
  const teamCredentials = {
    teamName: 'Test Login',
    teamId: 'test-login',
    password: 'Login1234',
    jwt: '',
  } as TeamCredentials;

  before(() => {
    cy.createTeam(teamCredentials);
  });

  beforeEach(() => {
    cy.intercept('POST', '/api/team/login').as('postTeamLogin');
  });

  it('Redirects to login page when action comes back unauthorized', () => {
    cy.login(teamCredentials);
    cy.wait('@postTeamLogin');
    cy.document().setCookie('token', '');
    cy.document().setCookie('JSESSIONID', '');
    cy.enterThought('happy', 'I have a thought');
    cy.url().should('eq', Cypress.config().baseUrl + '/login');
  });

  it('Displays invalid team name when logging in with bad team', () => {
    cy.login({
      teamName: 'Something not correct',
      teamId: 'Something not correct',
      password: 'Something else wrong 1',
      jwt: '',
    });
    cy.wait('@postTeamLogin');
    cy.get('[data-testid=formErrorMessage]').should('contain', 'Incorrect board or password. Please try again.');
  });

  it('Displays invalid team name/password when using bad password', () => {
    cy.login({
      ...teamCredentials,
      password: 'Something else wrong 1',
    });
    cy.wait('@postTeamLogin');
    cy.get('[data-testid=formErrorMessage]').should('contain', 'Incorrect board or password. Please try again.');
  });

  it('Navigates to team board after successful login', () => {
    cy.login(teamCredentials);
    cy.url().should('eq', `${Cypress.config().baseUrl}/team/${teamCredentials.teamId}`);
  });

  it('Pre-populates team name', () => {
    cy.visit('/login');
    cy.contains('Sign in to your Team!');

    cy.get('#teamNameInput').as('teamNameInput');
    cy.get('@teamNameInput').should('have.value', '');

    cy.visit(`/login/${teamCredentials.teamId}`);
    cy.get('@teamNameInput').should('have.value', teamCredentials.teamName);
  });
});
