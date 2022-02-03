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

/// <reference types="cypress" />

import Topic from '../../src/react/types/Topic';
import { getTeamCredentials } from '../support/helpers';

describe('Retro Page', () => {
  const teamCredentials = getTeamCredentials();

  before(() => {
    cy.createTeamAndLogin(teamCredentials);

    cy.get('[data-testid=retroColumn__action]').as('actionsColumn');
    cy.get('[data-testid=retroColumn__confused]').as('confusedColumn');
    cy.get('[data-testid=retroColumn__unhappy]').as('sadColumn');

    cy.get('[data-testid=retroColumn__happy]').as('happyColumn');
  });

  describe('Retro Board Defaults', () => {
    const green = 'rgb(46, 204, 113)';
    const red = 'rgb(231, 76, 60)';
    const blue = 'rgb(52, 152, 219)';
    const yellow = 'rgb(241, 196, 15)';

    it('Confirm default heading text and colors', () => {
      cy.log('**Should have "Happy" column header in green**');
      cy.findByText('Happy').should('exist').parent().should('have.css', 'background-color', green);

      cy.log('**Should have "Confused" column header in blue**');
      cy.findByText('Confused').should('exist').parent().should('have.css', 'background-color', blue);

      cy.log('**Should have "Sad" column header in red**');
      cy.findByText('Sad').should('exist').parent().should('have.css', 'background-color', red);

      cy.log('**Should have "Action Items" column header in yellow**');
      cy.findByText('Action Items').should('exist').parent().should('have.css', 'background-color', yellow);
    });
  });

  it('Conduct a Retro', () => {
    const happyThoughts = ['Good flow to our work this week', 'Loved our communication', 'Great team dynamic'];
    const confusedThought = "What's going on with zyx";
    const unhappyThought = "I don't like how many meetings we have";
    const actionItems = ['Increase Code Coverage', 'Make our meetings shorter'];

    cy.intercept('PUT', `/api/team/${teamCredentials.teamId}/thought/**/discuss`).as('putMarkThoughtAsDiscussed');

    cy.enterThought(Topic.HAPPY, happyThoughts[0]);
    confirmNumberOfThoughtsInColumn(Topic.HAPPY, 1);

    cy.enterThought(Topic.HAPPY, happyThoughts[1]);
    confirmNumberOfThoughtsInColumn(Topic.HAPPY, 2);

    cy.enterThought(Topic.HAPPY, happyThoughts[2]);
    confirmNumberOfThoughtsInColumn(Topic.HAPPY, 3);

    cy.enterThought(Topic.CONFUSED, confusedThought);
    confirmNumberOfThoughtsInColumn(Topic.CONFUSED, 1);

    cy.enterThought(Topic.UNHAPPY, unhappyThought);
    confirmNumberOfThoughtsInColumn(Topic.UNHAPPY, 1);

    enterActionItem(actionItems[0]);
    confirmNumberOfActionItemsInColumn(1);
    enterActionItem(actionItems[1]);
    confirmNumberOfActionItemsInColumn(2);

    cy.get('@happyColumn').find(`[data-testid=retroItem]`).as('happyColumnItems');

    shouldStarFirstItemInHappyColumn(1);
    shouldStarFirstItemInHappyColumn(2);

    shouldMarkThoughtAsDiscussed(1);

    deleteHappyThought(1);

    confirmNumberOfThoughtsInColumn(Topic.HAPPY, 3);
  });
});

function enterActionItem(actionItem: string) {
  cy.log('**Entering an action item**');
  cy.get('@actionsColumn').find('input[placeholder="Enter an Action Item"]').type(`${actionItem}{enter}`);
}

function shouldStarFirstItemInHappyColumn(expectedStarCount: number) {
  cy.log(`**Starring first happy thought**`);
  const starCountSelector = '[data-testid=retroItem-upvote]';
  cy.get(`@happyColumnItems`).first().find(starCountSelector).click();
  cy.log('**The first thought in the happy column should have two stars**');
  cy.get('@happyColumnItems').first().find(starCountSelector).should('have.contain', expectedStarCount);
}

function shouldMarkThoughtAsDiscussed(thoughtIndex: number) {
  cy.get('@happyColumnItems').last().should('not.have.class', 'completed');

  cy.log(`**Marking happy thought at index ${thoughtIndex} as discussed**`);
  cy.get(`@happyColumnItems`).eq(thoughtIndex).find('[data-testid=completeButton]').click();

  cy.wait('@putMarkThoughtAsDiscussed');

  shouldConfirmDiscussedThoughtMovedToBottomOfList();
}

function shouldConfirmDiscussedThoughtMovedToBottomOfList() {
  cy.log('**The last thought in the happy column should be discussed**');
  cy.get('[data-testid=retroColumn__happy]')
    .find(`[data-testid=retroItem]`)
    .should('have.length', 3)
    .last()
    .should('have.class', 'completed');
}

function deleteHappyThought(thoughtIndex: number) {
  cy.log(`**Deleting happy thought at index ${thoughtIndex}**`);
  cy.get(`@happyColumnItems`).eq(thoughtIndex).find(`[data-testid=deleteButton]`).click();
  cy.get('[data-testid=deletionOverlay]').contains('yes').click();
}

function confirmNumberOfThoughtsInColumn(topic: Topic, expectedCount: number): void {
  cy.log(`**There should be ${expectedCount} thoughts in ${topic} column**`);
  cy.get(`[data-testid=retroColumn__${topic}]`).find('[data-testid=retroItem]').should('have.length', expectedCount);
}

function confirmNumberOfActionItemsInColumn(expectedCount: number): void {
  cy.log(`**There should be ${expectedCount} action items**`);
  cy.get('[data-testid=retroColumn__action]').find('[data-testid=actionItem]').should('have.length', expectedCount);
}
