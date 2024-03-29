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
import Team from 'Types/Team';

import { REQUEST_PASSWORD_RESET_PAGE_PATH } from '../../RouteConstants';
import CookieService from '../CookieService';

import TeamService, { AuthResponse } from './TeamService';

jest.mock('../CookieService');

describe('Team Service', () => {
	const teamId = 'team-id';
	const teamData = {
		name: 'Julia',
		password: 'Password1',
		email: 'e@mail.com',
		secondaryEmail: 'e2@mail2.com',
	};
	const axiosResponse = {
		data: 'jwt-token-123',
		headers: { location: teamId },
	};
	const fakeToken = 'fake-token';
	const mockConfig = { headers: { Authorization: `Bearer ${fakeToken}` } };

	beforeAll(() => {
		CookieService.getToken = jest.fn().mockReturnValue(fakeToken);
	});

	describe('login', () => {
		it('should login to retroquest', async () => {
			axios.post = jest.fn().mockResolvedValue(axiosResponse);
			const authResponse: AuthResponse = await TeamService.login(
				teamData.name,
				teamData.password
			);
			expect(authResponse).toEqual({
				token: authResponse.token,
				teamId,
			});
			expect(axios.post).toHaveBeenCalledWith('/api/team/login', {
				name: teamData.name,
				password: teamData.password,
			});
		});
	});

	describe('create', () => {
		it('should create a retroquest team', async () => {
			axios.post = jest.fn().mockResolvedValue(axiosResponse);
			const authResponse: AuthResponse = await TeamService.create(
				teamData.name,
				teamData.password,
				teamData.email,
				teamData.secondaryEmail
			);
			expect(authResponse).toEqual({
				token: authResponse.token,
				teamId,
			});
			expect(axios.post).toHaveBeenCalledWith('/api/team', teamData);
		});
	});

	describe('getTeam', () => {
		it('should get team name by team id', async () => {
			const expectedTeam: Team = {
				id: 'team-id',
				name: 'Team Name',
				email: '',
				secondaryEmail: '',
			};
			axios.get = jest.fn().mockResolvedValue({ data: expectedTeam });
			const actualTeam = await TeamService.getTeam(expectedTeam.id);
			expect(actualTeam).toBe(expectedTeam);
			expect(axios.get).toHaveBeenCalledWith(
				`/api/team/${expectedTeam.id}`,
				mockConfig
			);
		});
	});

	describe('updateTeamEmails', () => {
		it('should get team name by team id', async () => {
			const teamId = 'team-id';
			await TeamService.updateTeamEmailAddresses(
				teamId,
				'primary@mail.com',
				'secondary@mail.com'
			);
			expect(axios.put).toHaveBeenCalledWith(
				`/api/team/${teamId}/email-addresses`,
				{
					email1: 'primary@mail.com',
					email2: 'secondary@mail.com',
				},
				mockConfig
			);
		});
	});

	describe('getTeamName', () => {
		it('should get team name by team id', async () => {
			axios.get = jest.fn().mockResolvedValue({ data: teamData.name });
			const actualTeamName = await TeamService.getTeamName(teamId);
			expect(actualTeamName).toBe(teamData.name);
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
				headers: {
					Authorization: 'Bearer fake-token',
				},
				responseType: 'blob',
				timeout: 30000,
			});
		});
	});

	describe('updateEmailsWithResetToken', () => {
		it('should post emails to /email/reset with the token', async () => {
			axios.post = jest.fn();
			await TeamService.updateEmailsWithResetToken(
				'e1@ma.il',
				'e2@ma.il',
				'T0k3n'
			);

			expect(axios.post).toHaveBeenCalledWith('/api/team/email/reset', {
				email: 'e1@ma.il',
				secondaryEmail: 'e2@ma.il',
				resetToken: 'T0k3n',
			});
		});
	});

	describe('setPasswordWithResetToken', () => {
		it('should post password to /password/reset with the token', async () => {
			axios.post = jest.fn();
			await TeamService.setPasswordWithResetToken('wordword', 'T0k3n');

			expect(axios.post).toHaveBeenCalledWith('/api/team/password/reset', {
				password: 'wordword',
				resetToken: 'T0k3n',
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
