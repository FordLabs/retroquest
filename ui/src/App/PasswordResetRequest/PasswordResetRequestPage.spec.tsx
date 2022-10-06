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
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MutableSnapshot } from 'recoil';
import ConfigurationService from 'Services/Api/ConfigurationService';
import ContributorsService from 'Services/Api/ContributorsService';
import TeamService from 'Services/Api/TeamService';
import { ThemeState } from 'State/ThemeState';
import Theme from 'Types/Theme';
import renderWithRecoilRoot from 'Utils/renderWithRecoilRoot';

import PasswordResetRequestPage from './PasswordResetRequestPage';

jest.mock('Services/Api/TeamService');
jest.mock('Services/Api/ContributorsService');
jest.mock('Services/Api/ConfigurationService');

describe('Password Reset Request Page', () => {
	it('should have a field for team name and email, a disabled send link button', async () => {
		await renderPasswordResetRequestPage();
		expect(screen.getByLabelText('Team Name')).toBeInTheDocument();
		expect(screen.getByLabelText('Email')).toBeInTheDocument();
		const submitButton = screen.getByText('Send reset link');
		expect(submitButton).toBeDisabled();
	});

	it('should not show github link', async () => {
		await renderPasswordResetRequestPage();
		expect(screen.queryByText('Github')).toBeNull();
	});

	it('should have a forgot team name link', async () => {
		await renderPasswordResetRequestPage();
		const forgotTeamNameLink = screen.getByText(
			"I don't remember my team name"
		);
		expect(forgotTeamNameLink).toHaveAttribute('href', '/recover-team-name');
	});

	it('should enable submit button when fields are populated with any values', async () => {
		await renderPasswordResetRequestPage();
		userEvent.type(screen.getByLabelText('Team Name'), 'S');
		const emailInput = screen.getByLabelText('Email');
		const submitButton = screen.getByText('Send reset link');
		userEvent.type(emailInput, 'a@');
		expect(submitButton).toBeEnabled();
	});

	it('should send team name and email to the backend on submission', async () => {
		await renderPasswordResetRequestPage();
		submitValidForm();

		await waitFor(() =>
			expect(TeamService.sendPasswordResetLink).toHaveBeenCalledWith(
				'Team Name',
				'e@mail.com'
			)
		);
	});

	it('should not send if any fields are blank', async () => {
		await renderPasswordResetRequestPage();
		submitValidForm('', '');
		expect(TeamService.sendPasswordResetLink).toHaveBeenCalledTimes(0);
	});

	const confirmationMessage = 'Check your Mail!';
	it('should show confirmation message if the backend returns 200 after submission', async () => {
		await renderPasswordResetRequestPage();
		submitValidForm('TeamName', 'test@mail.com');

		await waitFor(() =>
			expect(screen.queryByText('Reset your Password')).toBeNull()
		);
		expect(screen.queryByText('Github')).toBeNull();
		expect(screen.getByText(confirmationMessage)).toBeInTheDocument();
		const paragraph1 = `We’ve sent an email to test@mail.com with password reset instructions.`;
		expect(screen.getByText(paragraph1)).toBeInTheDocument();
		const paragraph2 =
			"If an email doesn't show up soon, check your spam folder. We sent it from mock@email.com.";
		expect(screen.getByText(paragraph2)).toBeInTheDocument();
		expect(screen.getByText('Return to Login')).toHaveAttribute(
			'href',
			'/login'
		);
	});

	it('should not show confirmation message if the form is not submitted', async () => {
		await renderPasswordResetRequestPage();
		await waitFor(() =>
			expect(screen.queryByText(confirmationMessage)).toBeNull()
		);
		expect(screen.getByText('Reset your Password')).toBeInTheDocument();
	});

	it('should render checkbox in confirmation screen as dark turquoise in light mode', async () => {
		await renderPasswordResetRequestPage(({ set }) => {
			set(ThemeState, Theme.LIGHT);
		});
		submitValidForm();

		const checkedCheckboxIcon = await screen.findByTestId(
			'checkedCheckboxIcon'
		);
		expect(checkedCheckboxIcon.getAttribute('fill')).toBe('#16a085');
	});

	it('should render checkbox in confirmation screen as light turquoise in dark mode', async () => {
		await renderPasswordResetRequestPage(({ set }) => {
			set(ThemeState, Theme.DARK);
		});
		submitValidForm();

		const checkedCheckboxIcon = await screen.findByTestId(
			'checkedCheckboxIcon'
		);
		expect(checkedCheckboxIcon.getAttribute('fill')).toBe('#1abc9c');
	});

	it('should show an error message if the request is not successful that persists until you type in either input', async () => {
		TeamService.sendPasswordResetLink = jest
			.fn()
			.mockRejectedValue('API says you are bad');
		await renderPasswordResetRequestPage();
		submitValidForm();
		let pleaseTryAgain = 'Team name or email is incorrect. Please try again.';
		expect(await screen.findByText(pleaseTryAgain)).toBeInTheDocument();
		fireEvent.change(screen.getByLabelText('Team Name'), {
			target: { value: 't' },
		});
		expect(screen.queryByText(pleaseTryAgain)).not.toBeInTheDocument();
		submitValidForm();
		expect(await screen.findByText(pleaseTryAgain)).toBeInTheDocument();
		fireEvent.change(screen.getByLabelText('Email'), {
			target: { value: 'e@ma.il' },
		});
		expect(screen.queryByText(pleaseTryAgain)).not.toBeInTheDocument();
	});
});

async function renderPasswordResetRequestPage(
	recoilState?: (mutableSnapshot: MutableSnapshot) => void
) {
	renderWithRecoilRoot(
		<MemoryRouter>
			<PasswordResetRequestPage />
		</MemoryRouter>,
		recoilState
	);
	await waitFor(() => expect(ContributorsService.get).toHaveBeenCalled());
	await waitFor(() =>
		expect(ConfigurationService.get).toHaveBeenCalledTimes(1)
	);
}

function submitValidForm(
	teamName: string = 'Team Name',
	email: string = 'e@mail.com'
) {
	fireEvent.change(screen.getByLabelText('Team Name'), {
		target: { value: teamName },
	});
	fireEvent.change(screen.getByLabelText('Email'), {
		target: { value: email },
	});

	fireEvent.click(screen.getByText('Send reset link'));
}
