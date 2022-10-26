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

import { getArchivesPagePathWithTeamId } from '../../src/RouteConstants';
import { Column } from '../../src/Types/Column';
import { getTeamCredentials } from '../support/helpers';
import TeamCredentials from '../support/types/teamCredentials';
import { ThoughtTopic } from '../support/types/Topic';
import Chainable = Cypress.Chainable;

describe('Archivist Journey', () => {
	const teamCredentials = getTeamCredentials();

	before(() => {
		cy.createTeamAndLogin(teamCredentials);

		createAndArchiveBoard(teamCredentials, 3);
		createAndArchiveBoard(teamCredentials, 1);
		createAndArchiveBoard(teamCredentials, 4);
	});

	it('Thought Archives ', () => {
		cy.findByText('Archives').click();
		shouldBeOnArchivesPage(teamCredentials.teamId);

		cy.findAllByText('View').should('have.length', 3).eq(0).click();
		cy.findByText('message1').should('exist');
		cy.findByText('message2').should('exist');
		cy.findByText('message3').should('exist');
		cy.findByText('message4').should('exist');

		cy.findByText('Thoughts').click();
		shouldBeOnArchivesPage(teamCredentials.teamId);

		cy.findByText('Date').click();

		cy.findAllByText('Delete').should('have.length', 3).eq(0).click();

		cy.findByText('Yes, Delete').click();

		cy.findAllByText('Delete').should('have.length', 2);
	});

	it('Action Item Archives', () => {
		cy.findByText('Archives').click();
		shouldBeOnArchivesPage(teamCredentials.teamId);

		cy.findByText('Action Items').click();
		cy.findByText('Action Item Archives').should('exist');
		cy.findAllByText('action to take').should('have.length', 3);
	});

	it('Download CSV Button', () => {
		cy.findByText('Retro').click();
		cy.shouldBeOnRetroPage(teamCredentials.teamId);

		cy.findByText('Download CSV').as('downloadCSVButton').click();

		const downloadsFolder = Cypress.config('downloadsFolder');
		const downloadedFilename = join(
			downloadsFolder,
			`${teamCredentials.teamId}-board.csv`
		);

		cy.readFile(downloadedFilename, 'binary', { timeout: 5000 })
			.should((buffer) => expect(buffer.length).to.be.gt(40))
			.should('eq', 'Column,Message,Likes,Completed,Assigned To\r\n');
	});
});

function shouldBeOnArchivesPage(teamId: string) {
	cy.log('**Should be on Archives page**');

	const archivesPageUrl =
		Cypress.config().baseUrl + getArchivesPagePathWithTeamId(teamId);
	cy.url().should('eq', archivesPageUrl);

	cy.findByText('Thought Archives').should('exist');
}

function getColumnsForTeam(teamId: string): Chainable<Column[]> {
	return cy.getCookie('token').then((cookie) => {
		return cy
			.request({
				url: `/api/team/${teamId}/columns`,
				method: 'GET',
				headers: { Authorization: 'Bearer ' + cookie.value },
			})
			.then((response) => response.body as Column[]);
	});
}

function addThoughtToTeam(
	teamId: string,
	message: string,
	hearts: number,
	discussed: boolean,
	topic: ThoughtTopic,
	columnId: number
) {
	cy.getCookie('token').then((cookie) => {
		cy.request({
			url: `/api/team/${teamId}/thought`,
			failOnStatusCode: false,
			method: 'POST',
			headers: { Authorization: 'Bearer ' + cookie.value },
			body: {
				message,
				hearts,
				discussed,
				topic,
				columnId,
			},
		});
	});
}

function addCompletedActionItemToTeam(
	teamId: string,
	task: string,
	assignee: string
) {
	cy.getCookie('token').then((cookie) => {
		cy.request({
			url: `/api/team/${teamId}/action-item`,
			method: 'POST',
			headers: { Authorization: 'Bearer ' + cookie.value },
			body: {
				task,
				completed: true,
				assignee,
				dateCreated: new Date(),
				archived: true,
			},
		});
	});
}

function archiveBoard(teamId: string) {
	cy.getCookie('token').then((cookie) => {
		cy.request({
			url: `/api/team/${teamId}/end-retro`,
			method: 'PUT',
			headers: { Authorization: 'Bearer ' + cookie.value },
			body: {},
		});
	});
}

function createAndArchiveBoard(
	teamCredentials: TeamCredentials,
	thoughtCount: number
) {
	getColumnsForTeam(teamCredentials.teamId).then((columns) => {
		if (thoughtCount >= 1)
			addThoughtToTeam(
				teamCredentials.teamId,
				'message1',
				0,
				false,
				columns[0].topic,
				columns[0].id
			);

		if (thoughtCount >= 2)
			addThoughtToTeam(
				teamCredentials.teamId,
				'message2',
				1,
				false,
				columns[0].topic,
				columns[0].id
			);

		if (thoughtCount >= 3)
			addThoughtToTeam(
				teamCredentials.teamId,
				'message3',
				2,
				true,
				columns[0].topic,
				columns[0].id
			);

		if (thoughtCount >= 4)
			addThoughtToTeam(
				teamCredentials.teamId,
				'message4',
				0,
				false,
				columns[2].topic,
				columns[2].id
			);
	});
	addCompletedActionItemToTeam(teamCredentials.teamId, 'action to take', 'me');
	archiveBoard(teamCredentials.teamId);
}
