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

import TeamService, { AuthResponse } from './TeamService';

describe('Team Service', () => {
	const teamId = 'team-id';
	const user = {
		name: 'Julia',
		password: 'Password1',
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
			expect(axios.post).toHaveBeenCalledWith('/api/team/login', user);
		});
	});

	describe('create', () => {
		it('should create a retroquest team', async () => {
			axios.post = jest.fn().mockResolvedValue(axiosResponse);
			const authResponse: AuthResponse = await TeamService.create(
				user.name,
				user.password
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
});
