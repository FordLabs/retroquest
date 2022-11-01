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
import DeleteActionItemConfirmation from 'App/Team/Archives/ActionItemArchives/DeleteActionItemConfirmation/DeleteActionItemConfirmation';
import { getMockActionItem } from 'Services/Api/__mocks__/ActionItemService';
import { ModalContents, ModalContentsState } from 'State/ModalContentsState';
import { TeamState } from 'State/TeamState';
import Team from 'Types/Team';
import { RecoilObserver } from 'Utils/RecoilObserver';
import renderWithRecoilRoot from 'Utils/renderWithRecoilRoot';

import ArchivedActionItem from './ArchivedActionItem';

jest.mock('Services/Api/ActionItemService');

describe('Archived Action Item', () => {
	let modalContent: ModalContents | null;

	const team: Team = {
		id: 'team-name',
		name: 'Team Name',
		email: 'a@b.c',
		secondaryEmail: '',
	};
	const actionItem = getMockActionItem();

	it('should delete action item', async () => {
		const onActionItemDeletion = jest.fn();
		renderWithRecoilRoot(
			<>
				<RecoilObserver
					recoilState={ModalContentsState}
					onChange={(value: ModalContents) => {
						modalContent = value;
					}}
				/>
				<ArchivedActionItem
					actionItem={actionItem}
					onActionItemDeletion={onActionItemDeletion}
				/>
			</>,
			({ set }) => {
				set(TeamState, team);
			}
		);
		screen.getByText('Delete').click();

		await waitFor(() =>
			expect(modalContent).toEqual({
				title: 'Delete Action Item?',
				component: (
					<DeleteActionItemConfirmation
						actionItemId={actionItem.id}
						onActionItemDeletion={onActionItemDeletion}
					/>
				),
			})
		);
	});
});
