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

import { getRetroPagePathWithTeamId } from '../../src/RouteConstants';
import {
	getArchiveRetroApiPath,
	LOGIN_API_PATH,
} from '../../src/Services/Api/ApiConstants';
import { getTeamCredentials } from '../support/helpers';
import Topic from '../support/types/Topic';
import Chainable = Cypress.Chainable;

describe('Retro Facilitator Journey', () => {
	let teamCredentials;
	const editButtonSelector = '[data-testid=editButton]';

	beforeEach(() => {
		teamCredentials = getTeamCredentials();
	});

	it('Rename columns titles', () => {
		cy.createTeamAndLogin(teamCredentials);
		cy.intercept(
			'PUT',
			`/api/team/${teamCredentials.teamId}/column/*/title`
		).as('columnTitleChangeApiCall');

		getColumnHeaderByTopic(Topic.HAPPY)
			.as('happyColumnHeader')
			.find('[data-testid=columnHeader-editTitleButton]')
			.click();

		const newHappyTitle = 'Super Happy!';
		cy.get('@happyColumnHeader')
			.findByDisplayValue('Happy')
			.type(`${newHappyTitle}`);
		cy.get('body').click();
		cy.wait('@columnTitleChangeApiCall');
		cy.findByText(newHappyTitle);

		getColumnHeaderByTopic(Topic.CONFUSED)
			.as('confusedColumnHeader')
			.find('[data-testid=columnHeader-editTitleButton]')
			.click();

		const newConfusedTitle = 'Very Confused';
		cy.get('@confusedColumnHeader')
			.findByDisplayValue('Confused')
			.type(`${newConfusedTitle}`);
		cy.get('body').click();
		cy.wait('@columnTitleChangeApiCall');
		cy.findByText(newConfusedTitle);

		getColumnHeaderByTopic(Topic.UNHAPPY)
			.as('sadColumnHeader')
			.find('[data-testid=columnHeader-editTitleButton]')
			.click();

		const newSadTitle = 'Sadness';
		cy.get('@sadColumnHeader')
			.findByDisplayValue('Sad')
			.type(`${newSadTitle} :({enter}`);
		cy.wait('@columnTitleChangeApiCall');
		cy.findByText(newSadTitle + ' 😥');

		getColumnHeaderByTopic(Topic.ACTION)
			.find('[data-testid=columnHeader-editTitleButton]')
			.should('not.exist');
	});

	it('Sort thoughts', () => {
		cy.createTeamAndLogin(teamCredentials);
		const thought2 = 'Thought Two';
		cy.enterThought(Topic.HAPPY, 'Thought One');
		cy.enterThought(Topic.HAPPY, thought2);
		cy.enterThought(Topic.HAPPY, 'Thought Three');
		getRetroItemByText(thought2).find('[data-testid=retroItem-upvote]').click();

		getHappyColumnItems().as('happyColumnItems').should('have.length', 3);

		cy.get('@happyColumnItems').eq(0).should('contain', '0');
		cy.get('@happyColumnItems').eq(1).should('contain', '1');
		cy.get('@happyColumnItems').eq(2).should('contain', '0');

		cy.log('**Sort: Highest voted thoughts at the top of the list**');
		getColumnHeaderByTopic(Topic.HAPPY)
			.find('[data-testid=columnHeader-sortButton]')
			.click();

		getHappyColumnItems().as('happyColumnItems').eq(0).should('contain', '1');
		cy.get('@happyColumnItems').eq(1).should('contain', '0');
		cy.get('@happyColumnItems').eq(2).should('contain', '0');

		cy.log('**Unsort: Thoughts return to original positions**');
		getColumnHeaderByTopic(Topic.HAPPY)
			.find('[data-testid=columnHeader-sortButton]')
			.click();

		getHappyColumnItems().as('happyColumnItems').eq(0).should('contain', '0');
		cy.get('@happyColumnItems').eq(1).should('contain', '1');
		cy.get('@happyColumnItems').eq(2).should('contain', '0');
	});

	it('Display thought in expanded mode', () => {
		cy.createTeamAndLogin(teamCredentials);
		const thought = 'This is a good week';
		cy.enterThought(Topic.HAPPY, thought);
		cy.log(`**Expand thought: ${thought}**`);
		getRetroItemByText(thought).click();
		getRetroActionModal().should('exist');
	});

	it('Add action item from expanded mode', () => {
		cy.createTeamAndLogin(teamCredentials);
		const happyThought = 'This is a good week';
		cy.enterThought(Topic.HAPPY, happyThought);

		getRetroItemByText(happyThought).click();

		getRetroActionModal().as('retroItemModal');
		cy.get('@retroItemModal').findByText(happyThought).should('exist');
		cy.get('@retroItemModal').findByText('Add Action Item').click();

		const actionItemTask = 'Handle by Friday';
		cy.get('@retroItemModal')
			.find('[data-testid="textareaField"]')
			.type(actionItemTask);
		const actionItemAssignee = 'Harry, and Corey';
		cy.get('@retroItemModal')
			.find('[data-testid="assigneeInput"]')
			.type(actionItemAssignee, { force: true });

		cy.findByText('Create!').click();

		cy.get('@retroItemModal').should('not.be.visible');

		cy.log('**Thought should be marked as discussed**');
		getHappyColumnItems().should('have.length', 1);
		getRetroItemByText(happyThought)
			.find(editButtonSelector)
			.should('be.disabled');

		cy.log('**Action Item should exist in action items column**');
		getActionColumnItems().findByText(actionItemTask).should('exist');
		getActionColumnItems()
			.findByDisplayValue(actionItemAssignee)
			.should('exist');
	});

	it('Mark thought as discussed (default and expanded)', () => {
		cy.createTeamAndLogin(teamCredentials);
		cy.intercept(
			'PUT',
			`/api/team/${teamCredentials.teamId}/thought/*/discuss`
		).as('updateDiscussedState');

		const happyThought = 'This is a good week';
		cy.enterThought(Topic.HAPPY, happyThought);
		cy.enterThought(Topic.HAPPY, 'Another positive note');
		getHappyColumnItems()
			.last()
			.find(editButtonSelector)
			.should('not.be.disabled');

		cy.log(`**Mark happy thought "${happyThought}" as discussed**`);
		getDiscussedButton(happyThought).click();
		cy.wait('@updateDiscussedState');

		cy.log('**Thought marked as discussed should move to bottom of the list**');
		getHappyColumnItems().should('have.length', 2);
		getDiscussedThought().find(editButtonSelector).should('be.disabled');
		getHappyColumnItems().last().find(editButtonSelector).should('be.disabled');

		getDiscussedButton(happyThought).click();
		cy.wait('@updateDiscussedState');

		cy.log(`**Unmark happy thought as discussed and move up the list**`);
		getHappyColumnItems().should('have.length', 2);
		getHappyColumnItems()
			.last()
			.find(editButtonSelector)
			.should('not.be.disabled');

		cy.log(`**Mark happy thought as discussed from the thought modal**`);
		getRetroItemByText(happyThought).click();
		getRetroActionModal().find('[data-testid=checkboxButton]').first().click();
		cy.wait('@updateDiscussedState');

		cy.log(
			'**Thought marked as discussed from modal should move to bottom of the list**'
		);
		getHappyColumnItems().should('have.length', 2);
		getHappyColumnItems().last().find(editButtonSelector).should('be.disabled');
	});

	it('Action item actions (create, edit, delete, mark as complete)', () => {
		cy.createTeamAndLogin(teamCredentials);
		cy.intercept(
			'PUT',
			`/api/team/${teamCredentials.teamId}/action-item/*/completed`
		).as('updateCompletedState');
		cy.intercept(
			'PUT',
			`/api/team/${teamCredentials.teamId}/action-item/*/task`
		).as('updateTask');

		cy.log('**Should have "Action Items" column header in yellow**');
		const yellow = 'rgb(241, 196, 15)';
		cy.findByText('Action Items')
			.should('exist')
			.parent()
			.should('have.css', 'background-color', yellow);

		cy.get('[data-testid=retroColumn__action]').as('actionsColumn');

		let task1 = 'Increase Code Coverage';
		const assignee1 = 'Bob';
		const task2 = 'Make our meetings shorter';
		const actionItemsToInput = [`${task1} @${assignee1}`, `${task2} @Larry`];
		shouldCreateActionItems(actionItemsToInput);

		shouldEditActionItemTaskAndAssignee(task1, 'by 10%', assignee1, ', Larry');

		task1 += ' by 10%';
		shouldMarkAndUnmarkActionItemAsDiscussed(task1);

		shouldDeleteActionItem(task2);

		cy.log('**On page reload all Action Items should still be there**');
		cy.reload();
		cy.confirmNumberOfActionItemsInColumn(1);
	});

	it('Archive retro', () => {
		cy.createTeamAndLogin(teamCredentials);
		cy.intercept('PUT', getArchiveRetroApiPath(teamCredentials.teamId)).as(
			'putArchiveRetro'
		);
		cy.get('[data-testid=retroColumn__action]').as('actionsColumn');

		cy.enterThought(Topic.UNHAPPY, 'Unhappy Thought');
		const activeActionItemTask = 'Active Action Item';
		const completedActionItemTask = 'Action item we completed';
		cy.enterActionItem(activeActionItemTask);
		cy.enterActionItem(completedActionItemTask);
		cy.log(
			`**Marking action item task "${completedActionItemTask}" as completed**`
		);
		cy.getActionItemByTask(completedActionItemTask)
			.find('[data-testid=checkboxButton]')
			.click();

		cy.findByText('Archive Retro').as('archiveRetroButton').click();
		cy.get('[data-testid=archiveRetroDialog]').as('modal');

		ensureModalIsOpen();

		cy.get('@modal').findByText('Cancel').click();
		ensureModalIsClosed();
		cy.get('@putArchiveRetro').its('response.statusCode').should('eq', null);

		cy.confirmNumberOfThoughtsInColumn(Topic.UNHAPPY, 1);
		cy.confirmNumberOfActionItemsInColumn(2);

		cy.get('@archiveRetroButton').click();
		ensureModalIsOpen();
		cy.get('@modal').findByText('Yes! End Retro.').click();
		ensureModalIsClosed();
		cy.get('@putArchiveRetro').its('response.statusCode').should('eq', 200);

		cy.findByText(activeActionItemTask).should('exist');
		cy.findByText(completedActionItemTask).should('not.exist');
		cy.confirmNumberOfThoughtsInColumn(Topic.UNHAPPY, 0);
		cy.confirmNumberOfActionItemsInColumn(1);
	});

	describe('Settings', () => {
		const primaryEmail = 'primary@mail.com';
		const secondaryEmail = 'secondary@mail.com';

		it('Add two email addresses to team (for old teams that did not add them upon team creation)', () => {
			createTeamWithNoEmailsAndLogin();
			goToAccountSettings();

			cy.findByLabelText('Email Address 1').type(primaryEmail);
			cy.findByLabelText('Second Teammate’s Email (optional)').type(
				secondaryEmail
			);

			shouldSuccessfullyConfirmAndSaveEmailChanges([
				primaryEmail,
				secondaryEmail,
			]);
			cy.contains(primaryEmail).should('exist');
			cy.contains(secondaryEmail).should('exist');
		});

		it('Add one email address to team (for old teams that did not add them upon team creation)', () => {
			createTeamWithNoEmailsAndLogin();
			goToAccountSettings();

			cy.findByLabelText('Email Address 1').type(primaryEmail);

			shouldSuccessfullyConfirmAndSaveEmailChanges([primaryEmail]);
			cy.contains(primaryEmail).should('exist');
			cy.contains(secondaryEmail).should('not.exist');
		});

		it('Start adding two email addresses to team and then cancel action', () => {
			createTeamWithNoEmailsAndLogin();
			goToAccountSettings();

			cy.findByLabelText('Email Address 1').type(primaryEmail);
			cy.findByLabelText('Second Teammate’s Email (optional)').type(
				secondaryEmail
			);

			cy.findByText('Add Email').click();
			cy.findByText('Cancel').click();

			cy.findByLabelText('Email Address 1').should('have.value', primaryEmail);
			cy.findByLabelText('Second Teammate’s Email (optional)').should(
				'have.value',
				secondaryEmail
			);
			cy.findByText('Add Email').should('be.enabled');
		});
	});

	const ensureModalIsOpen = () => {
		cy.get('@modal').should('exist');
	};

	const ensureModalIsClosed = () => {
		cy.get('@modal').should('not.exist');
	};
});

