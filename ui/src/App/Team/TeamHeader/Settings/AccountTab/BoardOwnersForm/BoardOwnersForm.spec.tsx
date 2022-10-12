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

import { screen, waitFor } from '@testing-library/react';
import { mockTeam } from 'Services/Api/__mocks__/TeamService';
import EmailService from 'Services/Api/EmailService';
import { TeamState } from 'State/TeamState';
import renderWithRecoilRoot from 'Utils/renderWithRecoilRoot';

import BoardOwnersForm from './BoardOwnersForm';

jest.mock('Services/Api/EmailService');

describe('Board Owners Form', () => {
	it('should render current board owner email addresses', () => {
		renderWithRecoilRoot(<BoardOwnersForm />, ({ set }) => {
			set(TeamState, mockTeam);
		});
		expect(screen.getByText('a@b.c')).toBeInTheDocument();
		expect(screen.getByText('d@e.f')).toBeInTheDocument();
	});

	it('should render section titles', () => {
		renderWithRecoilRoot(<BoardOwnersForm />);
		expect(screen.getByText('Change Board Owners')).toBeInTheDocument();
		expect(screen.getByText('Reset Password')).toBeInTheDocument();
	});

	it('should send email to all present team emails when user clicks reset password link', async () => {
		renderWithRecoilRoot(<BoardOwnersForm />, ({ set }) => {
			set(TeamState, mockTeam);
		});
		getSendPasswordEmailButton().click();
		await waitFor(() =>
			expect(EmailService.sendPasswordResetEmail).toHaveBeenCalledTimes(2)
		);
		expect(EmailService.sendPasswordResetEmail).toHaveBeenCalledWith(
			mockTeam.name,
			mockTeam.email
		);
		expect(EmailService.sendPasswordResetEmail).toHaveBeenCalledWith(
			mockTeam.name,
			mockTeam.secondaryEmail
		);
	});

	it('should send email to one team email when user clicks reset password link', async () => {
		renderWithRecoilRoot(<BoardOwnersForm />, ({ set }) => {
			set(TeamState, { ...mockTeam, secondaryEmail: '' });
		});
		getSendPasswordEmailButton().click();
		await waitFor(() =>
			expect(EmailService.sendPasswordResetEmail).toHaveBeenCalledTimes(1)
		);
		expect(EmailService.sendPasswordResetEmail).toHaveBeenCalledWith(
			mockTeam.name,
			mockTeam.email
		);
	});

	it('should send email to all present team emails when user clicks change board owners link', () => {
		renderWithRecoilRoot(<BoardOwnersForm />, ({ set }) => {
			set(TeamState, mockTeam);
		});
		getSendBoardOwnerEmailButton().click();
		expect(EmailService.sendBoardOwnersResetEmail).toHaveBeenCalledTimes(2);
		expect(EmailService.sendBoardOwnersResetEmail).toHaveBeenCalledWith(
			mockTeam.name,
			mockTeam.email
		);
		expect(EmailService.sendBoardOwnersResetEmail).toHaveBeenCalledWith(
			mockTeam.name,
			mockTeam.secondaryEmail
		);
	});

	it('should send email to one team email when user clicks change board owners link', () => {
		renderWithRecoilRoot(<BoardOwnersForm />, ({ set }) => {
			set(TeamState, { ...mockTeam, secondaryEmail: '' });
		});
		getSendBoardOwnerEmailButton().click();
		expect(EmailService.sendBoardOwnersResetEmail).toHaveBeenCalledTimes(1);
		expect(EmailService.sendBoardOwnersResetEmail).toHaveBeenCalledWith(
			mockTeam.name,
			mockTeam.email
		);
	});
});

function getSendPasswordEmailButton() {
	return screen.getByText('Send Reset Link');
}

function getSendBoardOwnerEmailButton() {
	return screen.getByText('Send Update Email');
}
