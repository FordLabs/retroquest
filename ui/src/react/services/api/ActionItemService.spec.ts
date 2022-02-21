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

import Action from '../../types/Action';
import CreateActionItemRequest from '../../types/CreateActionItemRequest';

import { getMockActionItem } from './__mocks__/ActionItemService';
import ActionItemService from './ActionItemService';

jest.useFakeTimers();

jest.mock('axios');

describe('Action Item Service', () => {
  const teamId = 'team-id';
  const actionItemId = 123;
  const allActionItemsUrl = `/api/team/${teamId}/action-item`;
  const actionItemByIdUrl = `${allActionItemsUrl}/${actionItemId}`;

  it('should create an action item', async () => {
    const expectedResult: Action = getMockActionItem();
    axios.post = jest.fn().mockResolvedValue({ data: expectedResult });
    const createActionItemRequest: CreateActionItemRequest = {
      id: null,
      teamId,
      task: 'Action to do',
      completed: false,
      assignee: 'me, you',
      dateCreated: moment().format(),
      archived: false,
    };

    const actualResult = await ActionItemService.create(teamId, createActionItemRequest);
    expect(actualResult).toBe(expectedResult);
    expect(axios.post).toHaveBeenCalledWith(allActionItemsUrl, createActionItemRequest);
  });

  it('should delete an action item', async () => {
    await ActionItemService.delete(teamId, actionItemId);
    expect(axios.delete).toHaveBeenCalledWith(actionItemByIdUrl);
  });

  it('should update an action item task', async () => {
    const updatedTask = 'Update Task';
    await ActionItemService.updateTask(teamId, actionItemId, updatedTask);
    expect(axios.put).toHaveBeenCalledWith(`${actionItemByIdUrl}/task`, { task: updatedTask });
  });

  it('should update an action item assignee', async () => {
    const updatedAssignee = 'Updated Assignee';
    await ActionItemService.updateAssignee(teamId, actionItemId, updatedAssignee);
    expect(axios.put).toHaveBeenCalledWith(`${actionItemByIdUrl}/assignee`, { assignee: updatedAssignee });
  });

  it('should update completion status', async () => {
    const completed = true;
    await ActionItemService.updateCompletionStatus(teamId, actionItemId, completed);
    expect(axios.put).toHaveBeenCalledWith(`${actionItemByIdUrl}/completed`, { completed });
  });

  describe('parseAssignees', () => {
    it('should pull out assignees from action item message', () => {
      const actualResult = ActionItemService.parseAssignees('Some Task @me @you');
      expect(actualResult).toEqual(['me', 'you']);
    });

    it('should return null if no assignees are found', () => {
      const actualResult = ActionItemService.parseAssignees('Some Task');
      expect(actualResult).toBeNull();
    });
  });

  describe('removeAssigneesFromTask', () => {
    it('should remove assignees from task', () => {
      const actualResult = ActionItemService.removeAssigneesFromTask('Some Task @me @you', ['me', 'you']);
      expect(actualResult).toBe('Some Task');
    });

    it('should return task if no assignees are present', () => {
      const actualResult = ActionItemService.removeAssigneesFromTask('Some Task', null);
      expect(actualResult).toBe('Some Task');
    });
  });
});