function shouldSuccessfullyConfirmAndSaveEmailChanges(
	expectedEmailAddresses: string[]
) {
	cy.findByText('Add Email').click();

	cy.contains('Add Board Owners?').should('exist');
	cy.findByText(
		'These emails will be the board owners for everyone at Team With No Email.'
	).should('exist');
	expectedEmailAddresses.forEach((email) => {
		cy.contains(email).should('exist');
	});

	cy.contains('Yes, Add Board Owners').click();
}

function createTeamWithNoEmailsAndLogin() {
	const teamName = 'Team With No Email';
	const teamId = 'team-with-no-email';

	cy.log('**Creating Team via api**');
	cy.request('POST', '/api/e2e/create-team-with-no-emails').then(() => {
		cy.log('**Logging in via api**');
		cy.request({
			url: LOGIN_API_PATH,
			failOnStatusCode: false,
			method: 'POST',
			body: {
				name: teamName,
				password: 'Password1',
			},
		}).then((response) => {
			if (response.status === 200) {
				const token = response.body as string;
				cy.setCookie('token', token);
				cy.visit(getRetroPagePathWithTeamId(teamId));
				cy.contains(teamName).should('exist');
			} else {
				cy.log('**Login via api failed with status code: **' + response.status);
			}
		});
	});
}

