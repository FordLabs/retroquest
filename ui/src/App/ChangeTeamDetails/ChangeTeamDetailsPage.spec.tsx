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

import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { mockTeam } from 'Services/Api/__mocks__/TeamService';
import EmailResetTokenService from 'Services/Api/EmailResetTokenService';
import TeamService from 'Services/Api/TeamService';

import ChangeTeamDetailsPage from './ChangeTeamDetailsPage';

jest.mock('Services/Api/TeamService');
jest.mock('Services/Api/EmailResetTokenService');

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
	...(jest.requireActual('react-router-dom') as any),
	useNavigate: () => mockedUsedNavigate,
}));

describe('Change Team Details Page', () => {
	it('should have RetroQuest header', async () => {
		await renderWithToken();
		expect(screen.getByText('RetroQuest')).toBeDefined();
	});

	it('should have a field for email1 and email2, plus a submit button', async () => {
		await renderWithToken();
		expect(getEmail1InputField()).toBeInTheDocument();
		expect(getEmail2InputField()).toBeInTheDocument();
		expect(screen.getByText('Save Changes')).toBeInTheDocument();
	});

	it('should successfully submit form with optional secondary email', async () => {
		await renderWithToken();
		submitValidForm();

		await waitFor(() =>
			expect(TeamService.updateEmailsWithResetToken).toHaveBeenCalledWith(
				'email1@email1.email1',
				'email2@email2.email2',
				expect.anything()
			)
		);
	});

	it('should successfully submit form without optional secondary email', async () => {
		await renderWithToken();
		submitValidForm('email1@email1.email1', '');

		await waitFor(() =>
			expect(TeamService.updateEmailsWithResetToken).toHaveBeenCalledWith(
				'email1@email1.email1',
				'',
				expect.anything()
			)
		);
	});

	it('should send the secret code in the url to the backend on submission', async () => {
		await renderWithToken('ABC123');
		submitValidForm('a@b.c', '');

		await waitFor(() =>
			expect(TeamService.updateEmailsWithResetToken).toHaveBeenCalledWith(
				expect.anything(),
				expect.anything(),
				'ABC123'
			)
		);
	});

	it('should show "Saved!" if the backend returns 200 after submission', async () => {
		await renderWithToken('ABC321');
		submitValidForm();

		expect(
			await screen.findByText('Board Owners Updated!')
		).toBeInTheDocument();
		expect(screen.getByText('Return to Login')).toHaveAttribute(
			'href',
			'/login'
		);
		expect(screen.queryByText('Update Board Owners')).toBeNull();
	});

	it('should disable submit button until a valid email is added to the first email field', async () => {
		await renderWithToken();
		expect(getSubmitButton()).toBeDisabled();
		typeIntoEmail1Field('a@');
		expect(getSubmitButton()).toBeDisabled();
		typeIntoEmail1Field('a@c');
		expect(getSubmitButton()).toBeEnabled();
	});

	it('should have email 1 set to required', async () => {
		await renderWithToken('ABC123');
		expect(getEmail1InputField()).toHaveAttribute('required', '');
	});

	it('should not have email 2 set to required', async () => {
		await renderWithToken('ABC123');
		expect(getEmail2InputField()).not.toHaveAttribute('required', '');
	});

	it('should pre-populate form with current team emails and enable submit button', async () => {
		EmailResetTokenService.getTeamByResetToken = jest
			.fn()
			.mockResolvedValue(mockTeam);

		await renderWithToken('valid-token');

		await waitFor(() =>
			expect(getEmail1InputField()).toHaveValue(mockTeam.email)
		);
		await waitFor(() =>
			expect(getEmail2InputField()).toHaveValue(mockTeam.secondaryEmail)
		);
		expect(getSubmitButton()).toBeEnabled();
	});

	describe('Token Validity', () => {
		it('should navigate to Expired Token page if getting team by reset token returns 400', async () => {
			EmailResetTokenService.getTeamByResetToken = jest
				.fn()
				.mockRejectedValue({ response: { status: 400 } });

			await renderWithToken('expired-token');
			await waitFor(() =>
				expect(EmailResetTokenService.getTeamByResetToken).toHaveBeenCalledWith(
					'expired-token'
				)
			);
			expect(mockedUsedNavigate).toHaveBeenCalledWith(
				'/email/reset/expired-link'
			);
		});

		it('should navigate to Expired Token page if no reset token is present in url', async () => {
			EmailResetTokenService.getTeamByResetToken = jest
				.fn()
				.mockRejectedValue({ response: { status: 400 } });

			await renderWithToken('');
			await waitFor(() =>
				expect(EmailResetTokenService.getTeamByResetToken).toHaveBeenCalledWith(
					'invalid'
				)
			);
			expect(mockedUsedNavigate).toHaveBeenCalledWith(
				'/email/reset/expired-link'
			);
		});

		it('should check if token is valid and stay on page if it is valid', async () => {
			EmailResetTokenService.getTeamByResetToken = jest
				.fn()
				.mockResolvedValue({ response: { status: 200 } });

			await renderWithToken('valid-token');
			await waitFor(() =>
				expect(EmailResetTokenService.getTeamByResetToken).toHaveBeenCalledWith(
					'valid-token'
				)
			);
			expect(mockedUsedNavigate).not.toHaveBeenCalled();
		});
	});

	describe('Form Errors', () => {
		beforeEach(() => {
			renderWithToken('ABC123');
		});

		it('should warn user when primary email is not valid', () => {
			const invalidEmail = 'Aaaaa.com';
			typeIntoEmail1Field(invalidEmail);

			expect(screen.getByText('Valid email address required')).toBeDefined();
		});

		it('should warn user when secondary email is typed in and not valid', () => {
			const invalidEmail = 'Aaaaa.com';
			typeIntoEmail2Field(invalidEmail);

			expect(screen.getByText('Valid email address required')).toBeDefined();
		});
	});
});

function submitValidForm(
	email1 = 'email1@email1.email1',
	email2 = 'email2@email2.email2'
) {
	typeIntoEmail1Field(email1);
	typeIntoEmail2Field(email2);
	fireEvent.change(getEmail2InputField(), {
		target: { value: email2 },
	});

	fireEvent.click(getSubmitButton());
}

function typeIntoEmail1Field(email: string) {
	fireEvent.change(getEmail1InputField(), {
		target: { value: email },
	});
}

function typeIntoEmail2Field(email: string) {
	fireEvent.change(getEmail2InputField(), {
		target: { value: email },
	});
}

function getSubmitButton() {
	return screen.getByText('Save Changes');
}

function getEmail1InputField() {
	return screen.getByLabelText('Email 1', { selector: 'input' });
}

function getEmail2InputField() {
	return screen.getByLabelText('Second Teammate’s Email (optional)', {
		selector: 'input',
	});
}

async function renderWithToken(token: string = '') {
	const initialEntry =
		token !== '' ? '/change-emails?token=' + token : '/change-emails';
	render(
		<MemoryRouter initialEntries={[initialEntry]}>
			<Routes>
				<Route element={<ChangeTeamDetailsPage />} path="/change-emails" />
			</Routes>
		</MemoryRouter>
	);

	await waitFor(() =>
		expect(EmailResetTokenService.getTeamByResetToken).toHaveBeenCalledWith(
			token || 'invalid'
		)
	);
}
