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

import React from 'react';
import { screen } from '@testing-library/react';
import { MutableSnapshot } from 'recoil';
import { TeamState } from 'State/TeamState';
import Team from 'Types/Team';
import renderWithRecoilRoot from 'Utils/renderWithRecoilRoot';

import AccountTab from './AccountTab';

describe('Account Tab', () => {
	const addBoardOwnersFormTitle = 'Add Board Owners';
	const boardOwnersFormTitle = 'Board Owners';
	let activeTeam: Team;

	beforeEach(() => {
		activeTeam = {
			id: 'name-1',
			name: 'Name',
			email: '',
			secondaryEmail: '',
		};
	});

	it('should show "Add Board Owners" form if NO emails are present', async () => {
		renderAccountTab(({ set }) => {
			set(TeamState, activeTeam);
		});

		expect(await screen.findByText(addBoardOwnersFormTitle)).toBeDefined();
		expect(screen.queryByText(boardOwnersFormTitle)).toBeNull();
	});

	it('should NOT show "Add Board Owners" form if team has a primary email', () => {
		activeTeam.email = 'a@b.c';
		renderAccountTab(({ set }) => {
			set(TeamState, activeTeam);
		});

		expect(screen.queryByText(addBoardOwnersFormTitle)).toBeDefined();
		expect(screen.getByText(boardOwnersFormTitle)).toBeDefined();
	});

	it('should NOT show "Add Board Owners" form if team has a secondary email', () => {
		activeTeam.email = 'a@b.c';
		renderAccountTab(({ set }) => {
			set(TeamState, activeTeam);
		});

		expect(screen.queryByText(addBoardOwnersFormTitle)).toBeDefined();
		expect(screen.getByText(boardOwnersFormTitle)).toBeDefined();
	});
});

function renderAccountTab(
	recoilState?: (mutableSnapshot: MutableSnapshot) => void
) {
	renderWithRecoilRoot(<AccountTab />, recoilState);
}
