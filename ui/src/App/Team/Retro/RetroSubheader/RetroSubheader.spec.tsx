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

import * as React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import fileSaver from 'file-saver';
import { RecoilRoot } from 'recoil';

import TeamService from '../../../../Services/Api/TeamService';
import { TeamState } from '../../../../State/TeamState';
import Team from '../../../../Types/Team';

import RetroSubheader from './RetroSubheader';

jest.mock('../../../../Services/Api/TeamService');
jest.mock('file-saver');

const team: Team = {
	name: 'My Team',
	id: 'my-team',
};

describe('Retro Subheader', () => {
	const mockCSVString = 'column 1, column 2';

	beforeEach(() => {
		TeamService.getCSV = jest.fn().mockResolvedValue(mockCSVString);

		render(
			<RecoilRoot
				initializeState={({ set }) => {
					set(TeamState, team);
				}}
			>
				<RetroSubheader />
			</RecoilRoot>
		);
	});

	describe('Feedback Button', () => {
		it('should open give feedback modal', async () => {
			const modalText = 'How can we improve RetroQuest?';
			expect(screen.queryByText(modalText)).toBeNull();

			const feedbackButton = screen.getByText('Give Feedback');
			feedbackButton.click();
			await act(async () => expect(screen.getByText(modalText)).toBeDefined());
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
});
