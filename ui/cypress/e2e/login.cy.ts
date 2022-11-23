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

import { LOGIN_PAGE_PATH } from '../../src/RouteConstants';
import { TOKEN_KEY } from '../../src/Services/CookieService';
import { getTeamCredentials } from '../support/helpers';
import TeamCredentials from '../support/types/teamCredentials';
import Topic from '../support/types/Topic';

describe('Login', () => {
	const loginFailedMessage =
		'Incorrect team name or password. Please try again.';
	const teamCredentials = getTeamCredentials();

	before(() => {
		cy.createTeam(teamCredentials);
	});

	beforeEach(() => {
		cy.intercept('POST', '/api/team/login').as('postTeamLogin');
		cy.intercept('GET', '/api/team/*/name').as('getTeamNameById');

		cy.clearCookie('JSESSIONID');
		cy.clearCookie(TOKEN_KEY);

		cy.visit(LOGIN_PAGE_PATH);
		cy.contains('Log in to your Team!').should('exist');

		cy.get('[data-testid=teamNameInput]').as('teamNameInput');
		cy.get('[data-testid=passwordInput]').as('passwordInput');
		cy.get('[data-testid=formSubmitButton]').as('loginButton');
	});

	it('Navigates to team board after successful login', () => {
		fillOutAndSubmitLoginForm(teamCredentials);
		cy.url().should(
			'eq',
			`${Cypress.config().baseUrl}/team/${teamCredentials.teamId}`
		);
	});

	it('Pre-populates team name', () => {
		cy.get('[data-testid=teamNameInput]').as('teamNameInput');
		cy.get('@teamNameInput').should('have.value', '');

		cy.visit(`${LOGIN_PAGE_PATH}/${teamCredentials.teamId}`);

		cy.getCookie(TOKEN_KEY).should('not.exist');
		cy.getCookie('JSESSIONID').should('not.exist');

		cy.wait('@getTeamNameById');
		cy.get('@teamNameInput').should('have.value', teamCredentials.teamName);
	});

	describe('Form Errors', () => {
		it('Displays invalid team name when logging in with bad team', () => {
			fillOutAndSubmitLoginForm(
				{
					teamName: 'Something not correct',
					teamId: 'Something not correct',
					password: 'Something else wrong 1',
					jwt: '',
					email: 'eee',
				},
				403
			);
			cy.get('[data-testid=formErrorMessage]').should(
				'contain',
				loginFailedMessage
			);
		});

		it('Displays invalid team name/password when using bad password', () => {
			fillOutAndSubmitLoginForm(
				{
					...teamCredentials,
					password: 'Something else wrong 1',
				},
				403
			);
			cy.get('[data-testid=formErrorMessage]').should(
				'contain',
				loginFailedMessage
			);
		});
	});

	describe('Authorization Redirects', () => {
		it('Redirects to login page when action comes back unauthorized', () => {
			cy.createTeamAndLogin(teamCredentials);
			cy.document().setCookie('token', '');
			cy.enterThought(Topic.HAPPY, 'I have a thought');
			cy.url().should(
				'eq',
				Cypress.config().baseUrl + '/login/' + teamCredentials.teamId
			);
		});

		it('Redirects to login page when team name back forbidden', () => {
			cy.intercept('GET', '/api/team/teamNameThatDoesNotExist').as('getTeam');

			cy.createTeamAndLogin(teamCredentials);
			cy.visit('/team/teamNameThatDoesNotExist');

			cy.wait('@getTeam');

			cy.url().should(
				'eq',
				Cypress.config().baseUrl + '/login/teamNameThatDoesNotExist'
			);
		});
	});
});

function fillOutAndSubmitLoginForm(
	{ teamName, password }: TeamCredentials,
	expectedStatusCode = 200
) {
	cy.log('**Log in using the login form**');
	cy.get('@teamNameInput').type(teamName);
	cy.get('@passwordInput').type(password);
	cy.get('@loginButton').click();

	cy.wait('@postTeamLogin').then(({ response }) => {
		expect(response.statusCode).to.equal(expectedStatusCode);
	});
}
