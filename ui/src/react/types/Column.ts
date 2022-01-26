/*
 * Copyright (c) 2021 Ford Motor Company
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

import Action from './Action';
import ColumnTopic from './ColumnTopic';
import Thought from './Thought';

export type ColumnItem = Thought | Action;

export interface ColumnItems {
  active: ColumnItem[];
  completed: ColumnItem[];
}

export interface Column {
  id: number;
  items: ColumnItems;
  title: string;
  topic: ColumnTopic;
}
