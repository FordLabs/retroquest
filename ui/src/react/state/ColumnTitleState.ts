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

import { atom, atomFamily, selectorFamily } from 'recoil';

import { ColumnTitle } from '../types/ColumnTitle';
import ColumnTopic from '../types/ColumnTopic';

import { ThoughtTopic } from './ThoughtsState';

export const ColumnTitleState = atom<ColumnTitle[]>({
  key: 'ColumnTitleState',
  default: [],
});

export const ColumnTitleByTopicState = atomFamily<ColumnTitle, ColumnTopic>({
  key: 'ColumnTitleByTopicState',
  default: selectorFamily({
    key: 'ColumnTitleByTopicState/Default',
    get:
      (topic: ThoughtTopic) =>
      ({ get }) => {
        const columnTitles = get(ColumnTitleState);
        return columnTitles.find((column) => column.topic === topic);
      },
  }),
});
