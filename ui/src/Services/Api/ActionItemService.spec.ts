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

import axios from 'axios';
import moment from 'moment';

import { mockGetCookie } from '../../__mocks__/universal-cookie';
import Action from '../../Types/Action';
import CreateActionItemRequest from '../../Types/CreateActionItemRequest';

import { getMockActionItem } from './__mocks__/ActionItemService';
import ActionItemService from './ActionItemService';

jest.useFakeTimers();

jest.mock('axios');

describe('Action Item Service', () => {
	const teamId = 'team-id';
	const actionItemId = 123;
	const allActionItemsUrl = `/api/team/${teamId}/action-item`;
	const actionItemByIdUrl = `${allActionItemsUrl}/${actionItemId}`;
	const fakeToken = 'fake-token';
	const mockConfig = { headers: { Authorization: `Bearer ${fakeToken}` } };

	beforeAll(() => {
		mockGetCookie.mockReturnValue(fakeToken);
	});

	describe('get', () => {
		it('should retrieve unarchived action items', async () => {
			const expected = [getMockActionItem(), getMockActionItem()];
			axios.get = jest.fn().mockResolvedValue({ data: expected });
			const actual = await ActionItemService.get(teamId, false);
			expect(actual).toEqual(expected);
			expect(axios.get).toHaveBeenCalledWith(
				allActionItemsUrl + '?archived=false',
				mockConfig
			);
		});

		it('should retrieve archived action items', async () => {
			const expected = [getMockActionItem()];
			axios.get = jest.fn().mockResolvedValue({ data: expected });
			const actual = await ActionItemService.get(teamId, true);
			expect(actual).toEqual(expected);
			expect(axios.get).toHaveBeenCalledWith(
				allActionItemsUrl + '?archived=true',
				mockConfig
			);
		});
	});

	describe('create', () => {
		it('should create an action item', async () => {
			const expectedResult: Action = getMockActionItem();
			axios.post = jest.fn().mockResolvedValue({ data: expectedResult });

			const task = 'Action to do';
			const assignees = 'me, you';

			const actualResult = await ActionItemService.create(
				teamId,
				task,
				assignees
			);
			expect(actualResult).toBe(expectedResult);
			const expectedCreateActionItemRequest: CreateActionItemRequest = {
				id: null,
				teamId,
				task,
				completed: false,
				assignee: 'me, you',
				dateCreated: moment().format(),
				archived: false,
			};
			expect(axios.post).toHaveBeenCalledWith(
				allActionItemsUrl,
				expectedCreateActionItemRequest,
				mockConfig
			);
		});
	});

	describe('delete', () => {
		it('should delete an action item', async () => {
			await ActionItemService.delete(teamId, actionItemId);
			expect(axios.delete).toHaveBeenCalledWith(actionItemByIdUrl, mockConfig);
		});
	});

	describe('updateTask', () => {
		it('should update an action item task', async () => {
			const updatedTask = 'Update Task';
			await ActionItemService.updateTask(teamId, actionItemId, updatedTask);
			expect(axios.put).toHaveBeenCalledWith(
				`${actionItemByIdUrl}/task`,
				{
					task: updatedTask,
				},
				mockConfig
			);
		});
	});

	describe('updateAssignee', () => {
		it('should update an action item Assignee', async () => {
			const updatedAssignee = 'Updated Assignee';
			await ActionItemService.updateAssignee(
				teamId,
				actionItemId,
				updatedAssignee
			);
			expect(axios.put).toHaveBeenCalledWith(
				`${actionItemByIdUrl}/assignee`,
				{
					assignee: updatedAssignee,
				},
				mockConfig
			);
		});
	});

	describe('updateCompletionStatus', () => {
		it('should update completion status', async () => {
			const completed = true;
			await ActionItemService.updateCompletionStatus(
				teamId,
				actionItemId,
				completed
			);
			expect(axios.put).toHaveBeenCalledWith(
				`${actionItemByIdUrl}/completed`,
				{
					completed,
				},
				mockConfig
			);
		});
	});

	describe('parseAssignees', () => {
		it('should pull out assignees from action item message', () => {
			const actualResult =
				ActionItemService.parseAssignees('Some Task @me @you');
			expect(actualResult).toEqual(['me', 'you']);
		});

		it('should return null if no assignees are found', () => {
			const actualResult = ActionItemService.parseAssignees('Some Task');
			expect(actualResult).toBeNull();
		});
	});

	describe('removeAssigneesFromTask', () => {
		it('should remove assignees from task', () => {
			const actualResult = ActionItemService.removeAssigneesFromTask(
				'Some Task @me @you',
				['me', 'you']
			);
			expect(actualResult).toBe('Some Task');
		});

		it('should return task if no assignees are present', () => {
			const actualResult = ActionItemService.removeAssigneesFromTask(
				'Some Task',
				null
			);
			expect(actualResult).toBe('Some Task');
		});
	});
});
