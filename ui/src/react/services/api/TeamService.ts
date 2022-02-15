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

import { CREATE_TEAM_PAGE_PATH, LOGIN_PAGE_PATH } from '../../routes/RouteConstants';
import CookieService from '../CookieService';

import { CREATE_TEAM_API_PATH, getTeamNameApiPath, LOGIN_API_PATH } from './ApiConstants';

export interface AuthResponse {
  token: string;
  teamId: string;
}

const UNAUTHORIZED_STATUS = 401;
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status } = error?.response;

    if (status === UNAUTHORIZED_STATUS) {
      CookieService.clearToken();

      const { pathname } = window.location;
      const isLoginPage = pathname.includes(LOGIN_PAGE_PATH);
      const isCreateNewTeamPage = pathname === CREATE_TEAM_PAGE_PATH;

      if (!isLoginPage && !isCreateNewTeamPage) {
        window.location.pathname = LOGIN_PAGE_PATH;
      }
    }
    return Promise.reject(error);
  }
);

const returnTokenAndTeamId = (response): AuthResponse => ({ token: response.data, teamId: response.headers.location });

const TeamService = {
  login(name: string, password: string): Promise<AuthResponse> {
    return axios.post(LOGIN_API_PATH, { name, password }).then(returnTokenAndTeamId);
  },

  create(name: string, password: string): Promise<AuthResponse> {
    return axios.post(CREATE_TEAM_API_PATH, { name, password }).then(returnTokenAndTeamId);
  },

  getTeamName(teamId: string): Promise<string> {
    const TEAM_NAME_API_PATH = getTeamNameApiPath(teamId);
    return axios.get(TEAM_NAME_API_PATH).then((res) => res.data);
  },
};

export default TeamService;
