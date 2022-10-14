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
import { screen, waitFor } from '@testing-library/react';
import { mockTeam } from 'Services/Api/__mocks__/TeamService';
import EmailService from 'Services/Api/EmailService';
import { ModalContents, ModalContentsState } from 'State/ModalContentsState';
import { TeamState } from 'State/TeamState';
import Team from 'Types/Team';
import { RecoilObserver } from 'Utils/RecoilObserver';
import renderWithRecoilRoot from 'Utils/renderWithRecoilRoot';

import EmailSentConfirmation from './EmailSentConfirmation/EmailSentConfirmation';
import BoardOwnersForm from './BoardOwnersForm';

jest.mock('Services/Api/EmailService');

let modalContent: ModalContents | null;

describe('Board Owners Form', () => {
	beforeEach(() => {
		modalContent = null;
	});

	it('should render current board owner email addresses', () => {
		renderBoardOwnersForm(mockTeam);
		expect(screen.getByText('a@b.c')).toBeInTheDocument();
		expect(screen.getByText('d@e.f')).toBeInTheDocument();
	});

	it('should render section titles', () => {
		renderWithRecoilRoot(<BoardOwnersForm />);
		expect(screen.getByText('Change Board Owners')).toBeInTheDocument();
		expect(screen.getByText('Reset Password')).toBeInTheDocument();
	});

	describe('Reset Password Section', () => {
		it('should send email to all present team emails when user clicks reset password link', async () => {
			renderBoardOwnersForm(mockTeam);
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
			renderBoardOwnersForm({ ...mockTeam, secondaryEmail: '' });
			getSendPasswordEmailButton().click();
			await waitFor(() =>
				expect(EmailService.sendPasswordResetEmail).toHaveBeenCalledTimes(1)
			);
			expect(EmailService.sendPasswordResetEmail).toHaveBeenCalledWith(
				mockTeam.name,
				mockTeam.email
			);
		});

		describe('should show password reset email sent confirmation after successful submission', () => {
			it('and message should include 2 email addresses', async () => {
				renderBoardOwnersForm(mockTeam);
				getSendPasswordEmailButton().click();
				await waitFor(() =>
					expect(modalContent).toEqual({
						title: 'Check your Mail!',
						component: (
							<EmailSentConfirmation paragraph1="We’ve sent an email to a@b.c and d@e.f with password reset instructions." />
						),
					})
				);
			});

			it('and message should include 1 email address', async () => {
				renderBoardOwnersForm({ ...mockTeam, secondaryEmail: '' });
				getSendPasswordEmailButton().click();
				await waitFor(() =>
					expect(modalContent).toEqual({
						title: 'Check your Mail!',
						component: (
							<EmailSentConfirmation paragraph1="We’ve sent an email to a@b.c with password reset instructions." />
						),
					})
				);
			});
		});
	});

	describe('Change Board Owners Section', () => {
		it('should send email to all present team emails when user clicks change board owners link', async () => {
			renderBoardOwnersForm(mockTeam);
			getSendBoardOwnerEmailButton().click();
			await waitFor(() =>
				expect(EmailService.sendBoardOwnersResetEmail).toHaveBeenCalledTimes(2)
			);
			expect(EmailService.sendBoardOwnersResetEmail).toHaveBeenCalledWith(
				mockTeam.name,
				mockTeam.email
			);
			expect(EmailService.sendBoardOwnersResetEmail).toHaveBeenCalledWith(
				mockTeam.name,
				mockTeam.secondaryEmail
			);
		});

		it('should send email to one team email when user clicks change board owners link', async () => {
			renderBoardOwnersForm({ ...mockTeam, secondaryEmail: '' });
			getSendBoardOwnerEmailButton().click();
			await waitFor(() =>
				expect(EmailService.sendBoardOwnersResetEmail).toHaveBeenCalledTimes(1)
			);
			expect(EmailService.sendBoardOwnersResetEmail).toHaveBeenCalledWith(
				mockTeam.name,
				mockTeam.email
			);
		});

		describe('should show board owners email sent confirmation after successful submission', () => {
			it('and message should include 2 email addresses', async () => {
				renderBoardOwnersForm(mockTeam);
				getSendBoardOwnerEmailButton().click();
				await waitFor(() =>
					expect(modalContent).toEqual({
						title: 'Check your Mail!',
						component: (
							<EmailSentConfirmation paragraph1="We’ve sent an email to a@b.c and d@e.f with instructions on how to change the Board Owner email addresses." />
						),
					})
				);
			});

			it('and message should include 1 email address', async () => {
				renderBoardOwnersForm({ ...mockTeam, secondaryEmail: '' });
				getSendBoardOwnerEmailButton().click();
				await waitFor(() =>
					expect(modalContent).toEqual({
						title: 'Check your Mail!',
						component: (
							<EmailSentConfirmation paragraph1="We’ve sent an email to a@b.c with instructions on how to change the Board Owner email addresses." />
						),
					})
				);
			});
		});
	});
});

function getSendPasswordEmailButton() {
	return screen.getByText('Send Password Reset Link');
}

function getSendBoardOwnerEmailButton() {
	return screen.getByText('Send Board Owner Update Link');
}

function renderBoardOwnersForm(team: Team) {
	renderWithRecoilRoot(
		<>
			<RecoilObserver
				recoilState={ModalContentsState}
				onChange={(value: ModalContents) => {
					modalContent = value;
				}}
			/>
			<BoardOwnersForm />
		</>,
		({ set }) => {
			set(TeamState, team);
		}
	);
}
