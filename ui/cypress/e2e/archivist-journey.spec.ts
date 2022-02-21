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

import { join } from 'path';

import { getArchivesPagePathWithTeamId } from '../../src/react/routes/RouteConstants';
import { getTeamCredentials } from '../support/helpers';

describe('Archivist Journey', () => {
  const teamCredentials = getTeamCredentials();

  before(() => {
    cy.createTeamAndLogin(teamCredentials);

    cy.findByText('Archives').click();
    shouldBeOnArchivesPage(teamCredentials.teamId);
  });

  xit('Archives page functionality', () => {});

  it('Download CSV Button', () => {
    cy.findByText('Retro').click();
    cy.shouldBeOnRetroPage(teamCredentials.teamId);

    cy.findByText('Download CSV').as('downloadCSVButton').click();

    const downloadsFolder = Cypress.config('downloadsFolder');
    const downloadedFilename = join(downloadsFolder, `${teamCredentials.teamId}-board.csv`);

    cy.readFile(downloadedFilename, 'binary', { timeout: 5000 })
      .should((buffer) => expect(buffer.length).to.be.gt(40))
      .should('eq', 'Column,Message,Likes,Completed,Assigned To\r\n');
  });
});

function shouldBeOnArchivesPage(teamId: string) {
  cy.log('**Should be on Archives page**');

  const archivesPageUrl = Cypress.config().baseUrl + getArchivesPagePathWithTeamId(teamId);
  cy.url().should('eq', archivesPageUrl);

  cy.findByText('Looks Like A New Team!').should('exist');
}
