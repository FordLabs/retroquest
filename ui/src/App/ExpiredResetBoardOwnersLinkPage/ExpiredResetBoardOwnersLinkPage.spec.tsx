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
import { MutableSnapshot } from 'recoil';
import ContributorsService from 'Services/Api/ContributorsService';
import EmailResetTokenService from 'Services/Api/EmailResetTokenService';
import { ThemeState } from 'State/ThemeState';
import Theme from 'Types/Theme';
import renderWithRecoilRoot from 'Utils/renderWithRecoilRoot';

import ExpiredResetBoardOwnersLinkPage from './ExpiredResetBoardOwnersLinkPage';

jest.mock('Services/Api/ContributorsService');
jest.mock('Services/Api/TeamService');
jest.mock('Services/Api/EmailResetTokenService');

describe('Expired Reset Board Owners Link Page', () => {
	it('should render header and link to login page', async () => {
		await renderExpiredLinkPage();
		expect(screen.getByText('Expired Link')).toBeDefined();
		const returnToLoginLink = screen.getByText('Return to Login');
		expect(returnToLoginLink).toBeDefined();
		expect(returnToLoginLink).toHaveAttribute('href', '/login');
	});

	it('should show token lifetime in page description', async () => {
		EmailResetTokenService.getResetTokenLifetime = jest
			.fn()
			.mockResolvedValue(600);
		await renderExpiredLinkPage();
		await waitFor(() =>
			expect(EmailResetTokenService.getResetTokenLifetime).toHaveBeenCalled()
		);
		expect(
			screen.getByText(
				'For your safety, our board owner reset link is only valid for 10 minutes.'
			)
		).toBeDefined();
	});

	it('should render error stop sign icon in confirmation screen as red in light mode', async () => {
		await renderExpiredLinkPage(({ set }) => {
			set(ThemeState, Theme.LIGHT);
		});

		const errorStopSignIcon = await screen.findByTestId('errorStopSignIcon');
		expect(errorStopSignIcon.getAttribute('fill')).toBe('#e74c3c');
	});

	it('should render checkbox in confirmation screen as light turquoise in dark mode', async () => {
		await renderExpiredLinkPage(({ set }) => {
			set(ThemeState, Theme.DARK);
		});

		const errorStopSignIcon = await screen.findByTestId('errorStopSignIcon');
		expect(errorStopSignIcon.getAttribute('fill')).toBe('#c0392b');
	});
});

async function renderExpiredLinkPage(
	recoilState?: (mutableSnapshot: MutableSnapshot) => void
) {
	renderWithRecoilRoot(
		<MemoryRouter>
			<ExpiredResetBoardOwnersLinkPage />
		</MemoryRouter>,
		recoilState
	);

	await waitFor(() => expect(ContributorsService.get).toBeCalledTimes(1));
}