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

describe('Create Page', () => {
  const teamCredentials = {
    teamName: 'Create Board Tests',
    teamId: 'create-board-tests',
    password: 'Test1234',
    jwt: '',
  } as TeamCredentials;

  const teamName = 'Create Board Tests';
  const teamId = 'create-board-tests';
  const password = 'Test1234';

  describe('navigation', () => {
    it('should be able to navigate to /create', () => {
      cy.visit('/create');
      cy.url().should('eq', 'http://localhost:4200/create');
    });

    it('should be able to navigate to /login from link', () => {
      cy.visit('/create');
      cy.get('#loginBoard').click();
      cy.url().should('eq', 'http://localhost:4200/login');
    });
  });

  describe('default board creation', () => {
    before(() => {
      createTeamIfNecessaryAndLogin(teamCredentials); //have this function somehow return JWT
      console.log(teamCredentials);
    });

    describe('Sections', () => {
      describe('Happy Section', () => {
        it('Has a Happy Column Header', () => {
          cy.findByText('Happy');
        });

        it('The Happy Column Header is Green', () => {
          cy.findByText('Happy').then((happyElement) => {
            expect(
              window.getComputedStyle(happyElement.parent()[0]).backgroundColor
            ).toEqual('rgb(46, 204, 113)');
          });
        });
      });

      describe('Confused Section', () => {
        it('Has a Happy Confused Header', () => {
          cy.findByText('Confused');
        });

        it('The Confused Column Header is Green', () => {
          cy.findByText('Confused').then((happyElement) => {
            expect(
              window.getComputedStyle(happyElement.parent()[0]).backgroundColor
            ).toEqual('rgb(52, 152, 219)');
          });
        });
      });

      describe('Sad Section', () => {
        it('Has a Sad Sad Header', () => {
          cy.findByText('Sad');
        });

        it('The Sad Column Header is Green', () => {
          cy.findByText('Sad').then((happyElement) => {
            expect(
              window.getComputedStyle(happyElement.parent()[0]).backgroundColor
            ).toEqual('rgb(231, 76, 60)');
          });
        });
      });

      describe('Action Items Section', () => {
        it('Has a Action Items Column Header', () => {
          cy.findByText('Action Items');
        });

        it('The Action Items Column Header is Green', () => {
          cy.findByText('Action Items').then((happyElement) => {
            expect(
              window.getComputedStyle(happyElement.parent()[0]).backgroundColor
            ).toEqual('rgb(241, 196, 15)');
          });
        });
      });
    });
  });
});
