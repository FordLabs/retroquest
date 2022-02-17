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

import { Column } from '../../../types/Column';
import Topic from '../../../types/Topic';

import { getMockActionItem } from './ActionItemService';
import { getMockThought } from './ThoughtService';

export const mockColumns: Column[] = [
  {
    id: 1,
    items: [getMockThought(Topic.HAPPY, false), getMockThought(Topic.HAPPY, true)],
    title: 'Happy',
    topic: Topic.HAPPY,
  },
  {
    id: 1,
    items: [getMockThought(Topic.CONFUSED, false), getMockThought(Topic.CONFUSED, true)],
    title: 'Confused',
    topic: Topic.CONFUSED,
  },
  {
    id: 1,
    items: [getMockThought(Topic.UNHAPPY, false), getMockThought(Topic.UNHAPPY, true)],
    title: 'Sad',
    topic: Topic.UNHAPPY,
  },
  {
    id: 1,
    items: [getMockActionItem(false), getMockActionItem(true)],
    title: 'Action Items',
    topic: Topic.ACTION,
  },
];

const ColumnService = {
  getColumns: jest.fn().mockResolvedValue(mockColumns),
  updateColumnTitle: jest.fn().mockResolvedValue(null),
};

export default ColumnService;