function goToAccountSettings() {
	cy.get('[data-testid=settingsButton]').click();
	cy.findAllByText('Settings').eq(1).should('exist');
	cy.findByText('Account').click();
	cy.findByText('Add Board Owners').should('exist');
}

function shouldCreateActionItems(actionItems: string[]) {
	actionItems.forEach((actionString, index) => {
		cy.enterActionItem(actionString);

		cy.confirmNumberOfActionItemsInColumn(index + 1);

		const splitActionString = actionString.split('@');
		const action = splitActionString[0].trim();
		const assignedTo = splitActionString[1];

		cy.findByText(action).should('exist');
		cy.findByDisplayValue(assignedTo).should('exist');
	});
}

const getHappyColumnItems = () =>
	cy.get('[data-testid=retroColumn__happy]').find(`[data-testid=retroItem]`);

function shouldEditActionItemTaskAndAssignee(
	currentTask: string,
	appendToTask: string,
	currentAssignee: string,
	appendToAssignee: string
) {
	cy.log(`**Edit Action Item: ${currentTask}**`);

	cy.getActionItemByTask(currentTask)
		.find('[data-testid=editButton]')
		.type(`{rightarrow} ${appendToTask}{enter}`);

	cy.wait('@updateTask');

	cy.getActionItemByTask(currentTask)
		.contains(`${currentTask} ${appendToTask}`)
		.should('exist');

	cy.getActionItemByTask(currentTask)
		.find('[data-testid=assigneeInput]')
		.type(`${appendToAssignee}{enter}`);

	cy.getActionItemByTask(currentTask)
		.findByDisplayValue(`${currentAssignee}${appendToAssignee}`)
		.should('exist');
}

