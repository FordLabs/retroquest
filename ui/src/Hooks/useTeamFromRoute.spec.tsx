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

import { ReactNode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { RecoilRoot } from 'recoil';
import TeamService from 'Services/Api/TeamService';
import Team from 'Types/Team';

import useTeamFromRoute from './useTeamFromRoute';

jest.mock('Services/Api/TeamService');

const teamId = 'active-team-name';
describe('useTeamFromRoute Hook', () => {
	let result: { current: Team };
	const expectedTeam: Team = {
		name: 'Active Team Name',
		id: teamId,
		email: 'a@b.c',
		secondaryEmail: 'b@b.c',
	};

	beforeEach(async () => {
		document.title = '';

		TeamService.getTeam = jest.fn().mockResolvedValue(expectedTeam);

		({ result } = renderHook(() => useTeamFromRoute(), { wrapper }));

		await waitFor(() =>
			expect(TeamService.getTeam).toHaveBeenCalledWith(teamId)
		);
	});

	it('should get and return active team if team id is in route path', () => {
		expect(result.current).toEqual(expectedTeam);
	});

	it('should set document title', () => {
		expect(document.title).toBe('Active Team Name | RetroQuest');
	});
});

const wrapper = ({ children }: { children: ReactNode }) => (
	<MemoryRouter initialEntries={[`/path/${teamId}`]}>
		<RecoilRoot>
			<Routes>
				<Route path="/path/:teamId" element={children} />
			</Routes>
		</RecoilRoot>
	</MemoryRouter>
);
