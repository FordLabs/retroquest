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
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as path from 'path';

import { FEEDBACK_API_PATH, getArchiveRetroApiPath } from '../../src/react/services/api/ApiConstants';

describe('Retro Page', () => {
  const green = 'rgb(46, 204, 113)';
  const red = 'rgb(231, 76, 60)';
  const blue = 'rgb(52, 152, 219)';
  const yellow = 'rgb(241, 196, 15)';

  context('Subnav', () => {
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
      cy.get('@modal').should('not.be.visible');
      cy.get('@postFeedbackEndpoint').its('response.statusCode').should('eq', null);

      cy.get('@giveFeedbackButton').click();

      cy.get('@modal').find('[data-testid=feedback-star-5]').click();
      cy.get('@modal').findByLabelText('Comments*').type('Doing great!');
      cy.get('@modal').findByLabelText('Feedback Email').type('a@b.c');

      cy.findByText('Send!').click();
      cy.get('@modal').should('not.be.visible');
      cy.get('@postFeedbackEndpoint').its('response.statusCode').should('eq', 201);
    });

    it('Download CSV Button', () => {
      cy.findByText('Download CSV').as('downloadCSVButton').click();

      const downloadsFolder = Cypress.config('downloadsFolder');
      const downloadedFilename = path.join(downloadsFolder, `${teamCredentials.teamId}-board.csv`);

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
      enterActionItem(activeActionItemTask);
      enterActionItem(completedActionItemTask);
      cy.log(`**Marking action item task "${completedActionItemTask}" as completed**`);
      getActionItemByMessage(completedActionItemTask).find('[data-testid=columnItem-checkboxButton]').click();

      cy.findByText('Archive Retro').as('archiveRetroButton').click();

      cy.get('[data-testid=archiveRetroDialog]').as('modal');
      cy.get('@modal').findByText('Nope').click();
      cy.get('@modal').should('not.be.visible');
      cy.get('@putArchiveRetro').its('response.statusCode').should('eq', null);

      confirmNumberOfThoughtsInColumn(Topic.UNHAPPY, 1);
      confirmNumberOfActionItemsInColumn(2);

      cy.get('@archiveRetroButton').click();
      cy.get('@modal').findByText('Yes!').click();
      cy.get('@putArchiveRetro').its('response.statusCode').should('eq', 200);

      cy.findByDisplayValue(activeActionItemTask).should('exist');
      cy.findByDisplayValue(completedActionItemTask).should('not.exist');
      confirmNumberOfThoughtsInColumn(Topic.UNHAPPY, 0);
      confirmNumberOfActionItemsInColumn(1);
    });
  });

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
      confirmNumberOfThoughtsInColumn(Topic.HAPPY, 2);
    });

    it('Confused', () => {
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

    it('Sad', () => {
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

    it.only('Action Items', () => {
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
      confirmNumberOfActionItemsInColumn(1);
    });
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

function shouldDeleteHappyThought(thoughtIndex: number, expectedThoughtsRemaining: number) {
  cy.log(`**Deleting happy thought at index ${thoughtIndex}**`);
  getHappyColumnItems().eq(thoughtIndex).find(`[data-testid=columnItem-deleteButton]`).click();
  cy.get('[data-testid=deletionOverlay]').contains('Yes').click();

  confirmNumberOfThoughtsInColumn(Topic.HAPPY, expectedThoughtsRemaining);
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

function confirmNumberOfThoughtsInColumn(topic: Topic, expectedCount: number): void {
  cy.log(`**There should be ${expectedCount} thoughts in ${topic} column**`);
  cy.get(`[data-testid=retroColumn__${topic}]`).find('[data-testid=retroItem]').should('have.length', expectedCount);
}

function enterActionItem(actionItem: string) {
  cy.log('**Entering an action item**');
  cy.get('@actionsColumn').find('input[placeholder="Enter an Action Item"]').type(`${actionItem}{enter}`);
}

function shouldMarkAndUnmarkActionItemAsCompleted(actionItemTask: string) {
  getActionColumnItems().last().should('not.have.class', 'completed');

  getActionItemByMessage(actionItemTask).find('[data-testid=columnItem-checkboxButton]').as('completedButton');

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
  getActionItemByMessage(actionItemTask).find(`[data-testid=columnItem-deleteButton]`).click();
  cy.get('[data-testid=deletionOverlay]').contains('Yes').click();
}

function confirmNumberOfActionItemsInColumn(expectedCount: number): void {
  cy.log(`**There should be ${expectedCount} action items**`);
  cy.get('[data-testid=retroColumn__action]').find('[data-testid=actionItem]').should('have.length', expectedCount);
}

const getHappyColumnItems = () => cy.get('[data-testid=retroColumn__happy]').find(`[data-testid=retroItem]`);
const getActionColumnItems = () => cy.get('[data-testid=retroColumn__action]').find(`[data-testid=actionItem]`);
const getRetroItemByMessage = (message: string): Chainable =>
  cy.findByDisplayValue(message).closest(`[data-testid=retroItem]`);
const getActionItemByMessage = (message: string): Chainable =>
  cy.findByDisplayValue(message).closest(`[data-testid=actionItem]`);
