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
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { RecoilRoot } from 'recoil';

import {
	ModalContents,
	ModalContentsState,
} from '../../../State/ModalContentsState';
import Team from '../../../Types/Team';
import { RecoilObserver } from '../../../Utils/RecoilObserver';

import Settings from './Settings/Settings';
import Header from './Header';

const teamName = 'Lucille Ball';
const teamId = 'lucille-ball';

jest.mock('../../../Hooks/useTeamFromRoute', () => {
	return (): Team => ({
		name: teamName,
		id: teamId,
	});
});

describe('Header', () => {
	let container: Element;
	let modalContent: ModalContents | null;

	beforeEach(() => {
		modalContent = null;

		({ container } = render(
			<MemoryRouter initialEntries={[`/team/${teamId}`]}>
				<RecoilRoot>
					<RecoilObserver
						recoilState={ModalContentsState}
						onChange={(value: ModalContents) => {
							modalContent = value;
						}}
					/>
					<Routes>
						<Route path="/team/:teamId" element={<Header />} />
					</Routes>
				</RecoilRoot>
			</MemoryRouter>
		));
	});

	it('should render without axe errors', async () => {
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});

	it('should render logo link and team name', async () => {
		expect(await screen.findByText(teamName)).toBeDefined();

		const retroQuestLogoLink = screen.getByTestId('retroquestLogoLink');
		expect(retroQuestLogoLink.getAttribute('href')).toBe('/');
		expect(within(retroQuestLogoLink).getByAltText('RetroQuest')).toBeDefined();
	});

	it('should render nav links', async () => {
		const archivesLink = screen.getByText('Archives');
		expect(archivesLink.getAttribute('href')).toBe(`/team/${teamId}/archives`);

		const radiatorLink = screen.getByText('Radiator');
		expect(radiatorLink.getAttribute('href')).toBe(`/team/${teamId}/radiator`);

		const retroLink = screen.getByText('Retro');
		expect(retroLink.getAttribute('href')).toBe(`/team/${teamId}`);
	});

	it('should open settings modal', () => {
		userEvent.click(screen.getByTestId('settingsButton'));
		expect(modalContent).toEqual({
			title: 'Settings',
			component: <Settings />,
		});
	});
});
