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

import { ActionItem } from './action-item';
import { Thought } from './thought';

export type ColumnItem = Thought | ActionItem;

export type ColumnItems = ColumnItem[];

export interface ColumnResponse {
  id: number;
  items: ColumnItems;
  title: string;
  topic: string;
}

export function emptyColumnResponse(): ColumnResponse {
  return {
    id: -1,
    items: [],
    topic: '',
    title: '',
  };
}

export function removeItemFromColumn(itemToRemove: ColumnItem, items: ColumnItems): void {
  const removeIndex = items.findIndex((item) => item.id === itemToRemove.id);
  if (removeIndex > -1) {
    items.splice(removeIndex, 1);
  }
}

export function findThought({ items }: ColumnResponse, thoughtId: Thought['id']): Thought | undefined {
  const allThoughts: Thought[] = [...items] as Thought[]; // these arrays aren't typed properly
  return allThoughts.find((t) => t.id === thoughtId);
}
