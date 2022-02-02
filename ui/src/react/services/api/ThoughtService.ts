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

import CreateThoughtRequest from '../../types/CreateThoughtRequest';
import Thought from '../../types/Thought';

import { getCreateThoughtApiPath, getDeleteThoughtApiPath } from './ApiConstants';

function getCreateThoughtResponse(teamId: string, topic: string, message: string): CreateThoughtRequest {
  return {
    id: -1,
    teamId,
    topic,
    message,
    hearts: 0,
    discussed: false,
  };
}

const ThoughtService = {
  create: (teamId: string, createThoughtRequest: CreateThoughtRequest): Promise<Thought> => {
    const url = getCreateThoughtApiPath(teamId);
    return axios.post(url, createThoughtRequest).then((response) => response.data);
  },

  delete(teamId: string, thoughtId: number): Promise<void> {
    const url = getDeleteThoughtApiPath(teamId, thoughtId);
    return axios.delete(url);
  },
};

export default ThoughtService;

export { getCreateThoughtResponse };
