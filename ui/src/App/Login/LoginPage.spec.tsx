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
import { MutableSnapshot, RecoilRoot } from 'recoil';
import { mockEnvironmentConfig } from 'Services/Api/__mocks__/ConfigurationService';
import { mockTeam } from 'Services/Api/__mocks__/TeamService';
import ContributorsService from 'Services/Api/ContributorsService';
import TeamService from 'Services/Api/TeamService';
import { EnvironmentConfigState } from 'State/EnvironmentConfigState';

import LoginPage from './LoginPage';

jest.mock('Services/Api/ContributorsService');
jest.mock('Services/Api/TeamService');
jest.mock('Services/Api/ConfigurationService');

const mockLogin = jest.fn();

jest.mock('Hooks/useAuth', () => {
	return () => ({
		login: mockLogin,
	});
});

describe('Login Page', () => {
	let container: HTMLElement;
	let unmount: () => void;
	let rerender: (ui: ReactElement) => void;
	const validTeamName = mockTeam.name;
	const validPassword = 'Password1';

	beforeEach(async () => {
		({ container, rerender, unmount } = renderComponent());

		await waitFor(() => expect(ContributorsService.get).toHaveBeenCalled());
	});

	it('should render without axe errors', async () => {
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});

	it('should show correct heading', () => {
		expect(screen.getByText('Log in to your Team!')).toBeDefined();
	});

	it('should show link to create new team', () => {
		const createNewTeamLink = screen.getByText('Create new team');
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
			<RecoilRoot
				initializeState={({ set }: MutableSnapshot) => {
					set(EnvironmentConfigState, mockEnvironmentConfig);
				}}
			>
				<MemoryRouter initialEntries={[`/login/${mockTeam.id}`]}>
					<Routes>
						<Route path="/login/:teamId" element={<LoginPage />} />
					</Routes>
				</MemoryRouter>
			</RecoilRoot>
		);
		await waitFor(() =>
			expect(TeamService.getTeamName).toHaveBeenCalledWith(mockTeam.id)
		);
		teamNameInput = getTeamNameInput();
		await waitFor(async () => expect(teamNameInput.value).toBe(mockTeam.name));
	});

	it('should login with correct credentials', async () => {
		typeIntoTeamNameInput(validTeamName);
		typeIntoPasswordInput(validPassword);

		const submitButton = screen.getByText('Log in');
		userEvent.click(submitButton);

		expect(TeamService.login).toHaveBeenCalledWith(
			validTeamName,
			validPassword
		);
		await waitFor(() => expect(mockLogin).toHaveBeenCalled());
	});

	it('should have a "Forgot your login info?" link that goes to the request password reset page', () => {
		const forgotLoginInfoLink = screen.getByText('Forgot your login info?');
		expect(forgotLoginInfoLink.getAttribute('href')).toBe(
			'/request-password-reset'
		);
	});

	it('should hide "Forgot your login info?" link if environment config says email is disabled', async () => {
		unmount();
		renderComponent(({ set }) => {
			set(EnvironmentConfigState, {
				email_from_address: '',
				email_is_enabled: false,
			});
		});
		await waitFor(() => expect(ContributorsService.get).toHaveBeenCalled());

		expect(screen.queryByText('Forgot your login info?')).toBeNull();
	});

	describe('Form errors', () => {
		it('should show error if login was unsuccessful', async () => {
			TeamService.login = jest.fn().mockRejectedValue(new Error('Async error'));

			rerender(
				<RecoilRoot
					initializeState={({ set }: MutableSnapshot) => {
						set(EnvironmentConfigState, mockEnvironmentConfig);
					}}
				>
					<MemoryRouter initialEntries={[`/login/${validTeamName}`]}>
						<Routes>
							<Route path="/login/:teamId" element={<LoginPage />} />
						</Routes>
					</MemoryRouter>
				</RecoilRoot>
			);

			typeIntoPasswordInput(validPassword);

			const submitButton = await screen.findByText('Log in');
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

	it('should not validate anything pre-submit', async () => {
		TeamService.login = jest.fn().mockRejectedValue(new Error('Async error'));

		typeIntoPasswordInput(validPassword.substring(0, 1));
		typeIntoTeamNameInput('');

		const submitButton = await screen.findByText('Log in');
		userEvent.click(submitButton);
		expect(TeamService.login).toHaveBeenCalledWith('', 'P');
		expect(mockLogin).not.toHaveBeenCalled();
		expect(
			await screen.findByText(
				'Incorrect team name or password. Please try again.'
			)
		).toBeDefined();
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

function renderComponent(
	recoilState = ({ set }: MutableSnapshot) => {
		set(EnvironmentConfigState, mockEnvironmentConfig);
	}
) {
	return render(
		<MemoryRouter initialEntries={['/login']}>
			<RecoilRoot initializeState={recoilState}>
				<Routes>
					<Route path="/login" element={<LoginPage />} />
				</Routes>
			</RecoilRoot>
		</MemoryRouter>
	);
}
