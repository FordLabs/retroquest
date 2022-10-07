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

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContributorsService from 'Services/Api/ContributorsService';
import TeamService from 'Services/Api/TeamService';

import RecoverTeamNamePage from './RecoverTeamNamePage';

jest.mock('Services/Api/ContributorsService');
jest.mock('Services/Api/TeamService');

describe('Recover Team Name', () => {
	it('should show title, have a field for email, and a disabled submit button', async () => {
		await renderRecoverTeamNamesPage();
		expect(screen.getByText('Recover Team Name')).toBeInTheDocument();
		expect(screen.getByLabelText('Email')).toBeInTheDocument();
		const submitButton = screen.getByText('Send me my team name');
		expect(submitButton).toBeDisabled();
	});

	it('should not show github link', async () => {
		await renderRecoverTeamNamesPage();
		expect(screen.queryByText('Github')).toBeNull();
	});

	it('should type email and submit form successfully', async () => {
		await renderRecoverTeamNamesPage();
		typeIntoEmailField('valid@email.com');
		const submitButton = screen.getByText('Send me my team name');
		userEvent.click(submitButton);
		expect(TeamService.sendTeamNameRecoveryEmail).toHaveBeenCalledWith(
			'valid@email.com'
		);
	});

	it('should show error message if error is returned from the api call', async () => {
		const expectedErrorMessage = 'errorMessage';
		TeamService.sendTeamNameRecoveryEmail = jest.fn().mockRejectedValue({
			response: { data: { message: expectedErrorMessage } },
		});

		await renderRecoverTeamNamesPage();
		typeIntoEmailField('valid@email.com');
		const submitButton = screen.getByText('Send me my team name');
		userEvent.click(submitButton);
		await waitFor(() =>
			expect(TeamService.sendTeamNameRecoveryEmail).toHaveBeenCalledWith(
				'valid@email.com'
			)
		);
		expect(screen.getByText(expectedErrorMessage)).toBeInTheDocument();
	});

	it('should not validate email pre-submit', async () => {
		await renderRecoverTeamNamesPage();
		const invalidEmail = 'invalid@';
		typeIntoEmailField(invalidEmail);
		const emailInputErrorMessage = 'Valid email address required';
		expect(screen.queryByText(emailInputErrorMessage)).toBeNull();
		const submitButton = screen.getByText('Send me my team name');
		expect(submitButton).toBeEnabled();
	});
});

async function renderRecoverTeamNamesPage() {
	render(<RecoverTeamNamePage />);
	await waitFor(() => expect(ContributorsService.get).toHaveBeenCalled());
}

function typeIntoEmailField(email: string) {
	const emailInput = screen.getByLabelText('Email');
	userEvent.type(emailInput, email);
}
