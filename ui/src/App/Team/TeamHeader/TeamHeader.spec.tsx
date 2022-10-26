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
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { RecoilRoot } from 'recoil';
import { EnvironmentConfigState } from 'State/EnvironmentConfigState';
import { ModalContents, ModalContentsState } from 'State/ModalContentsState';
import { TeamState } from 'State/TeamState';
import * as ThemeState from 'State/ThemeState';
import Team from 'Types/Team';
import Theme from 'Types/Theme';
import { RecoilObserver } from 'Utils/RecoilObserver';

import Settings, { SettingsTabs } from './Settings/Settings';
import TeamHeader from './TeamHeader';

const teamName = 'Lucille Ball';
const teamId = 'lucille-ball';

jest.mock('Hooks/useTeamFromRoute', () => {
	return (): Team => ({
		name: teamName,
		id: teamId,
		email: '',
		secondaryEmail: '',
	});
});
let modalContent: ModalContents | null;
const emptyTeam = {
	id: '',
	name: '',
	email: '',
	secondaryEmail: '',
};

describe('Team Header', () => {
	beforeEach(() => {
		modalContent = null;
	});

	it('should render without axe errors', async () => {
		const { container } = renderTeamHeader();
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});

	it('should render logo link and team name', async () => {
		renderTeamHeader();
		expect(await screen.findByText(teamName)).toBeDefined();

		const retroQuestLogoLink = screen.getByTestId('retroquestLogoLink');
		expect(retroQuestLogoLink.getAttribute('href')).toBe('/');
		expect(
			within(retroQuestLogoLink).getByAltText('Retro Quest')
		).toBeDefined();
	});

	it('should render nav links', async () => {
		renderTeamHeader();
		const archivesLink = screen.getByText('Archives');
		expect(archivesLink.getAttribute('href')).toBe(`/team/${teamId}/archives`);

		const radiatorLink = screen.getByText('Radiator');
		expect(radiatorLink.getAttribute('href')).toBe(`/team/${teamId}/radiator`);

		const retroLink = screen.getByText('Retro');
		expect(retroLink.getAttribute('href')).toBe(`/team/${teamId}`);
	});

	it('should open settings modal', () => {
		renderTeamHeader();
		userEvent.click(screen.getByTestId('settingsButton'));
		expect(modalContent).toEqual({
			title: 'Settings',
			component: <Settings />,
		});
	});

	describe('Icon', () => {
		it('should render light image in dark mode or system mode and system preferences are dark mode', () => {
			jest
				.spyOn(ThemeState, 'getThemeClassFromUserSettings')
				.mockImplementation(() => Theme.DARK);
			renderTeamHeader();
			expect(screen.getByAltText('Retro Quest')).toHaveAttribute(
				'src',
				'icon-light-72x72.png'
			);
		});

		it('should render dark image in light mode or system mode and system preferences are light mode', () => {
			jest
				.spyOn(ThemeState, 'getThemeClassFromUserSettings')
				.mockImplementation(() => Theme.LIGHT);
			renderTeamHeader();
			expect(screen.getByAltText('Retro Quest')).toHaveAttribute(
				'src',
				'icon-72x72.png'
			);
		});
	});

	describe('Change your password banner', () => {
		it('should show banner if email is enabled & team has no email addresses saved', () => {
			renderTeamHeader(emptyTeam, true);
			expect(screen.getByTestId('banner')).toBeInTheDocument();
		});

		it('should hide banner if email is disabled', () => {
			renderTeamHeader(emptyTeam, false);
			expect(screen.queryByTestId('banner')).toBeNull();
		});

		it('should hide banner if email is enabled, but team as email addresses saved', () => {
			renderTeamHeader({ ...emptyTeam, email: 'a@b.c' }, false);
			expect(screen.queryByTestId('banner')).toBeNull();
		});

		it('should close banner by clicking x', () => {
			renderTeamHeader(emptyTeam, true);
			expect(screen.getByTestId('banner')).toBeInTheDocument();
			screen.getByTestId('closeBannerButton').click();
			expect(screen.queryByTestId('banner')).toBeNull();
		});

		it('should open settings modal on "Set It Up Here" button click', async () => {
			renderTeamHeader(emptyTeam, true);
			expect(modalContent).toBeNull();
			screen.getByText('Set It Up Here').click();
			await waitFor(() =>
				expect(modalContent).toEqual({
					title: 'Settings',
					component: <Settings activeTab={SettingsTabs.ACCOUNT} />,
				})
			);
		});
	});
});

function renderTeamHeader(
	team: Team = emptyTeam,
	emailIsEnabled: boolean = true
) {
	return render(
		<MemoryRouter initialEntries={[`/team/${teamId}`]}>
			<RecoilRoot
				initializeState={({ set }) => {
					set(EnvironmentConfigState, {
						email_is_enabled: emailIsEnabled,
						email_from_address: '',
					});
					set(TeamState, team);
				}}
			>
				<RecoilObserver
					recoilState={ModalContentsState}
					onChange={(value: ModalContents) => {
						modalContent = value;
					}}
				/>
				<Routes>
					<Route path="/team/:teamId" element={<TeamHeader />} />
				</Routes>
			</RecoilRoot>
		</MemoryRouter>
	);
}
