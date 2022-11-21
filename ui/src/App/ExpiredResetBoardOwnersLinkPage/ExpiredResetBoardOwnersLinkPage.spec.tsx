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
import { render, screen, waitFor } from '@testing-library/react';
import ContributorsService from 'Services/Api/ContributorsService';
import EmailResetTokenService from 'Services/Api/EmailResetTokenService';

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
});

async function renderExpiredLinkPage() {
	render(
		<MemoryRouter>
			<ExpiredResetBoardOwnersLinkPage />
		</MemoryRouter>
	);

	await waitFor(() => expect(ContributorsService.get).toBeCalledTimes(1));
}
