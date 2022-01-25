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

import {
  getArchivesPagePathWithTeamId,
  getLoginPagePathWithTeamId,
  getRadiatorPagePathWithTeamId,
} from '../../src/react/routes/RouteConstants';
import { TOKEN_KEY } from '../../src/react/services/CookieService';
import { getTeamCredentials } from '../support/helpers';

describe('Main Header', () => {
  const teamCredentials = getTeamCredentials();
  const teamId = teamCredentials.teamId;

  beforeEach(() => {
    cy.createTeamAndLogin(teamCredentials);
  });

  it('Nav items', () => {
    cy.shouldBeOnRetroPage(teamId);

    cy.findByText('Archives').click();
    shouldBeOnArchivesPage(teamId);

    cy.findByText('Radiator').click();
    shouldBeOnRadiatorPage(teamId);

    cy.findByText('Retro').click();
    cy.shouldBeOnRetroPage(teamId);
  });

  it('Settings', () => {
    cy.get('[data-testid=settingsButton]').click();
    cy.findByText('Settings').should('exist');

    cy.findByText('Styles').as('stylesTab').should('have.class', 'selected');
    cy.findByText('Account').as('accountTab').should('not.have.class', 'selected');

    cy.log('**User can change theme between light mode and dark mode in "Styles" settings**');
    const darkThemeClass = '.dark-theme';
    cy.get(darkThemeClass).should('not.exist');

    cy.findByAltText('Dark Theme').click();
    cy.get(darkThemeClass).should('exist');

    cy.findByAltText('Light Theme').click();
    cy.get(darkThemeClass).should('not.exist');

    cy.log('**User can log out in "Account" settings**');
    cy.get('@accountTab').click().should('have.class', 'selected');
    cy.get('@stylesTab').should('not.have.class', 'selected');

    cy.findByText('Logout').click();

    shouldBeOnLoginPageWithPrepopulatedTeamName(teamId);

    // @todo update auth service so cookie actually gets deleted not just the value emptied
    // cy.getCookie(TOKEN_KEY).should('not.exist');
    cy.getCookie(TOKEN_KEY).should('have.property', 'value', '');
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
  cy.url().should('eq', radiatorPageUrl);

  cy.findByText('start autoscroll').should('exist');
}

function shouldBeOnLoginPageWithPrepopulatedTeamName(teamId: string) {
  cy.log('**Should be on Login page with pre-populated team name**');

  const LoginPagePathWithTeamId = Cypress.config().baseUrl + getLoginPagePathWithTeamId(teamId);
  cy.url().should('eq', LoginPagePathWithTeamId);

  cy.contains('Sign in to your Team!').should('exist');
}
