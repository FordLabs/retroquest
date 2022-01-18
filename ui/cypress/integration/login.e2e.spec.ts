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

describe('Login Page', () => {
  const loginFailedMessage = 'Incorrect team name or password. Please try again.';
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

    cy.visit('/login');
    cy.contains('Sign in to your Team!').should('exist');

    cy.get('[data-testid=teamNameInput]').as('teamNameInput');
    cy.get('[data-testid=passwordInput]').as('passwordInput');
    cy.get('[data-testid=formSubmitButton]').as('loginButton');
  });

  it('Navigates to team board after successful login', () => {
    login(teamCredentials);
    cy.url().should('eq', `${Cypress.config().baseUrl}/team/${teamCredentials.teamId}`);
  });

  it('Pre-populates team name', () => {
    cy.get('[data-testid=teamNameInput]').as('teamNameInput');
    cy.get('@teamNameInput').should('have.value', '');

    cy.visit(`/login/${teamCredentials.teamId}`);
    cy.get('@teamNameInput').should('have.value', teamCredentials.teamName);
  });

  describe('Form Errors', () => {
    it('Redirects to login page when action comes back unauthorized', () => {
      login(teamCredentials);
      cy.document().setCookie('token', '');
      cy.document().setCookie('JSESSIONID', '');
      cy.enterThought('happy', 'I have a thought');
      cy.url().should('eq', Cypress.config().baseUrl + '/login');
    });

    it('Displays invalid team name when logging in with bad team', () => {
      login({
        teamName: 'Something not correct',
        teamId: 'Something not correct',
        password: 'Something else wrong 1',
        jwt: '',
      });
      cy.get('[data-testid=formErrorMessage]').should('contain', loginFailedMessage);
    });

    it('Displays invalid team name/password when using bad password', () => {
      login({
        ...teamCredentials,
        password: 'Something else wrong 1',
      });
      cy.get('[data-testid=formErrorMessage]').should('contain', loginFailedMessage);
    });
  });
});

function login({ teamName, password }: TeamCredentials) {
  cy.log('**Log in using the login form**');
  cy.get('@teamNameInput').type(teamName);
  cy.get('@passwordInput').type(password);
  cy.get('@loginButton').click();

  cy.wait('@postTeamLogin');
}
