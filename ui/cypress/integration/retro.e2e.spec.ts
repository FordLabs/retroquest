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
import Chainable = Cypress.Chainable;

describe('Retro Page', () => {
  const green = 'rgb(46, 204, 113)';
  const red = 'rgb(231, 76, 60)';
  const blue = 'rgb(52, 152, 219)';
  const yellow = 'rgb(241, 196, 15)';

  context('Columns', () => {
    const teamCredentials = getTeamCredentials();

    before(() => {
      cy.createTeamAndLogin(teamCredentials);
    });

    it('Happy', () => {
      cy.log('**Should have "Happy" column header in green**');
      cy.findByText('Happy').should('exist').parent().should('have.css', 'background-color', green);

      cy.get('[data-testid=retroColumn__happy]').as('happyColumn');

      const happyThoughts = ['Good flow to our work this week', 'Loved our communication', 'Great team dynamic'];
      shouldCreateHappyThoughts(happyThoughts);

      const updatedThought = `${happyThoughts[0]} - updated`;
      shouldEditAThought(happyThoughts[0], updatedThought);
      happyThoughts[0] = updatedThought;

      shouldStarHappyThought();

      shouldMarkAndUnmarkThoughtAsDiscussed(happyThoughts[0]);

      shouldDeleteHappyThought(1, 2);

      cy.log('**On page reload all Happy thoughts should still be there**');
      cy.reload();
      cy.confirmNumberOfThoughtsInColumn(Topic.HAPPY, 2);
    });

    it('Confused', () => {
      cy.log('*Should have "Confused" column header in blue*');
      cy.findByText('Confused').should('exist').parent().should('have.css', 'background-color', blue);

      cy.get('[data-testid=retroColumn__confused]').as('confusedColumn');

      const confusedThought = "What's going on with zyx";
      cy.enterThought(Topic.CONFUSED, confusedThought);
      cy.confirmNumberOfThoughtsInColumn(Topic.CONFUSED, 1);

      cy.log('**On page reload all Confused thoughts should still be there**');
      cy.reload();
      cy.confirmNumberOfThoughtsInColumn(Topic.CONFUSED, 1);
    });

    it('Sad', () => {
      cy.log('*Should have "Sad" column header in red*');
      cy.findByText('Sad').should('exist').parent().should('have.css', 'background-color', red);

      cy.get('[data-testid=retroColumn__unhappy]').as('sadColumn');

      const unhappyThought = "I don't like how many meetings we have";
      cy.enterThought(Topic.UNHAPPY, unhappyThought);
      cy.confirmNumberOfThoughtsInColumn(Topic.UNHAPPY, 1);

      cy.log('**On page reload all Sad thoughts should still be there**');
      cy.reload();
      cy.confirmNumberOfThoughtsInColumn(Topic.UNHAPPY, 1);
    });

    it('Action Items', () => {
      cy.log('**Should have "Action Items" column header in yellow**');
      cy.findByText('Action Items').should('exist').parent().should('have.css', 'background-color', yellow);

      cy.get('[data-testid=retroColumn__action]').as('actionsColumn');

      let task1 = 'Increase Code Coverage';
      const assignee1 = 'Bob';
      const task2 = 'Make our meetings shorter';
      const actionItemsToInput = [`${task1} @${assignee1}`, `${task2} @Larry`];
      shouldCreateActionItems(actionItemsToInput);

      shouldEditActionItemTaskAndAssignee(task1, 'by 10%', assignee1, ', Larry');

      task1 += ' by 10%';
      shouldMarkAndUnmarkActionItemAsCompleted(task1);

      shouldDeleteActionItem(task2);

      cy.log('**On page reload all Action Items should still be there**');
      cy.reload();
      cy.confirmNumberOfActionItemsInColumn(1);
    });
  });
});

function shouldCreateActionItems(actionItems: string[]) {
  actionItems.forEach((actionString, index) => {
    cy.enterActionItem(actionString);

    cy.confirmNumberOfActionItemsInColumn(index + 1);

    const splitActionString = actionString.split('@');
    const action = splitActionString[0].trim();
    const assignedTo = splitActionString[1];

    cy.findByDisplayValue(action);
    cy.findByDisplayValue(assignedTo);
  });
}

