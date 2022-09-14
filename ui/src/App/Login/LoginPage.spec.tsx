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
import React, { ReactElement } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { RecoilRoot } from 'recoil';

import { mockContributors } from '../../Services/Api/__mocks__/ContributorsService';
import ConfigurationService from '../../Services/Api/ConfigurationService';
import ContributorsService from '../../Services/Api/ContributorsService';
import TeamService from '../../Services/Api/TeamService';

import LoginPage from './LoginPage';

jest.mock('../../Services/Api/ContributorsService');
jest.mock('../../Services/Api/TeamService');

const mockLogin = jest.fn();

jest.mock('../../Hooks/useAuth', () => {
	return () => ({
		login: mockLogin,
	});
});

jest.mock('../../Services/Api/ConfigurationService');

describe('LoginPage.spec.tsx', () => {
	let container: HTMLElement;
	let rerender: (ui: ReactElement) => void;
	let unmount: () => void;
	const validTeamName = 'Team Awesome';
	const validPassword = 'Password1';

	beforeEach(async () => {
		ContributorsService.get = jest.fn().mockResolvedValue(mockContributors);
		TeamService.getTeamName = jest.fn().mockResolvedValue(validTeamName);
		TeamService.login = jest.fn().mockResolvedValue(validTeamName);

		({ container, rerender, unmount } = renderComponent());

		await waitFor(() => expect(ContributorsService.get).toHaveBeenCalled());
	});

	it('should render without axe errors', async () => {
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});

	it('should show correct heading', () => {
		expect(screen.getByText('Sign in to your Team!')).toBeDefined();
	});

	it('should query the API for survey link href and show the survey link', () => {
		const surveyLink = screen.getByText(/take the retroquest survey/i);
		expect(surveyLink.getAttribute('href')).toEqual('mockSurveyLinkHref');
		expect(ConfigurationService.get).toHaveBeenCalled();
	});

	it('should not show the survey link if its href is empty', async () => {
		unmount();
		ConfigurationService.get = jest
			.fn()
			.mockResolvedValue({ survey_link_href: '' });
		renderComponent();
		await waitFor(() => expect(ConfigurationService.get).toHaveBeenCalled());
		const surveyLink = screen.queryByText(/take the retroquest survey/i);
		expect(surveyLink).toBeNull();
	});

	it('should show link to create new team', () => {
		const createNewTeamLink = screen.getByText('or create a new team');
		expect(createNewTeamLink.getAttribute('href')).toBe('/create');
	});

	it('should show contributors list', async () => {
		await waitFor(() =>
			expect(ContributorsService.get).toHaveBeenCalledTimes(1)
		);
		expect(screen.getByTestId('rq-contributor-0')).toBeDefined();
		expect(screen.getByTestId('rq-contributor-1')).toBeDefined();
	});

	it('should pre-populate team name if team name is in route', async () => {
		let teamNameInput = getTeamNameInput();
		expect(teamNameInput.value).toBe('');

		rerender(
			<RecoilRoot>
				<MemoryRouter initialEntries={[`/login/${validTeamName}`]}>
					<Routes>
						<Route path="/login/:teamId" element={<LoginPage />} />
					</Routes>
				</MemoryRouter>
			</RecoilRoot>
		);
		teamNameInput = getTeamNameInput();
		await waitFor(async () => expect(teamNameInput.value).toBe(validTeamName));
	});

	it('should login with correct credentials', async () => {
		typeIntoTeamNameInput(validTeamName);
		typeIntoPasswordInput(validPassword);

		const submitButton = screen.getByText('Sign in');
		userEvent.click(submitButton);

		expect(TeamService.login).toHaveBeenCalledWith(
			validTeamName,
			validPassword
		);
		await waitFor(() => expect(mockLogin).toHaveBeenCalled());
	});

	// @todo Add back in when login flow is ready
	xit('should have a "Forgot your login info?" link that goes to the request password reset page', () => {
		const forgotLoginInfoLink = screen.getByText('Forgot your login info?');
		expect(forgotLoginInfoLink.getAttribute('href')).toBe(
			'/request-password-reset'
		);
	});

	describe('Form errors', () => {
		it('should show error if login was unsuccessful', async () => {
			TeamService.login = jest.fn().mockRejectedValue(new Error('Async error'));

			rerender(
				<RecoilRoot>
					<MemoryRouter initialEntries={[`/login/${validTeamName}`]}>
						<Routes>
							<Route path="/login/:teamId" element={<LoginPage />} />
						</Routes>
					</MemoryRouter>
				</RecoilRoot>
			);

			typeIntoPasswordInput(validPassword);

			const submitButton = await screen.findByText('Sign in');
			userEvent.click(submitButton);
			expect(TeamService.login).toHaveBeenCalledWith(
				validTeamName,
				validPassword
			);
			expect(mockLogin).not.toHaveBeenCalled();
			expect(
				await screen.findByText(
					'Incorrect team name or password. Please try again.'
				)
			).toBeDefined();
		});
	});
});

const getTeamNameInput = (): HTMLInputElement =>
	screen.getByLabelText('Team Name', { selector: 'input' }) as HTMLInputElement;
const getPasswordInput = (): HTMLInputElement =>
	screen.getByLabelText('Password', { selector: 'input' }) as HTMLInputElement;

const typeIntoPasswordInput = (password: string) => {
	const teamPasswordInput = getPasswordInput();
	fireEvent.change(teamPasswordInput, { target: { value: password } });
};

const typeIntoTeamNameInput = (teamName: string) => {
	const teamNameInput = getTeamNameInput();
	fireEvent.change(teamNameInput, { target: { value: teamName } });
};

function renderComponent() {
	return render(
		<MemoryRouter initialEntries={['/login']}>
			<RecoilRoot>
				<Routes>
					<Route path="/login" element={<LoginPage />} />
				</Routes>
			</RecoilRoot>
		</MemoryRouter>
	);
}
