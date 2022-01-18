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

describe('Create Page', () => {
  const teamName = 'Test Login ' + Math.random().toString().replace('.', '');
  const teamId = teamName.toLowerCase().replace(/ /g, '-');
  const teamCredentials = {
    teamName,
    teamId,
    password: 'Login1234',
    jwt: '',
  } as TeamCredentials;

  it('Create a new team and go to retro page', () => {
    cy.visit('/create');
    cy.contains('Create a new Team!').should('exist');
    cy.log('**Create a team using the create team form**');
    cy.get('[data-testid=teamNameInput]').type(teamCredentials.teamName);
    cy.get('[data-testid=passwordInput]').type(teamCredentials.password);
    cy.get('[data-testid=confirmPasswordInput]').type(teamCredentials.password);
    cy.get('[data-testid=formSubmitButton]').click();

    cy.log(teamCredentials.teamId);
    cy.url().should('eq', Cypress.config().baseUrl + '/team/' + teamCredentials.teamId);
    cy.findByText('Happy');
    cy.findByText('Confused');
    cy.findByText('Sad');
  });
});
