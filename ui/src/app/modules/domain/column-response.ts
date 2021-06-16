/*
 *  Copyright (c) 2020 Ford Motor Company
 *  All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { ItemSorter } from './column/item-sorter';
import { Thought } from './thought';
import { Column } from './column';
import { ActionItem } from './action-item';

export interface ColumnResponse {
  id: number;
  items: ItemSorter;
  title: string;
  topic: string;
}

export function emptyColumnResponse(): ColumnResponse {
  return {
    id: -1,
    items: { active: [], completed: [] },
    topic: '',
    title: '',
  };
}

export function deleteColumnResponse(
  response: ResponseWithId,
  items: ItemSorter
): void {
  let removeIndex = items.active.findIndex(
    (item: ResponseWithId) => item.id === response.id
  );
  if (removeIndex > -1) {
    items.active.splice(removeIndex, 1);
    return;
  }

  removeIndex = items.completed.findIndex(
    (item: ResponseWithId) => item.id === response.id
  );
  if (removeIndex > -1) {
    items.completed.splice(removeIndex, 1);
  }
}

export interface ResponseWithId {
  id: number;
}

export function findThought(
  { items: { active, completed } }: ColumnResponse,
  thoughtId: Thought['id']
): Thought | undefined {
  const allThoughts: Thought[] = [...active, ...completed] as Thought[]; // these arrays aren't typed properly
  return allThoughts.find((t) => t.id === thoughtId);
}
