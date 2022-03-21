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

import TeamService from '../Services/Api/TeamService';

import useGetTeamName from './useGetTeamName';

jest.mock('../Services/Api/TeamService');

const teamId = 'active-team-name';
describe('useTeam Hook', () => {
	let result: { current: { name: any; id: any } };

	beforeEach(async () => {
		document.title = '';

		({ result } = renderHook(() => useGetTeamName(), { wrapper }));

		await waitFor(() =>
			expect(TeamService.getTeamName).toHaveBeenCalledWith(teamId)
		);
	});

	it('should get and return active team name if team id is in route path', () => {
		expect(result.current.name).toBe('Active Team Name');
		expect(result.current.id).toBe(teamId);
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