function shouldMarkAndUnmarkActionItemAsDiscussed(actionItemTask: string) {
	const editButtonSelector = '[data-testid=editButton]';
	getActionColumnItems()
		.last()
		.find(editButtonSelector)
		.should('not.be.disabled');

	cy.getActionItemByTask(actionItemTask)
		.find('[data-testid=checkboxButton]')
		.as('completedButton');

	cy.log(`**Mark action item task "${actionItemTask}" as completed**`);
	cy.get(`@completedButton`).click();

	cy.wait('@updateCompletedState');

	cy.log('**Completed action item should move to bottom of the list**');
	getActionColumnItems()
		.should('have.length', 2)
		.last()
		.find(editButtonSelector)
		.should('be.disabled');

	cy.get(`@completedButton`).click();

	cy.wait('@updateCompletedState');

	cy.log('**Unmark action item as completed and move up the list**');
	getActionColumnItems()
		.should('have.length', 2)
		.last()
		.find(editButtonSelector)
		.should('not.be.disabled');
}

function shouldDeleteActionItem(actionItemTask: string) {
	cy.log(`**Deleting action item ${actionItemTask}**`);
	cy.getActionItemByTask(actionItemTask)
		.find(`[data-testid=deleteButton]`)
		.click();
	cy.get('[data-testid=deleteColumnItem]').contains('Yes').click();
}

const getActionColumnItems = () =>
	cy.get('[data-testid=retroColumn__action]').find(`[data-testid=actionItem]`);
const getRetroItemByText = (text: string): Chainable =>
	cy.findByText(text).closest(`[data-testid=retroItem]`);

const getDiscussedThought = () =>
	cy.get('[data-testid=checkmark]').closest('[data-testid="retroItem"]');
const getRetroActionModal = () => cy.get('[data-testid=retro-item-modal]');
const getColumnHeaderByTopic = (topic: Topic) =>
	cy.get(`[data-testid=columnHeader-${topic}]`);
const getDiscussedButton = (thoughtText: string) =>
	getRetroItemByText(thoughtText).find('[data-testid=checkboxButton]');
