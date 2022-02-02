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

import ActionItem from '../../../types/Action';
import { Column } from '../../../types/Column';
import Topic from '../../../types/Topic';

import { getMockThought } from './ThoughtService';

export const getMockActionItem = (isCompleted): ActionItem => ({
  id: Math.random(),
  task: 'This is an action we can take',
  completed: isCompleted,
  assignee: 'Bob',
  dateCreated: '2022-01-20',
});

export const mockColumns: Column[] = [
  {
    id: 1,
    items: {
      active: [getMockThought(Topic.HAPPY, false)],
      completed: [getMockThought(Topic.HAPPY, true)],
    },
    title: 'Happy',
    topic: Topic.HAPPY,
  },
  {
    id: 1,
    items: {
      active: [getMockThought(Topic.CONFUSED, false)],
      completed: [getMockThought(Topic.CONFUSED, true)],
    },
    title: 'Confused',
    topic: Topic.CONFUSED,
  },
  {
    id: 1,
    items: {
      active: [getMockThought(Topic.UNHAPPY, true)],
      completed: [getMockThought(Topic.UNHAPPY, false)],
    },
    title: 'Sad',
    topic: Topic.UNHAPPY,
  },
  {
    id: 1,
    items: { active: [getMockActionItem(false)], completed: [getMockActionItem(true)] },
    title: 'Action Item',
    topic: Topic.ACTION,
  },
];

const ColumnService = {
  getColumns: jest.fn().mockResolvedValue(mockColumns),
};

export default ColumnService;
