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
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { RecoilRoot } from 'recoil';

import { mockContributors } from '../../Services/Api/__mocks__/ContributorsService';
import ContributorsService from '../../Services/Api/ContributorsService';
import TeamService from '../../Services/Api/TeamService';

import CreateTeamPage from './CreateTeamPage';

jest.mock('../../Services/Api/ContributorsService');
jest.mock('../../Services/Api/TeamService');

const mockLogin = jest.fn();

jest.mock('../../Hooks/useAuth', () => {
	return () => ({
		login: mockLogin,
	});
});

describe('CreatePage.spec.tsx', () => {
	let container: HTMLElement;
	const validTeamName = 'Team Awesome';
	const validPassword = 'Password1';
	const validEmail = 'e@mail.com';
	const validSecondaryEmail = 'eTwo@mailTwo.com';

	beforeEach(async () => {
		ContributorsService.get = jest.fn().mockResolvedValue(mockContributors);
		TeamService.create = jest.fn().mockResolvedValue(validTeamName);

		({ container } = render(
			<MemoryRouter>
				<RecoilRoot>
					<CreateTeamPage />
				</RecoilRoot>
			</MemoryRouter>
		));

		await waitFor(() => expect(ContributorsService.get).toHaveBeenCalled());
	});

	it('should render without axe errors', async () => {
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});

	it('should show correct heading', () => {
		expect(screen.getByText('Create a New Team!')).toBeDefined();
	});

	it('should disable submit button until form is populated', () => {
		const submitButton = screen.getByTestId('formSubmitButton');
		expect(submitButton).toBeDisabled();
		typeIntoTeamNameInput(validTeamName);
		expect(submitButton).toBeDisabled();
		typeIntoPasswordInput(validPassword);
		expect(submitButton).toBeDisabled();
		typeIntoEmail(validEmail);
		expect(submitButton).toBeEnabled();
	});

	it('should disable submit button if form is filled out, and a required field is cleared', () => {
		const submitButton = screen.getByTestId('formSubmitButton');
		expect(submitButton).toBeDisabled();
		typeIntoTeamNameInput(validTeamName);
		typeIntoPasswordInput(validPassword);
		typeIntoEmail(validEmail);
		expect(submitButton).toBeEnabled();
		typeIntoEmail('');
		expect(submitButton).toBeDisabled();
	});

	it('should show link to login page', () => {
		const createNewTeamLink = screen.getByText('Log in to your existing team');
		expect(createNewTeamLink.getAttribute('href')).toBe('/login');
	});

	it('should show contributors list', async () => {
		await waitFor(() =>
			expect(ContributorsService.get).toHaveBeenCalledTimes(1)
		);
		expect(screen.getByTestId('rq-contributor-0')).toBeDefined();
		expect(screen.getByTestId('rq-contributor-1')).toBeDefined();
	});

	it('should successfully create team', async () => {
		typeIntoTeamNameInput(validTeamName);
		typeIntoPasswordInput(validPassword);
		typeIntoEmail(validEmail);

		const submitButton = screen.getByText('Create Team');
		userEvent.click(submitButton);
		expect(TeamService.create).toHaveBeenCalledWith(
			validTeamName,
			validPassword,
			validEmail,
			''
		);
		await waitFor(() => expect(mockLogin).toHaveBeenCalled());
	});

	it('should successfully create team with the optional secondary email', async () => {
		typeIntoTeamNameInput(validTeamName);
		typeIntoPasswordInput(validPassword);
		typeIntoEmail(validEmail);
		typeIntoSecondaryEmail(validSecondaryEmail);

		const submitButton = screen.getByText('Create Team');
		userEvent.click(submitButton);
		expect(TeamService.create).toHaveBeenCalledWith(
			validTeamName,
			validPassword,
			validEmail,
			validSecondaryEmail
		);
		await waitFor(() => expect(mockLogin).toHaveBeenCalled());
	});

	describe('Form errors', () => {
		beforeEach(() => {
			expect(screen.queryByTestId('inputValidationMessage')).toBeNull();
			expect(screen.queryByTestId('formErrorMessage')).toBeNull();
		});

		it('should warn user with message when team name has special characters', async () => {
			typeIntoPasswordInput(validPassword);

			const invalidTeamName = '&%(#';
			typeIntoTeamNameInput(invalidTeamName);

			fireEvent.submit(getTeamNameInput());

			const inputValidationMessage = screen.getByTestId(
				'inputValidationMessage'
			);
			expect(inputValidationMessage.textContent).toBe(
				'Names must not contain special characters.'
			);

			const formErrorMessage = screen.getByTestId('formErrorMessage');
			expect(formErrorMessage.textContent).toBe(
				'Please enter a team name without any special characters.'
			);
		});

		it('should warn user with message when password is not valid', async () => {
			typeIntoTeamNameInput(validTeamName);

			const invalidPassword = 'MissingANumber';
			typeIntoPasswordInput(invalidPassword);

			fireEvent.submit(getPasswordInput());

			const inputValidationMessage = screen.getByTestId(
				'inputValidationMessage'
			);
			expect(inputValidationMessage.textContent).toBe(
				'Must have: 8+ Characters, 1 Upper Case Letter, 1 Number'
			);

			const formErrorMessage = screen.getByTestId('formErrorMessage');
			expect(formErrorMessage.textContent).toBe(
				'Password must contain at least one number.'
			);
		});
	});
});

const getTeamNameInput = (): HTMLInputElement =>
	screen.getByLabelText('Team Name', { selector: 'input' }) as HTMLInputElement;
const getPasswordInput = (): HTMLInputElement =>
	screen.getByLabelText('Password', { selector: 'input' }) as HTMLInputElement;
const getEmailInput = (): HTMLInputElement =>
	screen.getByLabelText('Email', {
		selector: 'input',
	}) as HTMLInputElement;
const getSecondaryEmailInput = (): HTMLInputElement =>
	screen.getByLabelText("Second Teammate's Email (optional)", {
		selector: 'input',
	}) as HTMLInputElement;

const typeIntoPasswordInput = (password: string) => {
	const passwordInput = getPasswordInput();
	fireEvent.change(passwordInput, { target: { value: password } });
};

const typeIntoEmail = (email: string) => {
	const emailInput = getEmailInput();
	fireEvent.change(emailInput, {
		target: { value: email },
	});
};

const typeIntoSecondaryEmail = (email: string) => {
	const secondEmailInput = getSecondaryEmailInput();
	fireEvent.change(secondEmailInput, {
		target: { value: email },
	});
};

const typeIntoTeamNameInput = (teamName: string) => {
	const teamNameInput = getTeamNameInput();
	fireEvent.change(teamNameInput, { target: { value: teamName } });
};
