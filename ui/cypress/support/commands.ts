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

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
import { addMatchImageSnapshotCommand } from '@simonsmith/cypress-image-snapshot/command';

import '@testing-library/cypress/add-commands';

import { getRetroPagePathWithTeamId } from '../../src/RouteConstants';
import {
	LOGIN_API_PATH,
	TEAM_API_PATH,
} from '../../src/Services/Api/ApiConstants';

import TeamCredentials from './types/teamCredentials';
import Topic from './types/Topic';
import VisitOptions = Cypress.VisitOptions;

addMatchImageSnapshotCommand({
	blackout: ['#retro-page-team-name'],
});

Cypress.Commands.add(
	'createTeam',
	({ teamName, password, email }: TeamCredentials) => {
		cy.log('**Creating Team via api**');
		cy.request({
			url: TEAM_API_PATH,
			failOnStatusCode: false,
			method: 'POST',
			body: {
				name: teamName,
				password,
				email,
			},
		});
	}
);

Cypress.Commands.add('login', (teamCredentials: TeamCredentials) => {
	cy.log('**Logging in via api**');
	cy.request({
		url: LOGIN_API_PATH,
		failOnStatusCode: false,
		method: 'POST',
		body: {
			name: teamCredentials.teamName,
			password: teamCredentials.password,
		},
	}).then((response) => {
		if (response.status === 200) {
			const accessToken = response.body as string;
			cy.setCookie('token', accessToken);
		} else {
			cy.log('**Login via api failed with status code: **' + response.status);
		}
	});
});

Cypress.Commands.add(
	'createTeamAndLogin',
	(teamCredentials: TeamCredentials, visitOptions?: Partial<VisitOptions>) => {
		cy.createTeam(teamCredentials).then(() => {
			cy.login(teamCredentials).then(() => {
				const retroPagePath = getRetroPagePathWithTeamId(
					teamCredentials.teamId
				);
				cy.visit(retroPagePath, visitOptions);
				cy.contains(teamCredentials.teamName).should('exist');
				cy.title().should('eq', `${teamCredentials.teamName} | RetroQuest`);
			});
		});
	}
);

Cypress.Commands.add('enterThought', (topic: Topic, thought: string) => {
	cy.log(`**Entering a ${topic} thought**`);
	cy.get(`[data-testid=retroColumn__${topic}]`)
		.findByPlaceholderText('Enter a Thought')
		.type(`${thought}{enter}`);
});

Cypress.Commands.add('enterActionItem', (actionItemTask: string) => {
	cy.log('**Entering an action item**');
	cy.get(`[data-testid=retroColumn__action]`)
		.findByPlaceholderText('Enter an Action Item')
		.type(`${actionItemTask}{enter}`);
});

Cypress.Commands.add('getActionItemByTask', (actionItemTask: string) => {
	cy.contains(actionItemTask).closest(`[data-testid=actionItem]`);
});

Cypress.Commands.add(
	'confirmNumberOfThoughtsInColumn',
	(topic: Topic, expectedCount: number) => {
		cy.log(`**There should be ${expectedCount} thoughts in ${topic} column**`);
		cy.get(`[data-testid=retroColumn__${topic}]`)
			.find('[data-testid=retroItem]')
			.should('have.length', expectedCount);
	}
);

Cypress.Commands.add(
	'confirmNumberOfActionItemsInColumn',
	(expectedCount: number) => {
		cy.log(`**There should be ${expectedCount} action items**`);
		cy.get('[data-testid=retroColumn__action]')
			.find('[data-testid=actionItem]')
			.should('have.length', expectedCount);
	}
);

Cypress.Commands.add('shouldBeOnRetroPage', (teamId: string) => {
	cy.log('**Should be on retro page**');
	cy.url().should(
		'eq',
		Cypress.config().baseUrl + getRetroPagePathWithTeamId(teamId)
	);
	cy.findByText('Happy').should('exist');
	cy.findByText('Confused').should('exist');
	cy.findByText('Sad').should('exist');
});

Cypress.Commands.add('shouldCreateActionItems', (actionItems: string[]) => {
	actionItems.forEach((actionString, index) => {
		cy.enterActionItem(actionString);

		cy.confirmNumberOfActionItemsInColumn(index + 1);

		const splitActionString = actionString.split('@');
		const action = splitActionString[0].trim();
		const assignedTo = splitActionString[1];

		cy.findByText(action).should('exist');
		cy.findByDisplayValue(assignedTo).should('exist');
	});
});

Cypress.Commands.add('switchToDarkMode', () => {
	window.localStorage.setItem('theme', 'dark-theme');
	cy.reload();
});

Cypress.Commands.add('switchToLightMode', () => {
	window.localStorage.setItem('theme', 'light-theme');
	cy.reload();
});
