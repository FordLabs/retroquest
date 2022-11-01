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
import { screen } from '@testing-library/react';
import { MutableSnapshot } from 'recoil';
import { ThemeState } from 'State/ThemeState';
import Theme from 'Types/Theme';
import renderWithRecoilRoot from 'Utils/renderWithRecoilRoot';

import PageNotFoundPage from './PageNotFoundPage';

jest.mock('Services/Api/ContributorsService');
jest.mock('Services/Api/TeamService');
jest.mock('Services/Api/EmailResetTokenService');

describe('Page Not Found Page', () => {
	it('should render header and link to login page', () => {
		renderPageNotFoundPage();
		expect(screen.getByText('Oops!')).toBeDefined();
		const returnToLoginLink = screen.getByText('Return to Login');
		expect(returnToLoginLink).toBeDefined();
		expect(returnToLoginLink).toHaveAttribute('href', '/login');
	});

	it('should render sad browser sign icon as red in light mode', () => {
		renderPageNotFoundPage(({ set }) => {
			set(ThemeState, Theme.LIGHT);
		});

		const sadBrowserIcon = screen.getAllByTestId('sadBrowserIconPath');
		sadBrowserIcon.forEach((icon) => {
			expect(icon.getAttribute('fill')).toBe('#e74c3c');
		});
	});

	it('should render checkbox in confirmation screen as light turquoise in dark mode', () => {
		renderPageNotFoundPage(({ set }) => {
			set(ThemeState, Theme.DARK);
		});

		const sadBrowserIcon = screen.getAllByTestId('sadBrowserIconPath');
		sadBrowserIcon.forEach((icon) => {
			expect(icon.getAttribute('fill')).toBe('#ef8a7e');
		});
	});

	it('should not show code contributors section', async () => {
		renderPageNotFoundPage();
		expect(screen.queryByText('Code Contributors')).toBeNull();
	});
});

function renderPageNotFoundPage(
	recoilState?: (mutableSnapshot: MutableSnapshot) => void
) {
	renderWithRecoilRoot(
		<MemoryRouter>
			<PageNotFoundPage />
		</MemoryRouter>,
		recoilState
	);
}
