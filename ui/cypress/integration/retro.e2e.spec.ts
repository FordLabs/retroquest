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

  const teamCredentials = getTeamCredentials();

  before(() => {
    cy.createTeamAndLogin(teamCredentials);
  });

  it('Happy Column', () => {
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
    confirmNumberOfThoughtsInColumn(Topic.HAPPY, 2);
  });

  it('Confused Column', () => {
    cy.log('*Should have "Confused" column header in blue*');
    cy.findByText('Confused').should('exist').parent().should('have.css', 'background-color', blue);

    cy.get('[data-testid=retroColumn__confused]').as('confusedColumn');

    const confusedThought = "What's going on with zyx";
    cy.enterThought(Topic.CONFUSED, confusedThought);
    confirmNumberOfThoughtsInColumn(Topic.CONFUSED, 1);

    cy.log('**On page reload all Confused thoughts should still be there**');
    cy.reload();
    confirmNumberOfThoughtsInColumn(Topic.CONFUSED, 1);
  });

  it('Sad Column', () => {
    cy.log('*Should have "Sad" column header in red*');
    cy.findByText('Sad').should('exist').parent().should('have.css', 'background-color', red);

    cy.get('[data-testid=retroColumn__unhappy]').as('sadColumn');

    const unhappyThought = "I don't like how many meetings we have";
    cy.enterThought(Topic.UNHAPPY, unhappyThought);
    confirmNumberOfThoughtsInColumn(Topic.UNHAPPY, 1);

    cy.log('**On page reload all Sad thoughts should still be there**');
    cy.reload();
    confirmNumberOfThoughtsInColumn(Topic.UNHAPPY, 1);
  });

  it('Action Item Column', () => {
    cy.log('**Should have "Action Items" column header in yellow**');
    cy.findByText('Action Items').should('exist').parent().should('have.css', 'background-color', yellow);

    cy.get('[data-testid=retroColumn__action]').as('actionsColumn');

    const task = 'Increase Code Coverage';
    const assignee = 'Bob';
    const actionItemsToInput = [`${task} @${assignee}`, 'Make our meetings shorter @Larry'];
    shouldCreateActionItems(actionItemsToInput);

    shouldEditActionItemTaskAndAssignee(task, 'by 10%', assignee, ', Larry');

    cy.log('**On page reload all Action Items should still be there**');
    cy.reload();
    confirmNumberOfActionItemsInColumn(2);
  });
});

function shouldCreateActionItems(actionItems: string[]) {
  actionItems.forEach((actionString, index) => {
    enterActionItem(actionString);

    confirmNumberOfActionItemsInColumn(index + 1);

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
  getActionItemByMessage(currentTask).as('actionItemToEdit');

  cy.get('@actionItemToEdit').find('[data-testid=columnItem-editButton]').type(`{rightarrow} ${appendToTask}{enter}`);
  cy.get('@actionItemToEdit').findByDisplayValue(`${currentTask} ${appendToTask}`);

  cy.get('@actionItemToEdit').find('[data-testid=actionItem-assignee]').type(`${appendToAssignee}{enter}`);
  cy.get('@actionItemToEdit').findByDisplayValue(`${currentAssignee}${appendToAssignee}`);
}

function shouldCreateHappyThoughts(happyThoughts: string[]) {
  happyThoughts.forEach((happyThought, index) => {
    cy.enterThought(Topic.HAPPY, happyThought);
    cy.findByDisplayValue(happyThought);
    confirmNumberOfThoughtsInColumn(Topic.HAPPY, index + 1);
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

function shouldDeleteHappyThought(thoughtIndex: number, expectedThoughtsRemaining) {
  cy.log(`**Deleting happy thought at index ${thoughtIndex}**`);
  getHappyColumnItems().eq(thoughtIndex).find(`[data-testid=columnItem-deleteButton]`).click();
  cy.get('[data-testid=deletionOverlay]').contains('Yes').click();

  confirmNumberOfThoughtsInColumn(Topic.HAPPY, expectedThoughtsRemaining);
}

function enterActionItem(actionItem: string) {
  cy.log('**Entering an action item**');
  cy.get('@actionsColumn').find('input[placeholder="Enter an Action Item"]').type(`${actionItem}{enter}`);
}

function shouldStarFirstItemInHappyColumn(expectedStarCount: number) {
  cy.log(`**Starring first happy thought**`);
  const starCountSelector = '[data-testid=retroItem-upvote]';
  getHappyColumnItems().first().find(starCountSelector).click();
  cy.log('**The first thought in the happy column should have two stars**');
  getHappyColumnItems().first().find(starCountSelector).should('have.contain', expectedStarCount);
}

function shouldMarkAndUnmarkThoughtAsDiscussed(thoughtMessage: string) {
  cy.log('**Test marking thoughts as discussed**');
  getHappyColumnItems().last().should('not.have.class', 'completed');

  cy.log(`**Marking happy thought "${thoughtMessage}" as discussed**`);
  getRetroItemByMessage(thoughtMessage).find('[data-testid=columnItem-checkboxButton]').as('discussedButton');

  cy.get(`@discussedButton`).click();

  cy.log('**Should mark thought as discussed and move to bottom of the list**');
  getHappyColumnItems().should('have.length', 3).last().should('have.class', 'completed');

  cy.get(`@discussedButton`).click();

  cy.log('**Should unmark thought as discussed and move have up the list**');
  getHappyColumnItems().should('have.length', 3).last().should('not.have.class', 'completed');
}

function confirmNumberOfThoughtsInColumn(topic: Topic, expectedCount: number): void {
  cy.log(`**There should be ${expectedCount} thoughts in ${topic} column**`);
  cy.get(`[data-testid=retroColumn__${topic}]`).find('[data-testid=retroItem]').should('have.length', expectedCount);
}

function confirmNumberOfActionItemsInColumn(expectedCount: number): void {
  cy.log(`**There should be ${expectedCount} action items**`);
  cy.get('[data-testid=retroColumn__action]').find('[data-testid=actionItem]').should('have.length', expectedCount);
}

const getHappyColumnItems = () => cy.get('[data-testid=retroColumn__happy]').find(`[data-testid=retroItem]`);
const getRetroItemByMessage = (message: string): Chainable =>
  cy.findByDisplayValue(message).closest(`[data-testid=retroItem]`);
const getActionItemByMessage = (message: string): Chainable =>
  cy.findByDisplayValue(message).closest(`[data-testid=actionItem]`);
