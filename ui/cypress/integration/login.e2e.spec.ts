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

import {
  createTeamIfNecessaryAndLogin,
  teamBoardUrl,
  TeamCredentials,
} from '../util/utils';

describe('Logging In', () => {
  const teamCredentials = {
    teamName: 'Test Login',
    teamId: 'test-login',
    password: 'Login1234',
    jwt: '',
  } as TeamCredentials;

  before(() => {
    createTeamIfNecessaryAndLogin(teamCredentials);
    cy.visit('/login');
  });

  it('Navigates to team board after successful login', () => {
    cy.get('#teamNameInput').type(teamCredentials.teamName);
    cy.get('#teamPasswordInput').type(teamCredentials.password);
    cy.get('#signInButton').click();
    cy.url().should(
      'eq',
      Cypress.config().baseUrl + teamBoardUrl(teamCredentials.teamId)
    );
  });
});
