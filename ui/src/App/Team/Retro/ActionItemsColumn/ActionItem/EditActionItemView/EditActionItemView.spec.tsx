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
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { getMockActionItem } from 'Services/Api/__mocks__/ActionItemService';
import { mockTeam } from 'Services/Api/__mocks__/TeamService';
import ActionItemService from 'Services/Api/ActionItemService';
import { ActionItemState } from 'State/ActionItemState';
import { TeamState } from 'State/TeamState';
import Action from 'Types/Action';
import renderWithRecoilRoot from 'Utils/renderWithRecoilRoot';

import { ActionItemViewState } from '../ActionItem';

import EditActionItemView from './EditActionItemView';

jest.mock('Services/Api/ActionItemService');

describe('Edit Action Item View', () => {
	const mockSetViewState = jest.fn();
	let container: string | Element;
	const fakeActionItem: Action = getMockActionItem();

	beforeEach(() => {
		({ container } = renderWithRecoilRoot(
			<EditActionItemView
				actionItem={fakeActionItem}
				setViewState={mockSetViewState}
			/>,
			({ set }) => {
				set(TeamState, mockTeam);
				set(ActionItemState, [fakeActionItem]);
			}
		));
	});

	it('should render without axe errors', async () => {
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});

	it('should cancel editing action item on escape', () => {
		const newActionItemTask = 'New Fake Text';
		editActionItemTask(newActionItemTask);
		expect(getTextarea()).toHaveValue(newActionItemTask);

		userEvent.type(document.body, '{Escape}');
		expect(mockSetViewState).toHaveBeenCalledWith(ActionItemViewState.DEFAULT);
		expect(ActionItemService.updateTask).not.toHaveBeenCalled();
	});

	it('should cancel editing action item on cancel button click', () => {
		const newActionItemTask = 'New Fake Text';
		editActionItemTask(newActionItemTask);
		expect(getTextarea()).toHaveValue(newActionItemTask);

		screen.getByText('Cancel').click();
		expect(mockSetViewState).toHaveBeenCalledWith(ActionItemViewState.DEFAULT);
		expect(ActionItemService.updateTask).not.toHaveBeenCalled();
	});

	it('should edit action item task and save on enter', () => {
		const updatedText = 'New Fake Text';
		editActionItemTask(`${updatedText}{Enter}`);
		expect(ActionItemService.updateTask).toHaveBeenCalledWith(
			mockTeam.id,
			fakeActionItem.id,
			updatedText
		);
		expect(mockSetViewState).toHaveBeenCalledWith(ActionItemViewState.DEFAULT);
	});

	it('should edit action item task and save on save button click', () => {
		const updatedText = 'Save Me!';
		editActionItemTask(updatedText);
		screen.getByText('Save!').click();
		expect(ActionItemService.updateTask).toHaveBeenCalledWith(
			mockTeam.id,
			fakeActionItem.id,
			updatedText
		);
		expect(mockSetViewState).toHaveBeenCalledWith(ActionItemViewState.DEFAULT);
	});

	it('should edit action item assignee and save on enter', () => {
		const newAssignee = 'Billy Eilish';
		editActionItemAssignee(`${newAssignee}{enter}`);

		expect(ActionItemService.updateAssignee).toHaveBeenCalledWith(
			mockTeam.id,
			fakeActionItem.id,
			newAssignee
		);
	});
});

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

function getTextarea() {
	return screen.getByTestId('textareaField');
}
