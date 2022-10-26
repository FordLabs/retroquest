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
import Header from 'Common/Header/Header';
import useTeamFromRoute from 'Hooks/useTeamFromRoute';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { EnvironmentConfigState } from 'State/EnvironmentConfigState';
import { ModalContentsState } from 'State/ModalContentsState';

import Banner from './Banner/Banner';
import Settings from './Settings/Settings';
import TeamHeaderNavLink from './TeamHeaderNavLink/TeamHeaderNavLink';

import './TeamHeader.scss';

type RqLink = {
	label: 'Retro' | 'Archives' | 'Radiator';
	path: string;
};

const LINKS: RqLink[] = [
	{ label: 'Retro', path: '' },
	{ label: 'Archives', path: '/archives' },
	{ label: 'Radiator', path: '/radiator' },
];

function TeamHeader() {
	const team = useTeamFromRoute();
	const environmentConfig = useRecoilValue(EnvironmentConfigState);
	const setModalContents = useSetRecoilState(ModalContentsState);

	function showBanner(): boolean {
		const teamHasNoEmails = !team.email && !team.secondaryEmail;
		const emailIsEnabled = environmentConfig?.email_is_enabled === true;
		return emailIsEnabled && teamHasNoEmails;
	}

	return (
		<>
			{showBanner() && <Banner />}
			<Header name={team.name}>
				<>
					<nav className="center-content">
						{LINKS.map((link) => (
							<React.Fragment key={link.path}>
								<TeamHeaderNavLink to={`/team/${team.id}${link.path}`}>
									{link.label}
								</TeamHeaderNavLink>
							</React.Fragment>
						))}
					</nav>
					<div className="right-content">
						<button
							className="settings-button fas fa-cog"
							onClick={() =>
								setModalContents({
									title: 'Settings',
									component: <Settings />,
								})
							}
							aria-label="Settings"
							data-testid="settingsButton"
						/>
					</div>
				</>
			</Header>
		</>
	);
}

export default TeamHeader;
