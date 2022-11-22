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

import { getTeamCredentials } from '../support/helpers';
import TeamCredentials from '../support/types/teamCredentials';

describe('Login Recovery', () => {
	let teamCredentials;

	beforeEach(() => {
		cy.intercept('GET', '**/is-valid').as('checkIfTokenIsValidEndpoint');

		teamCredentials = getTeamCredentials();

		cy.createTeam(teamCredentials);
	});

	context('Update Board Owners', () => {
		it('Request to change team owners from settings & change team owners through link', () => {
			cy.login(teamCredentials);

			cy.visit(`/team/${teamCredentials.teamId}`);
			cy.shouldBeOnRetroPage(teamCredentials.teamId);

			cy.get('[data-testid="settingsButton"]').click();
			cy.findByText('Account').click();
			cy.contains('Board Owners').should('exist');

			cy.intercept('POST', '/api/email/email-reset-request').as(
				'sendEmailResetRequestEmail'
			);
			cy.findByText('Send Board Owner Update Link').click();
			cy.wait('@sendEmailResetRequestEmail');

			cy.findByText(
				'We’ve sent an email to login1234@mail.com with instructions on how to change the Board Owner email addresses.'
			).should('exist');
			cy.findByText(
				'If an email doesn’t show up soon, check your spam folder. We sent it from rq@fake.com.'
			).should('exist');

			cy.findByText('Close').click();

			cy.request(
				'POST',
				`/api/e2e/create-email-reset-token/${teamCredentials.teamId}`
			).then((response) => {
				const emailResetToken = response.body;
				cy.visit(`/email/reset?token=${emailResetToken}`);

				cy.log(
					'Ensure form is pre-populated with current team email addresses'
				);
				cy.findByLabelText('Email 1')
					.should('have.value', teamCredentials.email)
					.clear()
					.type('primary@mail.com');

				cy.findByLabelText('Second Teammate’s Email (optional)')
					.should('have.value', '')
					.clear()
					.type('secondary@mail.com');

				cy.findByText('Save Changes').click();

				cy.findByText('Board Owners Updated!').should('exist');

				ensureTeamEmailsGotSavedToDB(teamCredentials);
			});
		});

		it('Redirect to "Expired Link" page when token is invalid', () => {
			cy.intercept('GET', `/api/email-reset-token/invalid-token/team`).as(
				'getTeamByResetToken'
			);
			cy.visit(`/email/reset?token=invalid-token`);

			cy.wait('@getTeamByResetToken');

			cy.findByText('Expired Link').should('exist');
			cy.findByText('You can request a new link in the settings menu.').should(
				'exist'
			);
		});
	});

	context('Reset Password', () => {
		it('Request a password reset email through forgot login info page, change password, and login with new password', () => {
			cy.log('**Request a password reset email**');
			cy.intercept('GET', '**/config').as('getConfigEndpoint');
			cy.intercept('POST', '/api/email/password-reset-request').as(
				'passwordResetRequest'
			);

			cy.visit('/login');
			cy.contains('Log in to your Team!').should('exist');

			cy.findByText('Forgot your login info?').click();

			cy.findByText('Reset your Password').should('exist');

			cy.findByLabelText('Team Name').type(teamCredentials.teamName);
			cy.findByLabelText('Email').type(teamCredentials.email);

			cy.contains(/Send Reset Link/i)
				.should('be.enabled')
				.click();

			cy.wait('@passwordResetRequest');

			cy.contains(
				'We’ve sent an email to login1234@mail.com with password reset instructions.'
			).should('exist');
			cy.contains(
				"If an email doesn't show up soon, check your spam folder. We sent it from rq@fake.com."
			).should('exist');

			cy.log('**Change current password**');
			cy.request(
				'GET',
				`/api/e2e/password-reset-token/${teamCredentials.teamId}`
			).then((response) => {
				const emailResetToken = response.body;
				cy.visit(`/password/reset?token=${emailResetToken}`, {
					failOnStatusCode: false,
				});

				cy.wait('@getConfigEndpoint');
				cy.wait('@checkIfTokenIsValidEndpoint');

				const newPassword = 'NewPassword1';
				changePasswordOnResetPasswordPage(newPassword);

				shouldLogInWithNewCredentials(teamCredentials, newPassword);
			});
		});

		it('Request a password reset email through settings, change password, and login with new password', () => {
			cy.log('**Request a password reset email**');
			cy.intercept('GET', '**/config').as('getConfigEndpoint');
			cy.intercept('POST', '/api/email/password-reset-request').as(
				'passwordResetRequest'
			);

			cy.login(teamCredentials);

			cy.visit(`/team/${teamCredentials.teamId}`);
			cy.shouldBeOnRetroPage(teamCredentials.teamId);

			cy.get('[data-testid="settingsButton"]').click();
			cy.findByText('Account').click();
			cy.contains('Board Owners').should('exist');

			cy.findByText('Send Password Reset Link').click();
			cy.wait('@passwordResetRequest');

			cy.findByText(
				'We’ve sent an email to login1234@mail.com with password reset instructions.'
			).should('exist');
			cy.findByText(
				'If an email doesn’t show up soon, check your spam folder. We sent it from rq@fake.com.'
			).should('exist');

			cy.findByText('Close').click();

			cy.log('**Change current password**');
			cy.request(
				'GET',
				`/api/e2e/password-reset-token/${teamCredentials.teamId}`
			).then((response) => {
				const emailResetToken = response.body;
				cy.visit(`/password/reset?token=${emailResetToken}`, {
					failOnStatusCode: false,
				});

				cy.wait('@getConfigEndpoint');
				cy.wait('@checkIfTokenIsValidEndpoint');

				const newPassword = 'NewPassword1';
				changePasswordOnResetPasswordPage(newPassword);

				shouldLogInWithNewCredentials(teamCredentials, newPassword);
			});
		});

		it('Redirect to "Expired Link" page when token is invalid', () => {
			cy.visit(`/password/reset?token=invalid-token`, {
				failOnStatusCode: false,
			});

			cy.wait('@checkIfTokenIsValidEndpoint');

			cy.findByText('Expired Link').should('exist');
			cy.findByText(
				'Fear not! Click here to request a fresh, new reset link.'
			).should('exist');
		});
	});

	it('Request all team names associated with email', () => {
		cy.intercept('POST', '/api/email/recover-team-names').as(
			'recoverTeamNames'
		);

		cy.visit('/login');
		cy.contains('Log in to your Team!').should('exist');

		cy.findByText('Forgot your login info?').click();
		cy.findByText("I don't remember my team name").click();

		cy.findByText('Recover Team Name').should('exist');
		cy.findByLabelText('Email').type(teamCredentials.email);

		cy.contains(/Send Me My Team Name/i).click();
		cy.wait('@recoverTeamNames');

		cy.findByText(
			'If any RetroQuest teams are registered to login1234@mail.com, we’ve sent a list of all team names that are connected to the email address.'
		).should('exist');

		cy.findByText(
			'If an email doesn’t show up soon, check your spam folder. We sent it from rq@fake.com.'
		).should('exist');
	});
});

