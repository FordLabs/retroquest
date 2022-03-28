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
import userEvent from '@testing-library/user-event';
import { RecoilRoot } from 'recoil';

import {
	editTask,
	hitEscapeKey,
	typeAssignee,
} from '../../App/Team/Retro/ActionItemsColumn/ActionItem/ActionItem.spec';
import RetroItemWithAddAction from '../../App/Team/Retro/ThoughtColumn/RetroItemWithAddAction/RetroItemWithAddAction';
import { getMockThought } from '../../Services/Api/__mocks__/ThoughtService';
import ActionItemService from '../../Services/Api/ActionItemService';
import ThoughtService from '../../Services/Api/ThoughtService';
import {
	ModalContents,
	ModalContentsState,
} from '../../State/ModalContentsState';
import { TeamState } from '../../State/TeamState';
import Team from '../../Types/Team';
import Topic from '../../Types/Topic';
import { RecoilObserver } from '../../Utils/RecoilObserver';

import AddActionItem from './AddActionItem';

jest.mock('../../Services/Api/ActionItemService');
jest.mock('../../Services/Api/ThoughtService');

describe('AddActionItem', () => {
	const hideComponentCallback = jest.fn();
	const team: Team = {
		name: 'My Team',
		id: 'my-team',
	};
	let modalContent: ModalContents | null;
	const thought = getMockThought(Topic.HAPPY);

	beforeEach(() => {
		jest.clearAllMocks();

		modalContent = null;

		render(
			<RecoilRoot
				initializeState={({ set }) => {
					set(TeamState, team);
					set(ModalContentsState, {
						title: 'Action Item',
						component: (
							<RetroItemWithAddAction thought={thought} type={thought.topic} />
						),
					});
				}}
			>
				<RecoilObserver
					recoilState={ModalContentsState}
					onChange={(value: ModalContents) => {
						modalContent = value;
					}}
				/>
				<AddActionItem
					hideComponentCallback={hideComponentCallback}
					thought={thought}
				/>
			</RecoilRoot>
		);
	});

	it('should cancel on escape and discard', () => {
		hitEscapeKey();
		clickDiscard();

		expect(hideComponentCallback).toHaveBeenCalledTimes(2);
		expect(ActionItemService.create).not.toHaveBeenCalled();
	});

	it('should create action item, mark associated thought as discussed, and close modal', async () => {
		const task = 'Run this test';
		const assignee = 'jest';
		editTask(task);
		typeAssignee(assignee);
		clickCreate();

		await act(async () =>
			expect(ActionItemService.create).toHaveBeenCalledWith(
				team.id,
				task,
				assignee
			)
		);
		expect(ThoughtService.updateDiscussionStatus).toHaveBeenCalledWith(
			team.id,
			thought.id,
			true
		);
		await waitFor(() => expect(modalContent).toBeNull());
	});

	it('should shake and not call onConfirm when task is empty', () => {
		typeAssignee('jest');
		clickCreate();

		expect(hideComponentCallback).not.toHaveBeenCalled();
		expect(ActionItemService.create).not.toHaveBeenCalled();
		expect(screen.getByTestId('addActionItem').className).toContain('shake');
	});
});

function clickDiscard() {
	userEvent.click(screen.getByText('Discard'));
}

function clickCreate() {
	userEvent.click(screen.getByText('Create', { exact: false }));
}
