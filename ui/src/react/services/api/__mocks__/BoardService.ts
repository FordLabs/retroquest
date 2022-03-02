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

import moment from 'moment';

import Board from '../../../types/Board';
import Topic from '../../../types/Topic';

const boards: Board[] = [
  {
    id: 1,
    dateCreated: moment(new Date(402292800000)),
    teamId: 'teamId',
    thoughts: [
      {
        id: 100,
        message: 'I am a message',
        hearts: 0,
        discussed: false,
        topic: Topic.HAPPY,
      },
    ],
  },
  {
    id: 2,
    dateCreated: moment(new Date(893217600000)),
    teamId: 'teamId',
    thoughts: [],
  },
];

const BoardService = {
  archiveRetro: jest.fn().mockResolvedValue(null),
  getBoards: jest.fn().mockResolvedValue(boards),
};

export default BoardService;