function ensureTeamEmailsGotSavedToDB(teamCredentials: TeamCredentials) {
	cy.login(teamCredentials);
	cy.getCookie('token').then((cookie) => {
		cy.request({
			url: `/api/team/${teamCredentials.teamId}`,
			failOnStatusCode: false,
			method: 'GET',
			headers: { Authorization: 'Bearer ' + cookie.value },
		}).then((resp) => {
			expect(resp.status).to.eq(200);
			const team = resp.body;
			expect(team.email).to.eq('primary@mail.com');
			expect(team.secondaryEmail).to.eq('secondary@mail.com');
		});
	});
}

function shouldLogInWithNewCredentials(
	teamCreds: TeamCredentials,
	newPassword: string
) {
	cy.log('**Login with new password**');
	cy.get('[data-testid=teamNameInput]').type(teamCreds.teamName);
	cy.get('[data-testid=passwordInput]').type(newPassword);
	cy.get('[data-testid=formSubmitButton]').click();
	cy.shouldBeOnRetroPage(teamCreds.teamId);
}

function changePasswordOnResetPasswordPage(newPassword: string) {
	cy.contains('Reset Your Password');
	cy.findByLabelText('New Password').should('have.value', '').type(newPassword);

	cy.findByText('Reset Password').should('be.enabled').click();

	cy.contains('All set! Your password has been changed.').should('exist');
	cy.findByText('Return to Login').click();
}
