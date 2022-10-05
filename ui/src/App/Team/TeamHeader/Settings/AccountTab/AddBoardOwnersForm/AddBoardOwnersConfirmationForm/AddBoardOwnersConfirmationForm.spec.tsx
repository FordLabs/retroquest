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
import userEvent from '@testing-library/user-event';
import { mockTeam } from 'Services/Api/__mocks__/TeamService';
import TeamService from 'Services/Api/TeamService';
import { ModalContents, ModalContentsState } from 'State/ModalContentsState';
import { TeamState } from 'State/TeamState';
import { RecoilObserver } from 'Utils/RecoilObserver';
import renderWithRecoilRoot from 'Utils/renderWithRecoilRoot';

import Settings, { SettingsTabs } from '../../../Settings';

import AddBoardOwnersConfirmationForm from './AddBoardOwnersConfirmationForm';

jest.mock('Services/Api/TeamService');

let modalContent: ModalContents | null;

describe('Add Board Owners Confirmation', () => {
	const team = {
		...mockTeam,
		email: '',
		secondaryEmail: '',
	};
	const primaryEmail = 'primary@mail.com';
	const secondaryEmail = 'secondary@mail.com';

	beforeEach(() => {
		modalContent = null;
	});

	it('should render team name based on global team data', () => {
		renderWithRecoilRoot(
			<AddBoardOwnersConfirmationForm email1="" />,
			({ set }) => {
				set(TeamState, team);
			}
		);

		expect(
			screen.getByText(
				`These emails will be the board owners for everyone at ${team.name}.`
			)
		).toBeInTheDocument();
	});

	it('should show first and second email passed in as props', () => {
		renderWithRecoilRoot(
			<AddBoardOwnersConfirmationForm
				email1="e@mail.com"
				email2="e2@mail.com"
			/>
		);
		renderAddBoardOwnersConfirmationForm(primaryEmail, secondaryEmail);

		expect(screen.getByText('e@mail.com')).toBeInTheDocument();
		expect(screen.getByText('e2@mail.com')).toBeInTheDocument();
	});

	it('should go back to the settings modal when clicking "Cancel"', async () => {
		renderAddBoardOwnersConfirmationForm(primaryEmail, secondaryEmail);

		expect(modalContent).not.toBeNull();

		userEvent.click(screen.getByText('Cancel'));

		await waitFor(() =>
			expect(modalContent).toEqual({
				title: 'Settings',
				component: (
					<Settings
						activeTab={SettingsTabs.ACCOUNT}
						accountTabData={{
							email1: primaryEmail,
							email2: secondaryEmail,
						}}
					/>
				),
			})
		);
		expect(TeamService.updateTeamEmailAddresses).not.toHaveBeenCalled();
	});

	it('should save both email addresses when clicking "Yes, Add Board Owners"', async () => {
		renderAddBoardOwnersConfirmationForm(primaryEmail, secondaryEmail);

		userEvent.click(screen.getByText('Yes, Add Board Owners'));

		await waitFor(() =>
			expect(TeamService.updateTeamEmailAddresses).toHaveBeenCalledWith(
				team.id,
				primaryEmail,
				secondaryEmail
			)
		);
		await waitFor(() =>
			expect(modalContent).toEqual({
				title: 'Settings',
				component: <Settings activeTab={SettingsTabs.ACCOUNT} />,
			})
		);
	});

	function renderAddBoardOwnersConfirmationForm(
		primaryEmail: string,
		secondaryEmail?: string
	) {
		renderWithRecoilRoot(
			<div>
				<RecoilObserver
					recoilState={ModalContentsState}
					onChange={(value: ModalContents) => {
						modalContent = value;
					}}
				/>
				<AddBoardOwnersConfirmationForm
					email1={primaryEmail}
					email2={secondaryEmail}
				/>
			</div>,
			({ set }) => {
				set(TeamState, team);
				set(ModalContentsState, {
					title: 'Dummy Title',
					component: <div></div>,
				});
			}
		);
	}
});
