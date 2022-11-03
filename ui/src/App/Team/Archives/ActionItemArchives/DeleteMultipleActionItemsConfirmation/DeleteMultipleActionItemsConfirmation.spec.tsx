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
import { RecoilRoot } from 'recoil';
import { mockTeam } from 'Services/Api/__mocks__/TeamService';
import ActionItemService from 'Services/Api/ActionItemService';
import { ModalContents, ModalContentsState } from 'State/ModalContentsState';
import { TeamState } from 'State/TeamState';
import { RecoilObserver } from 'Utils/RecoilObserver';

import DeleteMultipleActionItemsConfirmation from './DeleteMultipleActionItemsConfirmation';

jest.mock('Services/Api/ActionItemService');

describe('Delete Multiple Action Items Confirmation', () => {
	let modalContent: ModalContents | null;
	let onActionItemDeletion: jest.Mock<any, any>;
	const actionItemIdsToDelete: number[] = [8432, 2343, 2577, 2333];

	beforeEach(() => {
		jest.clearAllMocks();

		modalContent = null;
		onActionItemDeletion = jest.fn();

		render(
			<RecoilRoot
				initializeState={({ set }) => {
					set(TeamState, mockTeam);
					set(ModalContentsState, {
						title: 'Title',
						component: <>component</>,
					});
				}}
			>
				<RecoilObserver
					recoilState={ModalContentsState}
					onChange={(value: ModalContents) => {
						modalContent = value;
					}}
				/>
				<DeleteMultipleActionItemsConfirmation
					actionItemIds={actionItemIdsToDelete}
					onActionItemDeletion={onActionItemDeletion}
				/>
			</RecoilRoot>
		);
	});

	it('should ask user if they want to delete multiple archived action items', () => {
		expect(screen.getByText('Delete Selected Items?')).toBeInTheDocument();
	});

	it('should delete action items and close modal', async () => {
		userEvent.click(screen.getByText('Yes, Delete'));

		await waitFor(() =>
			expect(ActionItemService.deleteMultiple).toHaveBeenCalledWith(
				mockTeam.id,
				actionItemIdsToDelete
			)
		);
		expect(onActionItemDeletion).toHaveBeenCalled();
		expect(modalContent).toBe(null);
	});

	it('should cancel deleting of an action item', () => {
		userEvent.click(screen.getByText('Cancel'));

		expect(ActionItemService.deleteMultiple).not.toHaveBeenCalled();
		expect(onActionItemDeletion).not.toHaveBeenCalled();
		expect(modalContent).toBe(null);
	});
});
