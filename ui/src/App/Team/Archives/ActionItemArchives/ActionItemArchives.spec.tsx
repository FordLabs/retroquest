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
import moment from 'moment';
import { RecoilRoot } from 'recoil';
import { mockTeam } from 'Services/Api/__mocks__/TeamService';
import ActionItemService from 'Services/Api/ActionItemService';
import { TeamState } from 'State/TeamState';

import ActionItemArchives from './ActionItemArchives';

jest.mock('Services/Api/ActionItemService');

const archivedActionItems = [
	{
		id: 1,
		task: 'Make it better',
		completed: true,
		assignee: 'Ginnie',
		dateCreated: '2022-01-20',
		archived: true,
	},
	{
		id: 2,
		task: 'Take action',
		completed: true,
		assignee: 'Georgia',
		dateCreated: '2022-03-20',
		archived: true,
	},
];

describe('Action Item Archives', () => {
	it('should get archived action items and display them on page', async () => {
		ActionItemService.get = jest.fn().mockResolvedValue(archivedActionItems);

		render(
			<RecoilRoot
				initializeState={({ set }) => {
					set(TeamState, mockTeam);
				}}
			>
				<ActionItemArchives />
			</RecoilRoot>
		);

		await waitFor(() =>
			expect(ActionItemService.get).toHaveBeenCalledWith(mockTeam.id, true)
		);
		expect(screen.getByText('Action Item Archives')).toBeDefined();

		const expectedFirstActionItem = archivedActionItems[0];
		expect(screen.getByText(expectedFirstActionItem.task)).toBeDefined();
		expect(
			screen.getByDisplayValue(expectedFirstActionItem.assignee)
		).toBeDefined();
		expect(
			screen.getByText(
				moment(expectedFirstActionItem.dateCreated).format('MMM Do')
			)
		).toBeDefined();

		const expectedSecondActionItem = archivedActionItems[1];
		expect(screen.getByText(expectedSecondActionItem.task)).toBeDefined();
		expect(
			screen.getByDisplayValue(expectedSecondActionItem.assignee)
		).toBeDefined();
		expect(
			screen.getByText(
				moment(expectedSecondActionItem.dateCreated).format('MMM Do')
			)
		).toBeDefined();
	});

	it('should show "No Archives" message when no archived action items are present', () => {
		ActionItemService.get = jest.fn().mockResolvedValue([]);

		render(
			<RecoilRoot>
				<ActionItemArchives />
			</RecoilRoot>
		);

		screen.getByText('No archives were found.');
		const description = screen.getByTestId('notFoundSectionDescription');
		expect(description.innerHTML).toBe(
			'Archives will appear when retros are ended with <span class="bold">completed action items</span>.'
		);
	});
});
