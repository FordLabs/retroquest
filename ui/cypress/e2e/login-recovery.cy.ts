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
	const teamCredentials = getTeamCredentials();

	beforeEach(() => {
		cy.createTeam(teamCredentials);
	});

	context('Update Board Owners', () => {
		it("Pre-populate form with team's current email addresses", () => {
			cy.request(
				'POST',
				`/api/e2e/create-email-reset-token/${teamCredentials.teamId}`
			).then((response) => {
				const emailResetToken = response.body;
				cy.visit(`/email/reset?token=${emailResetToken}`);

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
			cy.visit(`/email/reset?token=invalid-token`);

			cy.findByText('Expired Link').should('exist');
			cy.findByText('You can request a new link in the settings menu.').should(
				'exist'
			);
		});
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
