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

import { MemoryRouter } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockEnvironmentConfig } from 'Services/Api/__mocks__/ConfigurationService';
import ConfigurationService from 'Services/Api/ConfigurationService';
import ContributorsService from 'Services/Api/ContributorsService';
import EmailService from 'Services/Api/EmailService';
import renderWithRecoilRoot from 'Utils/renderWithRecoilRoot';

import RecoverTeamNamePage from './RecoverTeamNamePage';

jest.mock('Services/Api/ContributorsService');
jest.mock('Services/Api/EmailService');
jest.mock('Services/Api/ConfigurationService');

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

	it('should type email, submit form successfully', async () => {
		await renderRecoverTeamNamesPage();
		await submitFormAndConfirmApiCall('valid@email.com');
	});

	it('should see confirmation message with to and from emails after form is submitted', async () => {
		await renderRecoverTeamNamesPage();
		await submitFormAndConfirmApiCall('valid@email.com');
		expect(screen.queryByText('Recover Team Name')).toBeNull();
		expect(await screen.findByText('Check your Mail!')).toBeInTheDocument();
		const checkYourMailConfirmation = screen.getByTestId('authTemplateContent');
		expect(checkYourMailConfirmation).toHaveTextContent('valid@email.com');
		expect(checkYourMailConfirmation).toHaveTextContent(
			mockEnvironmentConfig.email_from_address
		);
	});

	it('should show error message if error is returned from the api call', async () => {
		const expectedErrorMessage = 'errorMessage';
		EmailService.sendTeamNameRecoveryEmail = jest.fn().mockRejectedValue({
			response: { data: { message: expectedErrorMessage } },
		});

		await renderRecoverTeamNamesPage();
		await submitFormAndConfirmApiCall('badrecoveremail@email.com');
		expect(screen.getByText(expectedErrorMessage)).toBeInTheDocument();
	});

	it('should not validate email pre-submit', async () => {
		await renderRecoverTeamNamesPage();
		const invalidEmail = 'invalid@';
		typeIntoEmailField(invalidEmail);
		const emailInputErrorMessage = 'Valid email address required';
		expect(screen.queryByText(emailInputErrorMessage)).toBeNull();
		expect(getSubmitButton()).toBeEnabled();
	});
});

async function renderRecoverTeamNamesPage() {
	renderWithRecoilRoot(
		<MemoryRouter>
			<RecoverTeamNamePage />
		</MemoryRouter>
	);
	await waitFor(() => expect(ContributorsService.get).toHaveBeenCalled());
	await waitFor(() => expect(ConfigurationService.get).toHaveBeenCalled());
}

function typeIntoEmailField(email: string) {
	const emailInput = screen.getByLabelText('Email');
	userEvent.type(emailInput, email);
}

function getSubmitButton() {
	return screen.getByText('Send me my team name');
}

async function submitFormAndConfirmApiCall(email: string) {
	typeIntoEmailField(email);
	userEvent.click(getSubmitButton());
	await waitFor(() =>
		expect(EmailService.sendTeamNameRecoveryEmail).toHaveBeenCalledWith(email)
	);
}
