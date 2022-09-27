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
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fileSaver from 'file-saver';
import { RecoilRoot } from 'recoil';
import TeamService from 'Services/Api/TeamService';
import { ModalContents, ModalContentsState } from 'State/ModalContentsState';
import { TeamState } from 'State/TeamState';
import Team from 'Types/Team';
import { RecoilObserver } from 'Utils/RecoilObserver';

import ArchiveRetroConfirmation from './ArchiveRetroConfirmation/ArchiveRetroConfirmation';
import FeedbackForm from './FeedbackForm/FeedbackForm';
import RetroSubheader from './RetroSubheader';

const mockLogout = jest.fn();

jest.mock('Hooks/useAuth', () => {
	return jest.fn(() => ({
		logout: mockLogout,
	}));
});
jest.mock('Services/Api/TeamService');
jest.mock('file-saver');

const team: Team = {
	name: 'My Team',
	id: 'my-team',
};

describe('Retro Subheader', () => {
	const mockCSVString = 'column 1, column 2';
	let modalContent: ModalContents | null;

	beforeEach(() => {
		modalContent = null;

		TeamService.getCSV = jest.fn().mockResolvedValue(mockCSVString);

		render(
			<RecoilRoot
				initializeState={({ set }) => {
					set(TeamState, team);
				}}
			>
				<RecoilObserver
					recoilState={ModalContentsState}
					onChange={(value: ModalContents) => {
						modalContent = value;
					}}
				/>
				<RetroSubheader />
			</RecoilRoot>
		);
	});

	describe('Timer', () => {
		it('should show timer', () => {
			expect(screen.getByText('05:00')).toBeDefined();
		});
	});

	describe('Feedback Button', () => {
		it('should open give feedback modal', async () => {
			const modalText = 'How can we improve RetroQuest?';
			expect(screen.queryByText(modalText)).toBeNull();

			const feedbackButton = screen.getByText('Give Feedback');
			feedbackButton.click();
			await waitFor(() =>
				expect(modalContent).toEqual({
					component: <FeedbackForm />,
					title: 'Feedback',
				})
			);
		});
	});

	describe('Download CSV Button', () => {
		it('should call to download csv', async () => {
			const downloadCSVButton = screen.getByText('Download CSV');
			downloadCSVButton.click();
			expect(TeamService.getCSV).toHaveBeenCalledWith(team.id);
			await waitFor(() =>
				expect(fileSaver.saveAs).toHaveBeenCalledWith(
					mockCSVString,
					'my-team-board.csv'
				)
			);
		});
	});

	describe('Log Out Button', () => {
		it('should logout', () => {
			userEvent.click(screen.getByText('Log Out'));

			expect(mockLogout).toHaveBeenCalledTimes(1);
			expect(modalContent).toBeNull();
		});
	});

	describe('Archive Retro Button', () => {
		it('should archive retro', async () => {
			const archiveRetro = screen.getByText('Archive Retro');
			archiveRetro.click();
			await waitFor(() =>
				expect(modalContent).toEqual({
					component: <ArchiveRetroConfirmation />,
					title: 'Archive Retro',
				})
			);
		});
	});
});
