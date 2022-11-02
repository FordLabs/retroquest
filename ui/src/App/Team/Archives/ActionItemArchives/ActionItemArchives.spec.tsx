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
import moment from 'moment';
import { mockTeam } from 'Services/Api/__mocks__/TeamService';
import ActionItemService from 'Services/Api/ActionItemService';
import { ModalContents, ModalContentsState } from 'State/ModalContentsState';
import { TeamState } from 'State/TeamState';
import { RecoilObserver } from 'Utils/RecoilObserver';
import renderWithRecoilRoot from 'Utils/renderWithRecoilRoot';

import DeleteMultipleActionItemsConfirmation from './DeleteMultipleActionItemsConfirmation/DeleteMultipleActionItemsConfirmation';
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
	{
		id: 3,
		task: 'Take another action',
		completed: true,
		assignee: 'Jen',
		dateCreated: '2022-08-20',
		archived: true,
	},
];
let modalContent: ModalContents | null;

describe('Action Item Archives', () => {
	beforeEach(() => {
		modalContent = null;
		ActionItemService.get = jest.fn().mockResolvedValue(archivedActionItems);
	});

	it('should get archived action items and display them on page', async () => {
		await renderActionItemArchives();
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

	it('should show "No Archives" message when no archived action items are present', async () => {
		ActionItemService.get = jest.fn().mockResolvedValue([]);

		await renderActionItemArchives();

		screen.getByText('No archives were found.');
		const description = screen.getByTestId('notFoundSectionDescription');
		expect(description.innerHTML).toBe(
			'Archives will appear when retros are ended with <span class="bold">completed action items</span>.'
		);
	});

	it('should only show "Delete Selected" button once an action item has been clicked', async () => {
		await renderActionItemArchives();
		expect(screen.queryByText('Delete Selected')).toBeNull();
		screen.getAllByTestId('checkboxButton')[0].click();
		expect(screen.getByText('Delete Selected')).toBeDefined();
	});

	it('should select and open confirmation modal to delete multiple action items at a time', async () => {
		await renderActionItemArchives();

		const checkboxes = screen.getAllByTestId('checkboxButton');
		expect(checkboxes).toHaveLength(3);
		checkboxes[0].click();
		checkboxes[1].click();

		screen.getByText('Delete Selected').click();

		const expectedActionItemIds: number[] = [
			archivedActionItems[0].id,
			archivedActionItems[1].id,
		];
		await waitFor(() =>
			expect(JSON.stringify(modalContent)).toEqual(
				JSON.stringify(getExpectedModalContents(expectedActionItemIds))
			)
		);
	});

	it('should select and unselect action items and only ask for confirmation to delete selected items', async () => {
		await renderActionItemArchives();

		const checkboxes = screen.getAllByTestId('checkboxButton');
		expect(checkboxes).toHaveLength(3);
		checkboxes[0].click();
		checkboxes[1].click();
		checkboxes[1].click();

		screen.getByText('Delete Selected').click();

		const expectedActionItemIds: number[] = [archivedActionItems[0].id];
		await waitFor(() =>
			expect(JSON.stringify(modalContent)).toEqual(
				JSON.stringify(getExpectedModalContents(expectedActionItemIds))
			)
		);
	});
});

function getExpectedModalContents(actionItemIds: number[]) {
	return {
		title: 'Delete Selected Items?',
		component: (
			<DeleteMultipleActionItemsConfirmation
				actionItemIds={actionItemIds}
				onActionItemDeletion={() => {}}
			/>
		),
	};
}

async function renderActionItemArchives() {
	renderWithRecoilRoot(
		<>
			<RecoilObserver
				recoilState={ModalContentsState}
				onChange={(value: ModalContents) => {
					modalContent = value;
				}}
			/>
			<ActionItemArchives />
		</>,
		({ set }) => {
			set(TeamState, mockTeam);
		}
	);

	await waitFor(() =>
		expect(ActionItemService.get).toHaveBeenCalledWith(mockTeam.id, true)
	);
}
