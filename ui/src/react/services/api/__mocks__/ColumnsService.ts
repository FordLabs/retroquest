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
import ColumnTopic from '../../../types/ColumnTopic';
import Thought, { ThoughtTopic } from '../../../types/Thought';

export const getMockThought = (topic: ThoughtTopic, isDiscussed): Thought => ({
  id: Math.random(),
  message: `This is a ${topic} thought`,
  topic,
  hearts: 0,
  discussed: isDiscussed,
});

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
      active: [getMockThought(ColumnTopic.HAPPY, false)],
      completed: [getMockThought(ColumnTopic.HAPPY, true)],
    },
    title: 'Happy',
    topic: ColumnTopic.HAPPY,
  },
  {
    id: 1,
    items: {
      active: [getMockThought(ColumnTopic.CONFUSED, false)],
      completed: [getMockThought(ColumnTopic.CONFUSED, true)],
    },
    title: 'Confused',
    topic: ColumnTopic.CONFUSED,
  },
  {
    id: 1,
    items: {
      active: [getMockThought(ColumnTopic.UNHAPPY, true)],
      completed: [getMockThought(ColumnTopic.UNHAPPY, false)],
    },
    title: 'Sad',
    topic: ColumnTopic.UNHAPPY,
  },
  {
    id: 1,
    items: { active: [getMockActionItem(false)], completed: [getMockActionItem(true)] },
    title: 'Action Item',
    topic: ColumnTopic.ACTION,
  },
];

const ColumnsService = {
  getColumns: jest.fn().mockResolvedValue(mockColumns),
};

export default ColumnsService;
