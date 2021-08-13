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

import { createTeamIfNecessaryAndLogin, TeamCredentials } from '../util/utils';

describe('Conduct Retro', () => {
  const teamCredentials = {
    teamName: 'Test Conduct Retro',
    teamId: 'test-conduct-retro',
    password: 'Retro1234',
    jwt: '',
  } as TeamCredentials;

  function enterThought(columnClass: string, thought: string) {
    cy.get(`div.${columnClass}.rq-thought-column-header`)
      .find('input[placeholder="Enter A Thought"]')
      .type(`${thought}{enter}`);
  }

  function enterActionItems(actionItem: string) {
    cy.get(`rq-actions-column`)
      .find('input[placeholder="Enter an Action Item"]')
      .type(`${actionItem}{enter}`);
  }

  function clearBoard() {
    // cy.get() will hang forever if the query is empty
    enterThought('happy', 'first thought');
    enterActionItems('first action item');

    cy.get(`rq-thoughts-column rq-task`)
      .each((input) => {
        deleteCard(input);
      })
      .then(() => {
        cy.get(`rq-actions-column rq-action-item-task`).each((actionItem) => {
          deleteCard(actionItem);
        });
      });
  }

  function deleteCard(card) {
    card.find(`div.container.delete-container`).click();
    card
      .find(
        `rq-deletion-overlay.ng-star-inserted div.button-container rq-button.delete-accept-button.primary`
      )
      .click();
  }

  function starThought(columnClass: string, thought: string) {
    cy.get(`rq-thoughts-column rq-task.${columnClass}`).each((input) => {
      if (thought === input.find('textarea').val()) {
        input.find('div.star-count-container').click();
      }
    });
  }

  function thoughtDiscussed(columnClass: string, thought: string) {
    cy.get(`rq-thoughts-column rq-task.${columnClass}`).each((input) => {
      if (thought === input.find('textarea').val()) {
        input.find('div.complete-container').click();
      }
    });
  }

  function deleteThought(columnClass: string, thought: string) {
    cy.get(`rq-thoughts-column rq-task.${columnClass}`).each((input) => {
      if (thought === input.find('textarea').val()) {
        deleteCard(input);
      }
    });
  }

  function confirmNumberOfThoughtsInColumn(
    columnClass: string,
    expectedCount: number
  ): void {
    cy.get(`rq-thoughts-column rq-task.${columnClass} textarea`).should(
      'have.length',
      expectedCount
    );
  }

  before(() => {
    cy.visit('/create');
    createTeamIfNecessaryAndLogin(teamCredentials);

    clearBoard();

    enterThought('happy', 'Good flow to our work this week');
    enterThought('happy', 'Switching to e2e was a good idea');
    enterThought(
      'happy',
      `I'm a little uneasy about sharing this with the team`
    );
    enterThought(
      'confused',
      'How do I prevent end to end testing from being flaky?'
    );
    enterThought('unhappy', 'I wish end to end tests were faster');
    enterActionItems('Increase Code Coverage');
    enterActionItems('Speed Up Tests');

    starThought('happy', 'Good flow to our work this week');
    starThought('happy', 'Good flow to our work this week');

    thoughtDiscussed('happy', 'Switching to e2e was a good idea');

    deleteThought(
      'happy',
      `I'm a little uneasy about sharing this with the team`
    );
  });

  after(() => {
    clearBoard();
  });

  describe('Happy Column', () => {
    it('There are two thoughts in happy column', () => {
      confirmNumberOfThoughtsInColumn('happy', 2);
    });
    it('The first thought has two stars', () => {
      cy.get(`rq-thoughts-column rq-task.happy`).each((input) => {
        if (
          'Good flow to our work this week' === input.find('textarea').val()
        ) {
          expect(input.find('div.star-count')[0].innerText.trim()).toEqual('2');
        }
      });
    });
    it('The second thought was discussed', () => {
      cy.get(`rq-thoughts-column rq-task.happy`).each((input) => {
        if (
          'Switching to e2e was a good idea' === input.find('textarea').val()
        ) {
          expect(
            input.find('div.complete-container div.checkbox.completed-task')
              .length
          ).toEqual(1);
        }
      });
    });
  });
  describe('Other Columns', () => {
    it('There is one thought in the confused column', () => {
      confirmNumberOfThoughtsInColumn('confused', 1);
    });
    it('There is one thought in the sad column', () => {
      confirmNumberOfThoughtsInColumn('sad', 1);
    });
    it('There are two action items', () => {
      cy.get(`rq-actions-column rq-action-item-task`).should('have.length', 2);
    });
  });
});
