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

import axios, { AxiosError } from 'axios';

import { REQUEST_PASSWORD_RESET_PAGE_PATH } from '../../RouteConstants';
import CookieService from '../CookieService';

import TeamService, { AuthResponse } from './TeamService';

jest.mock('../CookieService');

describe('Team Service', () => {
	const teamId = 'team-id';
	const user = {
		name: 'Julia',
		password: 'Password1',
		email: 'e@mail.com',
	};
	const axiosResponse = {
		data: 'jwt-token-123',
		headers: { location: teamId },
	};

	describe('login', () => {
		it('should login to retroquest', async () => {
			axios.post = jest.fn().mockResolvedValue(axiosResponse);
			const authResponse: AuthResponse = await TeamService.login(
				user.name,
				user.password
			);
			expect(authResponse).toEqual({
				token: authResponse.token,
				teamId,
			});
			expect(axios.post).toHaveBeenCalledWith('/api/team/login', {
				name: user.name,
				password: user.password,
			});
		});
	});

	describe('create', () => {
		it('should create a retroquest team', async () => {
			axios.post = jest.fn().mockResolvedValue(axiosResponse);
			const authResponse: AuthResponse = await TeamService.create(
				user.name,
				user.password,
				user.email
			);
			expect(authResponse).toEqual({
				token: authResponse.token,
				teamId,
			});
			expect(axios.post).toHaveBeenCalledWith('/api/team', user);
		});
	});

	describe('getTeamName', () => {
		it('should get team name by team id', async () => {
			axios.get = jest.fn().mockResolvedValue({ data: user.name });
			const actualTeamName = await TeamService.getTeamName(teamId);
			expect(actualTeamName).toBe(user.name);
			expect(axios.get).toHaveBeenCalledWith(`/api/team/${teamId}/name`);
		});
	});

	describe('getCSV', () => {
		it('should get CSV for active retro board', async () => {
			const expectedCSVData = 'column 1, column 2';
			axios.get = jest.fn().mockResolvedValue({ data: expectedCSVData });

			const actualResponse = await TeamService.getCSV(teamId);

			expect(actualResponse).toBe(expectedCSVData);
			expect(axios.get).toHaveBeenCalledWith(`/api/team/${teamId}/csv`, {
				responseType: 'blob',
				timeout: 30000,
			});
		});
	});

	describe('setEmails', () => {
		it('should post emails to /email/reset with the token', async () => {
			axios.post = jest.fn();
			await TeamService.setEmails('e1@ma.il', 'e2@ma.il', 'T0k3n');

			expect(axios.post).toHaveBeenCalledWith('/api/email/reset', {
				email1: 'e1@ma.il',
				email2: 'e2@ma.il',
				emailResetToken: 'T0k3n',
			});
		});
	});

	describe('setPasswords', () => {
		it('should post password to /password/reset with the token', async () => {
			axios.post = jest.fn();
			await TeamService.setPassword('wordword', 'T0k3n');

			expect(axios.post).toHaveBeenCalledWith('/api/password/reset', {
				password: 'wordword',
				resetToken: 'T0k3n',
			});
		});
	});

	describe('sendPasswordResetLink', () => {
		it('should send password reset link', async () => {
			axios.post = jest.fn();
			await TeamService.sendPasswordResetLink('Team Name', 'a@b.c');

			expect(axios.post).toHaveBeenCalledWith('/api/password/request-reset', {
				teamName: 'Team Name',
				email: 'a@b.c',
			});
		});
	});

	describe('onResponseInterceptRejection', () => {
		let location: (string | Location) & Location;
		let mockAssign = jest.fn();

		beforeEach(() => {
			mockAssign = jest.fn();
			location = window.location;
			Reflect.deleteProperty(window, 'location');

			Object.defineProperty(window, 'location', {
				value: { pathname: '/', assign: mockAssign },
				writable: true,
			});
		});

		afterEach(() => {
			window.location = location;
		});

		describe('If error status is 401 unauthorized', () => {
			let returnedAxiosError: AxiosError;
			const axiosError = Object.assign(new Error('You are not authorized.'), {
				response: { status: 401 },
			}) as unknown as AxiosError;

			it('should clear token', async () => {
				await TeamService.onResponseInterceptRejection(axiosError)
					.catch(jest.fn())
					.finally(() => expect(CookieService.clearToken).toHaveBeenCalled());
			});

			it('should return a rejected promise containing error', async () => {
				await TeamService.onResponseInterceptRejection(axiosError)
					.catch((error) => {
						returnedAxiosError = error;
					})
					.finally(() => expect(returnedAxiosError).toEqual(axiosError));
			});

			it('should redirect to login page with team name if NOT already on login or create page', async () => {
				window.location.pathname = '/team/superwoman';
				await TeamService.onResponseInterceptRejection(axiosError)
					.catch(jest.fn())
					.finally(() =>
						expect(mockAssign).toHaveBeenCalledWith('/login/superwoman')
					);
			});

			it('should NOT redirect to login page if already on the login page', async () => {
				window.location.pathname = '/login';
				await TeamService.onResponseInterceptRejection(axiosError)
					.catch(jest.fn())
					.finally(() => expect(mockAssign).not.toHaveBeenCalled());
			});

			it('should NOT redirect to login page if already on the create page', async () => {
				window.location.pathname = '/create';
				await TeamService.onResponseInterceptRejection(axiosError)
					.catch(jest.fn())
					.finally(() => expect(mockAssign).not.toHaveBeenCalled());
			});

			it('should NOT redirect to login page if already on the request password reset page', async () => {
				window.location.pathname = REQUEST_PASSWORD_RESET_PAGE_PATH;
				await TeamService.onResponseInterceptRejection(axiosError)
					.catch(jest.fn())
					.finally(() => expect(mockAssign).not.toHaveBeenCalled());
			});
		});

		describe('If error status is 403 forbidden', () => {
			let returnedAxiosError: AxiosError;
			const axiosError = Object.assign(new Error('You are forbidden.'), {
				response: { status: 403 },
			}) as unknown as AxiosError;

			it('should clear token', async () => {
				await TeamService.onResponseInterceptRejection(axiosError)
					.catch(jest.fn())
					.finally(() => expect(CookieService.clearToken).toHaveBeenCalled());
			});

			it('should return a rejected promise containing error', async () => {
				await TeamService.onResponseInterceptRejection(axiosError)
					.catch((error) => {
						returnedAxiosError = error;
					})
					.finally(() => expect(returnedAxiosError).toEqual(axiosError));
			});

			it('should redirect to login page if NOT already on login or create page', async () => {
				window.location.pathname = '/team/superwoman';
				await TeamService.onResponseInterceptRejection(axiosError)
					.catch(jest.fn())
					.finally(() =>
						expect(mockAssign).toHaveBeenCalledWith('/login/superwoman')
					);
			});

			it('should NOT redirect to login page if already on the login page', async () => {
				window.location.pathname = '/login';
				await TeamService.onResponseInterceptRejection(axiosError)
					.catch(jest.fn())
					.finally(() => expect(mockAssign).not.toHaveBeenCalled());
			});

			it('should NOT redirect to login page if already on the create page', async () => {
				window.location.pathname = '/create';
				await TeamService.onResponseInterceptRejection(axiosError)
					.catch(jest.fn())
					.finally(() => expect(mockAssign).not.toHaveBeenCalled());
			});
		});
	});
});
