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
import Team from 'Types/Team';

import {
	CREATE_TEAM_PAGE_PATH,
	LOGIN_PAGE_PATH,
	REQUEST_PASSWORD_RESET_PAGE_PATH,
} from '../../RouteConstants';
import CookieService from '../CookieService';

import {
	CHANGE_EMAIL_API_PATH,
	CHANGE_PASSWORD_API_PATH,
	getCSVApiPath,
	getTeamNameApiPath,
	LOGIN_API_PATH,
	PASSWORD_REQUEST_API_PATH,
	RESET_TOKEN_LIFETIME_API_PATH,
	RESET_TOKEN_STATUS_API_PATH,
	TEAM_API_PATH,
} from './ApiConstants';
import getAuthConfig from './getAuthConfig';

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

	create(
		name: string,
		password: string,
		email: string,
		secondEmail: string
	): Promise<AuthResponse> {
		return axios
			.post(TEAM_API_PATH, {
				name,
				password,
				email,
				secondaryEmail: secondEmail,
			})
			.then(returnTokenAndTeamId);
	},

	updateEmailsWithResetToken(
		email1: string,
		email2: string,
		token: string
	): Promise<AxiosResponse> {
		return axios.post(CHANGE_EMAIL_API_PATH, {
			email1: email1,
			email2: email2,
			emailResetToken: token,
		});
	},

	sendPasswordResetEmail(
		teamName: string,
		email: string
	): Promise<AxiosResponse> {
		return axios.post(PASSWORD_REQUEST_API_PATH, {
			teamName: teamName,
			email: email,
		});
	},

	sendTeamNameRecoveryEmail(recoveryEmail: string): Promise<AxiosResponse> {
		return axios.post(TEAM_API_PATH, {
			recoveryEmail: recoveryEmail,
		});
	},

	checkIfResetTokenIsValid(resetToken: string): Promise<boolean> {
		return axios
			.post(RESET_TOKEN_STATUS_API_PATH, {
				resetToken: resetToken,
			})
			.then((res) => res.data);
	},

	setPassword(password: string, token: string): Promise<AxiosResponse> {
		return axios.post(CHANGE_PASSWORD_API_PATH, {
			password: password,
			resetToken: token,
		});
	},

	getTeam(teamId: string): Promise<Team> {
		return axios
			.get(`${TEAM_API_PATH}/${teamId}`, getAuthConfig())
			.then((res) => res.data);
	},

	getTeamName(teamId: string): Promise<string> {
		const TEAM_NAME_API_PATH = getTeamNameApiPath(teamId);
		return axios.get(TEAM_NAME_API_PATH).then((res) => res.data);
	},

	updateTeamEmailAddresses(teamId: string, email1: string, email2: string) {
		const url = `${TEAM_API_PATH}/${teamId}/email-addresses`;
		return axios.put(
			url,
			{
				email1: email1,
				email2: email2,
			},
			getAuthConfig()
		);
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

	getResetTokenLifetime(): Promise<number> {
		return axios
			.get(RESET_TOKEN_LIFETIME_API_PATH)
			.then((response) => response.data);
	},

	onResponseInterceptRejection(error: AxiosError): Promise<AxiosError> {
		const { status } = error?.response || {};

		if (status === UNAUTHORIZED_STATUS || status === FORBIDDEN_STATUS) {
			CookieService.clearToken();

			const { pathname } = window.location;
			const unauthorizedPaths = [
				LOGIN_PAGE_PATH,
				CREATE_TEAM_PAGE_PATH,
				REQUEST_PASSWORD_RESET_PAGE_PATH,
			];

			if (!unauthorizedPaths.some((path) => pathname.includes(path))) {
				let teamNamePath = '';
				const isTeamPage = pathname.includes('/team');
				if (isTeamPage) {
					const params = pathname.split('/');
					teamNamePath = `/${params[2]}`;
				}

				window.location.assign(LOGIN_PAGE_PATH + teamNamePath);
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
