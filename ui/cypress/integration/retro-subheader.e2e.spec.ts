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

import { FEEDBACK_API_PATH, getArchiveRetroApiPath } from '../../src/react/services/api/ApiConstants';
import Topic from '../../src/react/types/Topic';
import { getTeamCredentials } from '../support/helpers';

describe('Retro Page Subheader', () => {
  const teamCredentials = getTeamCredentials();

  before(() => {
    cy.createTeamAndLogin(teamCredentials);
  });

  it('Feedback Button', () => {
    const modalText = 'How can we improve RetroQuest?';
    cy.intercept('POST', FEEDBACK_API_PATH).as('postFeedbackEndpoint');

    cy.findByText('Give Feedback').as('giveFeedbackButton').click();

    cy.get('[data-testid=feedbackDialog]').as('modal').should('contain', modalText);

    cy.get('@modal').findByText('Cancel').click();
    ensureModalIsClosed();
    cy.get('@postFeedbackEndpoint').its('response.statusCode').should('eq', null);

    cy.get('@giveFeedbackButton').click();
    ensureModalIsOpen();

    cy.get('@modal').find('[data-testid=feedback-star-5]').click();
    cy.get('@modal').findByLabelText('Comments*').type('Doing great!');
    cy.get('@modal').findByLabelText('Feedback Email').focus().type('a@b.c');

    cy.findByText('Send!').click();
    ensureModalIsClosed();
    cy.get('@postFeedbackEndpoint').its('response.statusCode').should('eq', 201);
  });

  it('Download CSV Button', () => {
    cy.findByText('Download CSV').as('downloadCSVButton').click();

    const downloadsFolder = Cypress.config('downloadsFolder');
    const downloadedFilename = join(downloadsFolder, `${teamCredentials.teamId}-board.csv`);

    cy.readFile(downloadedFilename, 'binary', { timeout: 5000 })
      .should((buffer) => expect(buffer.length).to.be.gt(40))
      .should('eq', 'Column,Message,Likes,Completed,Assigned To\r\n');
  });

  it('Archive Retro Button', () => {
    cy.intercept('PUT', getArchiveRetroApiPath(teamCredentials.teamId)).as('putArchiveRetro');
    cy.get('[data-testid=retroColumn__action]').as('actionsColumn');

    cy.enterThought(Topic.UNHAPPY, 'Unhappy Thought');
    const activeActionItemTask = 'Active Action Item';
    const completedActionItemTask = 'Action item we completed';
    cy.enterActionItem(activeActionItemTask);
    cy.enterActionItem(completedActionItemTask);
    cy.log(`**Marking action item task "${completedActionItemTask}" as completed**`);
    cy.getActionItemByTask(completedActionItemTask).find('[data-testid=columnItem-checkboxButton]').click();

    cy.findByText('Archive Retro').as('archiveRetroButton').click();
    cy.get('[data-testid=archiveRetroDialog]').as('modal');

    ensureModalIsOpen();

    cy.get('@modal').findByText('Nope').click();
    ensureModalIsClosed();
    cy.get('@putArchiveRetro').its('response.statusCode').should('eq', null);

    cy.confirmNumberOfThoughtsInColumn(Topic.UNHAPPY, 1);
    cy.confirmNumberOfActionItemsInColumn(2);

    cy.get('@archiveRetroButton').click();
    ensureModalIsOpen();
    cy.get('@modal').findByText('Yes!').click();
    ensureModalIsClosed();
    cy.get('@putArchiveRetro').its('response.statusCode').should('eq', 200);

    cy.findByDisplayValue(activeActionItemTask).should('exist');
    cy.findByDisplayValue(completedActionItemTask).should('not.exist');
    cy.confirmNumberOfThoughtsInColumn(Topic.UNHAPPY, 0);
    cy.confirmNumberOfActionItemsInColumn(1);
  });
});

const ensureModalIsOpen = () => {
  // cy.get('@modal').should('be.visible'); // works for angular instance
  cy.get('@modal').should('exist'); // works for react instance
};

const ensureModalIsClosed = () => {
  // cy.get('@modal').should('not.be.visible'); // works for angular instance
  cy.get('@modal').should('not.exist'); // works for react instance
};
