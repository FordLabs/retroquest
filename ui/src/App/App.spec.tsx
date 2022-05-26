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
import { render, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

import { getThemeUserSettings, ThemeState } from '../State/ThemeState';
import Theme from '../Types/Theme';

import App from './App';

jest.mock('./Login/LoginPage', () => {
	return () => <div>Login Page</div>;
});

jest.mock('../Common/Modal/Modal', () => {
	return () => <div>Root Modal</div>;
});

describe('App', () => {
	describe('without local storage theme', () => {
		it('should default theme to dark if device prefers color scheme dark', async () => {
			(window.matchMedia as jest.Mock).mockReturnValue({ matches: true });

			render(
				<MemoryRouter>
					<RecoilRoot
						initializeState={({ set }) => {
							set(ThemeState, getThemeUserSettings());
						}}
					>
						<App />
					</RecoilRoot>
				</MemoryRouter>
			);

			await screen.findByText('Login Page');

			expect(window.matchMedia).toHaveBeenCalledWith(
				'(prefers-color-scheme:dark)'
			);
			expect(document.body.classList).toContain('dark-theme');
		});

		it('should default theme to light if device does not prefer dark', () => {
			(window.matchMedia as jest.Mock).mockReturnValue({ matches: false });

			render(
				<MemoryRouter>
					<RecoilRoot
						initializeState={({ set }) => {
							set(ThemeState, getThemeUserSettings());
						}}
					>
						<App />
					</RecoilRoot>
				</MemoryRouter>
			);

			expect(window.matchMedia).toHaveBeenCalledWith(
				'(prefers-color-scheme:dark)'
			);
			expect(document.body.classList).not.toContain('dark-theme');
		});
	});

	describe('with local storage theme', () => {
		it('should default theme to local storage value if set', () => {
			window.localStorage.setItem('theme', Theme.DARK);

			render(
				<MemoryRouter>
					<RecoilRoot
						initializeState={({ set }) => {
							set(ThemeState, getThemeUserSettings());
						}}
					>
						<App />
					</RecoilRoot>
				</MemoryRouter>
			);

			expect(document.body.classList).toContain('dark-theme');
		});
	});

	it('should include root modal', () => {
		render(
			<MemoryRouter>
				<RecoilRoot>
					<App />
				</RecoilRoot>
			</MemoryRouter>
		);
		screen.getByText('Root Modal');
	});
});
