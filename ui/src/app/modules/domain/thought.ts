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

import { Column } from './column';

export type Topic = string;
export interface Thought {
  id: number;
  teamId: string;
  topic: Topic;
  message: string;
  hearts: number;
  discussed: boolean;
  columnTitle: Column;
  state?: string;
}

export function emptyThought(): Thought {
  return {
    id: -1,
    message: '',
    topic: '',
    teamId: '',
    hearts: 0,
    discussed: false,
    columnTitle: null,
  };
}

export function emptyThoughtWithColumn(): Thought {
  return {
    id: -1,
    message: '',
    topic: '',
    teamId: '',
    hearts: 0,
    discussed: false,
    columnTitle: { sorted: false, id: 1, topic: '', title: '', teamId: '' },
  };
}
