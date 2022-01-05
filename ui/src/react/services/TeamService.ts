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

export default class TeamService {
  static login(name: string, password: string): Promise<string> {
    const url = '/api/team/login';
    const data = { name, password };

    return axios.post(url, data).then((response) => {
      const token = response.data;
      AuthService.setToken(token);
      return response.headers.location;
    });
  }

  static getTeamName(teamId: string): Promise<string> {
    const url = `/api/team/${teamId}/name`;
    return axios.get(url).then((res) => res.data);
  }
}
