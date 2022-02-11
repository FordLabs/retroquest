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

import Action from '../../types/Action';
import CreateActionItemRequest from '../../types/CreateActionItemRequest';

import { getActionItemApiPath } from './ApiConstants';

const ActionItemService = {
  create: (teamId: string, createActionItemRequest: CreateActionItemRequest): Promise<Action> => {
    const url = getActionItemApiPath(teamId);
    return axios.post(url, createActionItemRequest).then((response) => response.data);
  },

  delete(teamId: string, actionItemId: number): Promise<void> {
    const url = `${getActionItemApiPath(teamId)}/${actionItemId}`;
    return axios.delete(url);
  },

  updateTask(teamId: string, actionItemId: number, updatedTask: string) {
    const url = `${getActionItemApiPath(teamId)}/${actionItemId}/task`;
    return axios.put(url, { task: updatedTask });
  },

  updateAssignee(teamId: string, actionItemId: number, updatedAssignee: string) {
    const url = `${getActionItemApiPath(teamId)}/${actionItemId}/assignee`;
    return axios.put(url, { assignee: updatedAssignee });
  },
};

export default ActionItemService;
