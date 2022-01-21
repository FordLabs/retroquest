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

import axios from 'axios';

import { AuthService } from '../../app/modules/auth/auth.service';

import { CREATE_TEAM_API_PATH, getTeamNameApiPath, LOGIN_API_PATH } from './ApiConstants';

function postThenSetTokenAndReturnTeamId(url: string, data: { name: string; password: string }) {
  return axios.post(url, data).then((response) => {
    const token = response.data;
    const teamId = response.headers.location;
    AuthService.setToken(token);
    return teamId;
  });
}

const TeamService = {
  login: (name: string, password: string): Promise<string> => {
    return postThenSetTokenAndReturnTeamId(LOGIN_API_PATH, { name, password });
  },

  create: (name: string, password: string): Promise<string> => {
    return postThenSetTokenAndReturnTeamId(CREATE_TEAM_API_PATH, { name, password });
  },

  getTeamName: (teamId: string): Promise<string> => {
    const TEAM_NAME_API_PATH = getTeamNameApiPath(teamId);
    return axios.get(TEAM_NAME_API_PATH).then((res) => res.data);
  },
};

export default TeamService;
