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
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { RecoilRoot } from 'recoil';

import { getMockActionItem } from '../../../../Services/Api/__mocks__/ActionItemService';
import ActionItemService from '../../../../Services/Api/ActionItemService';
import { ActionItemState } from '../../../../State/ActionItemState';
import { TeamState } from '../../../../State/TeamState';
import Action from '../../../../Types/Action';
import { ColumnTitle } from '../../../../Types/ColumnTitle';
import Team from '../../../../Types/Team';
import Topic from '../../../../Types/Topic';

import ActionItemsColumn from './ActionItemsColumn';

const team: Team = {
	name: 'My Team',
	id: 'my-team',
};

const activeActionItem1: Action = getMockActionItem(false);
activeActionItem1.id = 943;
const activeActionItem2: Action = getMockActionItem(false);
const completedActionItem1: Action = getMockActionItem(true);

const actionItemsColumnTitle: ColumnTitle = {
	id: 465657,
	topic: Topic.ACTION,
	title: 'Action Items',
	teamId: 'team-id',
};

jest.mock('../../../../Services/Api/ActionItemService');

describe('Action Items Column', () => {
	let container: HTMLElement;

	beforeEach(async () => {
		({ container } = render(
			<RecoilRoot
				initializeState={({ set }) => {
					set(ActionItemState, [
						activeActionItem1,
						activeActionItem2,
						completedActionItem1,
					]);
					set(TeamState, team);
				}}
			>
				<ActionItemsColumn />
			</RecoilRoot>
		));

		expect(screen.getAllByTestId('actionItem')).toBeDefined();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should render without axe errors', async () => {
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});

	it('should show column title', () => {
		expect(screen.getByText(actionItemsColumnTitle.title)).toBeDefined();
	});

	it('should show count of active items', () => {
		const countContainer = screen.getByTestId('countSeparator');
		const activeItemCount = within(countContainer).getByText('2');
		expect(activeItemCount).toBeDefined();
	});

	it('should render action items', () => {
		const actionItems = screen.getAllByTestId('actionItem');
		expect(actionItems.length).toBe(3);
	});

	describe('Create Action Item', () => {
		const placeholderText = 'Enter an Action Item';
		let actionItemTextField: Element;
		let parseAssigneesSpy: jest.SpyInstance<
			string[] | null,
			[newMessage: string]
		>;
		let removeAssigneesFromTaskSpy: jest.SpyInstance<
			string,
			[newMessage: string, assignees: string[] | null]
		>;

		beforeEach(() => {
			actionItemTextField = screen.getByPlaceholderText(placeholderText);

			parseAssigneesSpy = jest.spyOn(ActionItemService, 'parseAssignees');
			removeAssigneesFromTaskSpy = jest.spyOn(
				ActionItemService,
				'removeAssigneesFromTask'
			);
		});

		it('should not make call to create action item until user types an action item', () => {
			userEvent.type(actionItemTextField, `{enter}`);
			expect(ActionItemService.create).not.toHaveBeenCalled();
		});

		it('should make call to add action item when user types and submits a new action', () => {
			const parsedAssignees = 'me';
			const taskWithoutAssignees = 'Do the things';
			ActionItemService.parseAssignees = jest
				.fn()
				.mockReturnValue([parsedAssignees]);
			ActionItemService.removeAssigneesFromTask = jest
				.fn()
				.mockReturnValue(taskWithoutAssignees);

			userEvent.type(actionItemTextField, `${taskWithoutAssignees} @me{enter}`);

			expect(ActionItemService.create).toHaveBeenCalledWith(
				team.id,
				taskWithoutAssignees,
				parsedAssignees
			);
		});

		it('should parse out the assignees from the new message and add it to the action item', () => {
			parseAssigneesSpy.mockReturnValue(['ben12', 'frank', 'jeana']);
			const expectedFormattedTask = 'a new actionItem';
			removeAssigneesFromTaskSpy.mockReturnValue(expectedFormattedTask);

			const newUnformattedTask = `a new actionItem @ben12 @frank @jeana`;
			userEvent.type(actionItemTextField, `${newUnformattedTask}{enter}`);

			const expectedAssignee = 'ben12, frank, jeana';
			expect(ActionItemService.create).toHaveBeenCalledWith(
				team.id,
				expectedFormattedTask,
				expectedAssignee
			);
		});

		it('should set the assignees in the action item to null if none could be parsed out of the message', () => {
			const newTask = `a new actionItem`;
			parseAssigneesSpy.mockReturnValue(null);
			removeAssigneesFromTaskSpy.mockReturnValue(newTask);
			userEvent.type(actionItemTextField, `${newTask}{enter}`);
			expect(ActionItemService.create).toHaveBeenCalledWith(
				team.id,
				newTask,
				null
			);
		});

		it('should not let the user submit a assignee string greater than the max limit', () => {
			const expectedAssignee =
				'llllllllllllllllllllllllllllllllllllllllllllllllll';
			const newTask = `a new actionItem @${expectedAssignee}thisGetsCutOff`;
			const expectedFormattedTask = 'a new actionItem';

			parseAssigneesSpy.mockReturnValue([expectedAssignee]);
			removeAssigneesFromTaskSpy.mockReturnValue(expectedFormattedTask);

			userEvent.type(actionItemTextField, `${newTask}{enter}`);

			expect(ActionItemService.create).toHaveBeenCalledWith(
				team.id,
				expectedFormattedTask,
				expectedAssignee
			);
		});
	});

	describe('Edit Action Item', () => {
		it('should make call to update assignee', () => {
			const actionItems = screen.getAllByTestId('actionItem');
			const firstThoughtsAssigneeInput = within(actionItems[0]).getByTestId(
				'assigneeInput'
			);

			const newAssignee = ', SomeoneElse';
			userEvent.type(firstThoughtsAssigneeInput, `${newAssignee}{enter}`);

			expect(ActionItemService.updateAssignee).toHaveBeenCalledWith(
				team.id,
				activeActionItem1.id,
				'Bob, SomeoneElse'
			);
		});
	});

	it('should update completed status of an action item', async () => {
		const actionItems = await screen.findAllByTestId('actionItem');
		const firstActionItemCompletedButton = within(actionItems[0]).getByTestId(
			'checkboxButton'
		);
		userEvent.click(firstActionItemCompletedButton);

		await waitFor(() =>
			expect(ActionItemService.updateCompletionStatus).toHaveBeenCalledWith(
				team.id,
				activeActionItem1.id,
				!activeActionItem1.completed
			)
		);
	});
});
