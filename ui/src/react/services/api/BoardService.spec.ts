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

import axios from 'axios';

import BoardService from './BoardService';

describe('Board Service', () => {
  it('should return list of boards by page index', async () => {
    const teamId = 'teamId';
    const expectedBoards = [];
    axios.get = jest.fn().mockResolvedValue({ data: expectedBoards });

    const actual = await BoardService.getBoards(teamId, 0);

    expect(actual).toEqual(expectedBoards);
    expect(axios.get).toHaveBeenCalledWith('/api/team/teamId/boards?pageIndex=0');
  });
});
