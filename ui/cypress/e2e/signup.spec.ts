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
import { CREATE_TEAM_PAGE_PATH } from '../../src/RouteConstants';
import { getTeamCredentials } from '../support/helpers';
import TeamCredentials from '../support/types/teamCredentials';

describe('Signup', () => {
	const teamCredentials = getTeamCredentials();

	beforeEach(() => {
		cy.intercept('POST', '/api/team').as('postCreateTeam');

		cy.visit(CREATE_TEAM_PAGE_PATH);
		cy.contains('Create a new Team!').should('exist');

		cy.get('[data-testid=teamNameInput]').as('teamNameInput');
		cy.get('[data-testid=passwordInput]').as('passwordInput');
		cy.get('[data-testid=confirmPasswordInput]').as('confirmPasswordInput');
		cy.get('[data-testid=formSubmitButton]').as('createButton');
	});

	it('Create a new team and go to retro page', () => {
		fillOutAndSubmitCreateForm(teamCredentials, 201);

		cy.shouldBeOnRetroPage(teamCredentials.teamId);
	});

	describe('Form Errors', () => {
		it('Notifies user that team name has already been used when submitting a duplicate name', () => {
			cy.createTeam(teamCredentials);

			fillOutAndSubmitCreateForm(teamCredentials, 409);
			cy.get('[data-testid=formErrorMessage]').should(
				'contain',
				'This team name is already in use. Please try another one.'
			);
		});
	});
});

function fillOutAndSubmitCreateForm(
	{ teamName, password }: TeamCredentials,
	expectedStatusCode = 200
) {
	cy.log('**Log in using the login form**');
	cy.get('@teamNameInput').type(teamName);
	cy.get('@passwordInput').type(password);
	cy.get('@confirmPasswordInput').type(password);
	cy.get('@createButton').click();

	cy.wait('@postCreateTeam').then(({ response }) => {
		expect(response.statusCode).to.equal(expectedStatusCode);
	});
}
