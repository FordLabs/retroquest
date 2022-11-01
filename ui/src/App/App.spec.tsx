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
import { render, screen, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { mockEnvironmentConfig } from 'Services/Api/__mocks__/ConfigurationService';
import ConfigurationService from 'Services/Api/ConfigurationService';
import { EnvironmentConfigState } from 'State/EnvironmentConfigState';
import EnvironmentConfig from 'Types/EnvironmentConfig';
import Theme from 'Types/Theme';
import { RecoilObserver } from 'Utils/RecoilObserver';

import {
	EXPIRED_EMAIL_RESET_LINK_PATH,
	EXPIRED_PASSWORD_RESET_LINK_PATH,
	PASSWORD_RESET_REQUEST_PATH,
	RECOVER_TEAM_NAME_PATH,
} from '../RouteConstants';

import App from './App';

jest.mock('Services/Api/ConfigurationService');
jest.mock('./Login/LoginPage', () => {
	return () => <div>Login Page</div>;
});
jest.mock('./ChangeTeamDetails/ChangeTeamDetailsPage', () => {
	return () => <div>Change Team Details Page</div>;
});
jest.mock('./ResetPassword/ResetPasswordPage', () => {
	return () => <div>Reset Password Page</div>;
});
jest.mock('./ExpiredResetPasswordLinkPage/ExpiredResetPasswordLinkPage', () => {
	return () => <div>Expired Reset Password Link Page</div>;
});
jest.mock(
	'./ExpiredResetBoardOwnersLinkPage/ExpiredResetBoardOwnersLinkPage',
	() => {
		return () => <div>Expired Reset Email Link Page</div>;
	}
);
jest.mock('./PasswordResetRequest/PasswordResetRequestPage', () => {
	return () => <div>Password Reset Request Page</div>;
});
jest.mock('./RecoverTeamName/RecoverTeamNamePage', () => {
	return () => <div>Recover Team Names Page</div>;
});
const pageNotFoundPageText = 'Oops!';
jest.mock('./PageNotFound/PageNotFoundPage', () => {
	return () => <div>{pageNotFoundPageText}</div>;
});
jest.mock('Common/Modal/Modal', () => {
	return () => <div>Root Modal</div>;
});

let environmentConfig: EnvironmentConfig | null;

describe('App', () => {
	describe('Without local storage theme', () => {
		it('should default theme to dark if device prefers color scheme dark', async () => {
			(window.matchMedia as jest.Mock).mockReturnValue({ matches: true });

			await renderApp();

			await screen.findByText('Login Page');
			expect(window.matchMedia).toHaveBeenCalledWith(
				'(prefers-color-scheme:dark)'
			);
			expect(document.body.classList).toContain('dark-theme');
		});

		it('should default theme to light if device does not prefer dark', async () => {
			(window.matchMedia as jest.Mock).mockReturnValue({ matches: false });

			await renderApp();

			expect(window.matchMedia).toHaveBeenCalledWith(
				'(prefers-color-scheme:dark)'
			);
			expect(document.body.classList).not.toContain('dark-theme');
		});
	});

	describe('With local storage theme', () => {
		it('should set theme to dark when local storage theme is "dark-theme"', async () => {
			window.localStorage.setItem('theme', Theme.DARK);

			await renderApp();

			expect(document.body.classList).toContain('dark-theme');
		});

		it('should set theme to light when local storage theme is "light-theme"', async () => {
			window.localStorage.setItem('theme', Theme.LIGHT);

			await renderApp();

			expect(document.body.classList).toContain('light-theme');
		});

		it('should set theme to dark when local storage theme is "system-theme" and system is in dark mode', async () => {
			window.localStorage.setItem('theme', Theme.SYSTEM);
			(window.matchMedia as jest.Mock).mockReturnValue({ matches: true });

			await renderApp();

			expect(window.matchMedia).toHaveBeenCalledWith(
				'(prefers-color-scheme:dark)'
			);
			expect(document.body.classList).toContain('dark-theme');
		});

		it('should set theme to light when local storage theme is "system-theme" and system is in light mode', async () => {
			window.localStorage.setItem('theme', Theme.SYSTEM);
			(window.matchMedia as jest.Mock).mockReturnValue({ matches: false });

			await renderApp();

			expect(window.matchMedia).toHaveBeenCalledWith(
				'(prefers-color-scheme:dark)'
			);
			expect(document.body.classList).toContain('light-theme');
		});
	});

	it('should include root modal', async () => {
		await renderApp();
		screen.getByText('Root Modal');
	});

	it('should get environment config and store in global state', async () => {
		await renderApp();

		await waitFor(() => expect(ConfigurationService.get).toHaveBeenCalled());
		expect(environmentConfig).toEqual(mockEnvironmentConfig);
	});

	describe('When email is disabled', () => {
		it.each([
			['Change Team Details Page', '/email/reset'],
			['Reset Password Page', '/password/reset'],
			['Expired Reset Password Link Page', EXPIRED_PASSWORD_RESET_LINK_PATH],
			['Expired Reset Email Link Page', EXPIRED_EMAIL_RESET_LINK_PATH],
			['Password Reset Request Page', PASSWORD_RESET_REQUEST_PATH],
			['Recover Team Names Page', RECOVER_TEAM_NAME_PATH],
		])(
			'should not render the "%s" page',
			async (pageName: string, path: string) => {
				renderAppWithEmailEnabledSetTo(false, path);
				expect(screen.queryByText(pageName)).toBeNull();
				expect(screen.getByText(pageNotFoundPageText)).toBeInTheDocument();
			}
		);
	});

	describe('When email is enabled', () => {
		it.each([
			['Change Team Details Page', '/email/reset'],
			['Reset Password Page', '/password/reset'],
			['Expired Reset Password Link Page', EXPIRED_PASSWORD_RESET_LINK_PATH],
			['Expired Reset Email Link Page', EXPIRED_EMAIL_RESET_LINK_PATH],
			['Password Reset Request Page', PASSWORD_RESET_REQUEST_PATH],
			['Recover Team Names Page', RECOVER_TEAM_NAME_PATH],
		])(
			'should render the "%s" page',
			async (pageName: string, path: string) => {
				renderAppWithEmailEnabledSetTo(true, path);
				expect(screen.getByText(pageName)).toBeInTheDocument();
				expect(screen.queryByText(pageNotFoundPageText)).toBeNull();
			}
		);
	});
});

async function renderApp() {
	environmentConfig = null;

	render(
		<MemoryRouter>
			<RecoilRoot>
				<RecoilObserver
					recoilState={EnvironmentConfigState}
					onChange={(value: EnvironmentConfig) => {
						environmentConfig = value;
					}}
				/>
				<App />
			</RecoilRoot>
		</MemoryRouter>
	);

	await waitFor(() => expect(ConfigurationService.get).toHaveBeenCalled());
}

function renderAppWithEmailEnabledSetTo(
	emailIsEnabled: boolean,
	routeThatShouldNotExist: string
) {
	render(
		<MemoryRouter initialEntries={[routeThatShouldNotExist]}>
			<RecoilRoot
				initializeState={({ set }) => {
					set(EnvironmentConfigState, {
						email_is_enabled: emailIsEnabled,
						email_from_address: '',
					});
				}}
			>
				<App />
			</RecoilRoot>
		</MemoryRouter>
	);
}
