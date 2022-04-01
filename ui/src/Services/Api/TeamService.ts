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

import axios, { AxiosError, AxiosResponse } from 'axios';

import { CREATE_TEAM_PAGE_PATH, LOGIN_PAGE_PATH } from '../../RouteConstants';
import CookieService from '../CookieService';

import {
	CREATE_TEAM_API_PATH,
	getCSVApiPath,
	getTeamNameApiPath,
	LOGIN_API_PATH,
} from './ApiConstants';

export interface AuthResponse {
	token: string;
	teamId: string;
}

const UNAUTHORIZED_STATUS = 401;
const FORBIDDEN_STATUS = 403;

const returnTokenAndTeamId = (response: AxiosResponse): AuthResponse => ({
	token: response.data,
	teamId: response.headers.location,
});

const TeamService = {
	login(name: string, password: string): Promise<AuthResponse> {
		return axios
			.post(LOGIN_API_PATH, { name, password })
			.then(returnTokenAndTeamId);
	},

	create(name: string, password: string): Promise<AuthResponse> {
		return axios
			.post(CREATE_TEAM_API_PATH, { name, password })
			.then(returnTokenAndTeamId);
	},

	getTeamName(teamId: string): Promise<string> {
		const TEAM_NAME_API_PATH = getTeamNameApiPath(teamId);
		return axios.get(TEAM_NAME_API_PATH).then((res) => res.data);
	},

	getCSV(teamId: string): Promise<Blob> {
		const url = getCSVApiPath(teamId);
		return axios
			.get(url, {
				responseType: 'blob',
				timeout: 30000,
			})
			.then((response) => response.data);
	},

	onResponseInterceptRejection(error: AxiosError): Promise<AxiosError> {
		const { status } = error?.response || {};

		if (status === UNAUTHORIZED_STATUS || status === FORBIDDEN_STATUS) {
			CookieService.clearToken();

			const { pathname } = window.location;
			const isLoginPage = pathname.includes(LOGIN_PAGE_PATH);
			const isCreateNewTeamPage = pathname === CREATE_TEAM_PAGE_PATH;

			if (!isLoginPage && !isCreateNewTeamPage) {
				window.location.assign(LOGIN_PAGE_PATH);
			}
		}
		return Promise.reject(error);
	},
};

axios.interceptors.response.use(
	(response) => response,
	TeamService.onResponseInterceptRejection
);

export default TeamService;
