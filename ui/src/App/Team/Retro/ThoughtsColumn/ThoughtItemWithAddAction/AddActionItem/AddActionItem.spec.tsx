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
import { mockTeam } from 'Services/Api/__mocks__/TeamService';
import { getMockThought } from 'Services/Api/__mocks__/ThoughtService';
import ActionItemService from 'Services/Api/ActionItemService';
import ThoughtService from 'Services/Api/ThoughtService';
import { ModalContents, ModalContentsState } from 'State/ModalContentsState';
import { TeamState } from 'State/TeamState';
import { ThoughtsState } from 'State/ThoughtsState';
import Topic from 'Types/Topic';
import { RecoilObserver } from 'Utils/RecoilObserver';

import ThoughtItemWithAddAction from '../ThoughtItemWithAddAction';

import AddActionItem from './AddActionItem';

jest.mock('Services/Api/ActionItemService');
jest.mock('Services/Api/ThoughtService');

describe('Add Action Item', () => {
	const hideComponentCallback = jest.fn();
	let modalContent: ModalContents | null;
	const thought = getMockThought(1);

	beforeEach(() => {
		jest.clearAllMocks();

		modalContent = null;

		render(
			<RecoilRoot
				initializeState={({ set }) => {
					set(TeamState, mockTeam);
					set(ThoughtsState, [thought]);
					set(ModalContentsState, {
						title: 'Action Item',
						component: (
							<ThoughtItemWithAddAction
								thoughtId={thought.id}
								type={Topic.HAPPY}
							/>
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
					thoughtId={thought.id}
				/>
			</RecoilRoot>
		);
	});

	it('should hide component when user presses the escape key', () => {
		userEvent.type(document.body, '{Escape}');
		expect(hideComponentCallback).toHaveBeenCalledTimes(1);
		expect(ActionItemService.create).not.toHaveBeenCalled();
	});

	it('should hide component when user clicks the discard button', () => {
		clickDiscard();
		expect(hideComponentCallback).toHaveBeenCalledTimes(1);
		expect(ActionItemService.create).not.toHaveBeenCalled();
	});

	it('should create action item, mark associated thought as discussed, and close modal', async () => {
		const task = 'Run this test';
		const assignee = 'jest';
		editActionItemTask(task);
		editActionItemAssignee(assignee);
		clickCreate();

		await act(async () =>
			expect(ActionItemService.create).toHaveBeenCalledWith(
				mockTeam.id,
				task,
				assignee
			)
		);
		expect(ThoughtService.updateDiscussionStatus).toHaveBeenCalledWith(
			mockTeam.id,
			thought.id,
			true
		);
		await waitFor(() => expect(modalContent).toBeNull());
	});

	it('should shake and not call onConfirm when task is empty', () => {
		editActionItemAssignee('jest');
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
	userEvent.click(screen.getByText('Add to Action Items', { exact: false }));
}

function editActionItemTask(text: string) {
	const taskTextarea = screen.getByTestId(
		'textareaField'
	) as HTMLTextAreaElement;
	taskTextarea.select();
	userEvent.type(taskTextarea, text);
}

function editActionItemAssignee(text: string) {
	const assigneeInput = screen.getByTestId('assigneeInput');
	userEvent.type(assigneeInput, `{selectall}${text}`);
}
