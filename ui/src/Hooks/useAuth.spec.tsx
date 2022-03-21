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
import { MemoryRouter } from 'react-router-dom';
import { act, renderHook } from '@testing-library/react-hooks';
import { RecoilRoot } from 'recoil';

import { AuthResponse } from '../Services/Api/TeamService';
import CookieService from '../Services/CookieService';
import { TeamState } from '../State/TeamState';

import useAuth from './useAuth';

jest.mock('../Services/CookieService');

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
	...(jest.requireActual('react-router-dom') as any),
	useNavigate: () => mockedUsedNavigate,
}));

describe('useAuth Hook', () => {
	const wrapper = ({ children }: { children: ReactNode }) => (
		<MemoryRouter initialEntries={['/login']}>
			<RecoilRoot
				initializeState={({ set }) => {
					set(TeamState, { name: 'My Team', id: 'my-team' });
				}}
			>
				{children}
			</RecoilRoot>
		</MemoryRouter>
	);

	it('Login: should set token and go to retro page', () => {
		const { result } = renderHook(() => useAuth(), { wrapper });
		const authResponse: AuthResponse = {
			token: 'fake-jwt-token',
			teamId: 'my-team-id',
		};

		act(() => {
			result.current.login(authResponse);
		});

		expect(CookieService.setToken).toHaveBeenCalledWith(authResponse.token);
		expect(mockedUsedNavigate).toHaveBeenCalledWith(
			`/team/${authResponse.teamId}`,
			{
				replace: true,
			}
		);
	});

	it('Logout: should clear token and go to login page', () => {
		const { result } = renderHook(() => useAuth(), { wrapper });

		act(() => {
			result.current.logout();
		});

		expect(CookieService.clearToken).toHaveReturned();
		expect(mockedUsedNavigate).toHaveBeenCalledWith(`/login/my-team`, {
			replace: true,
		});
	});
});
