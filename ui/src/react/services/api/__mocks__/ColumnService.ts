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
import { ColumnTitle } from '../../../types/ColumnTitle';
import Topic from '../../../types/Topic';

export const getMockColumnTitle = (topic: Topic, title: string): ColumnTitle => {
  return {
    id: 1,
    topic,
    title,
    teamId: 'team-od',
  };
};

export const mockColumns: Column[] = [
  {
    id: 1,
    title: 'Happy',
    topic: Topic.HAPPY,
  },
  {
    id: 2,
    title: 'Confused',
    topic: Topic.CONFUSED,
  },
  {
    id: 3,
    title: 'Sad',
    topic: Topic.UNHAPPY,
  },
];

const ColumnService = {
  getColumns: jest.fn().mockResolvedValue(mockColumns),
  updateColumnTitle: jest.fn().mockResolvedValue(null),
};

export default ColumnService;