function shouldEditActionItemTaskAndAssignee(
  currentTask: string,
  appendToTask: string,
  currentAssignee: string,
  appendToAssignee: string
) {
  cy.log(`**Edit Action Item: ${currentTask}**`);
  cy.getActionItemByTask(currentTask).as('actionItemToEdit');

  cy.get('@actionItemToEdit').find('[data-testid=columnItem-editButton]').type(`{rightarrow} ${appendToTask}{enter}`);
  cy.get('@actionItemToEdit').findByDisplayValue(`${currentTask} ${appendToTask}`);

  cy.get('@actionItemToEdit').find('[data-testid=actionItem-assignee]').type(`${appendToAssignee}{enter}`);
  cy.get('@actionItemToEdit').findByDisplayValue(`${currentAssignee}${appendToAssignee}`);
}

function shouldCreateHappyThoughts(happyThoughts: string[]) {
  happyThoughts.forEach((happyThought, index) => {
    cy.enterThought(Topic.HAPPY, happyThought);
    cy.findByDisplayValue(happyThought);
    cy.confirmNumberOfThoughtsInColumn(Topic.HAPPY, index + 1);
  });
}

function shouldEditAThought(currentThought: string, updatedThought: string) {
  cy.log(`**Edit thought: ${currentThought}**`);
  getRetroItemByMessage(currentThought).find('[data-testid=columnItem-editButton]').type(`${updatedThought}{enter}`);
  cy.findByDisplayValue(updatedThought);
}

function shouldStarHappyThought() {
  shouldStarFirstItemInHappyColumn(1);
  shouldStarFirstItemInHappyColumn(2);
}

function shouldDeleteHappyThought(thoughtIndex: number, expectedThoughtsRemaining: number) {
  cy.log(`**Deleting happy thought at index ${thoughtIndex}**`);
  getHappyColumnItems().eq(thoughtIndex).find(`[data-testid=columnItem-deleteButton]`).click();
  cy.get('[data-testid=deletionOverlay]').contains('Yes').click();

  cy.confirmNumberOfThoughtsInColumn(Topic.HAPPY, expectedThoughtsRemaining);
}

function shouldStarFirstItemInHappyColumn(expectedStarCount: number) {
  cy.log(`**Starring first happy thought**`);
  const starCountSelector = '[data-testid=retroItem-upvote]';
  getHappyColumnItems().first().find(starCountSelector).click();
  cy.log('**The first thought in the happy column should have two stars**');
  getHappyColumnItems().first().find(starCountSelector).should('have.contain', expectedStarCount);
}

function shouldMarkAndUnmarkThoughtAsDiscussed(thoughtMessage: string) {
  getHappyColumnItems().last().should('not.have.class', 'completed');

  getRetroItemByMessage(thoughtMessage).find('[data-testid=columnItem-checkboxButton]').as('discussedButton');

  cy.log(`**Mark happy thought "${thoughtMessage}" as discussed**`);
  cy.get(`@discussedButton`).click();

  cy.log('**Thought marked as discussed should move to bottom of the list**');
  getHappyColumnItems().should('have.length', 3).last().should('have.class', 'completed');

  cy.get(`@discussedButton`).click();

  cy.log(`**Unmark happy thought as discussed and move up the list**`);
  getHappyColumnItems().should('have.length', 3).last().should('not.have.class', 'completed');
}

function shouldMarkAndUnmarkActionItemAsCompleted(actionItemTask: string) {
  getActionColumnItems().last().should('not.have.class', 'completed');

  cy.getActionItemByTask(actionItemTask).find('[data-testid=columnItem-checkboxButton]').as('completedButton');

  cy.log(`**Mark action item task "${actionItemTask}" as completed**`);
  cy.get(`@completedButton`).click();

  cy.log('**Completed action item should move to bottom of the list**');
  getActionColumnItems().should('have.length', 2).last().should('have.class', 'completed');

  cy.get(`@completedButton`).click();

  cy.log('**Unmark action item as completed and move up the list**');
  getActionColumnItems().should('have.length', 2).last().should('not.have.class', 'completed');
}

function shouldDeleteActionItem(actionItemTask: string) {
  cy.log(`**Deleting action item ${actionItemTask}**`);
  cy.getActionItemByTask(actionItemTask).find(`[data-testid=columnItem-deleteButton]`).click();
  cy.get('[data-testid=deletionOverlay]').contains('Yes').click();
}

const getHappyColumnItems = () => cy.get('[data-testid=retroColumn__happy]').find(`[data-testid=retroItem]`);
const getActionColumnItems = () => cy.get('[data-testid=retroColumn__action]').find(`[data-testid=actionItem]`);
const getRetroItemByMessage = (message: string): Chainable =>
  cy.findByDisplayValue(message).closest(`[data-testid=retroItem]`);
