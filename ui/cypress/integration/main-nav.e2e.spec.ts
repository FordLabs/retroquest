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

import { getArchivesPagePathWithTeamId, getRadiatorPagePathWithTeamId } from '../../src/react/routes/RouteConstants';
import { getTeamCredentials } from '../support/helpers';

describe('Main Nav', () => {
  const teamCredentials = getTeamCredentials();
  const teamId = teamCredentials.teamId;

  beforeEach(() => {
    cy.createTeamAndLogin(teamCredentials);
  });

  it('Nav items should direct to correct pages', () => {
    cy.shouldBeOnRetroPage(teamId);

    cy.findByText('Archives').click();
    shouldBeOnArchivesPage(teamId);

    cy.findByText('Radiator').click();
    shouldBeOnRadiatorPage(teamId);

    cy.findByText('Retro').click();
    cy.shouldBeOnRetroPage(teamId);
  });
});

function shouldBeOnArchivesPage(teamId: string) {
  cy.log('**Should be on Archives page**');

  const archivesPageUrl = Cypress.config().baseUrl + getArchivesPagePathWithTeamId(teamId);
  cy.url().should('eq', archivesPageUrl);

  cy.findByText('Looks Like A New Team!').should('exist');
}

function shouldBeOnRadiatorPage(teamId: string) {
  cy.log('**Should be on Radiator page**');

  const radiatorPageUrl = Cypress.config().baseUrl + getRadiatorPagePathWithTeamId(teamId);
  cy.url().should('contain', radiatorPageUrl);

  cy.findByText('start autoscroll').should('exist');
}
