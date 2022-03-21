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

import React, { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import darkLogoPath from '../../../Assets/icons/icon-72x72.png';
import lightLogoPath from '../../../Assets/icons/icon-light-72x72.png';
import { ModalMethods } from '../../../Common/Modal/Modal';
import useGetTeamName from '../../../Hooks/useGetTeamName';
import { ThemeState } from '../../../State/ThemeState';
import Theme from '../../../Types/Theme';

import SettingsDialog from './SettingsDialog/SettingsDialog';

import './Header.scss';

type RqLink = {
	label: 'Retro' | 'Archives' | 'Radiator';
	path: string;
};

const LINKS: RqLink[] = [
	{ label: 'Retro', path: '' },
	{ label: 'Archives', path: '/archives' },
	{ label: 'Radiator', path: '/radiator' },
];

function Header() {
	const team = useGetTeamName();
	const [theme] = useRecoilState<Theme>(ThemeState);

	const modalRef = useRef<ModalMethods>(null);

	return (
		<>
			<header className="header">
				<div className="left-content">
					<a href="/" className="logo-link" data-testid="retroquestLogoLink">
						<img
							src={theme === Theme.DARK ? lightLogoPath : darkLogoPath}
							className="logo"
							title="RetroQuest"
							alt="RetroQuest"
						/>
					</a>
					<div className="horizontal-separator" />
					<div className="team-name">{team.name}</div>
				</div>
				<nav className="center-content">
					{LINKS.map((link, index) => (
						<NavLink
							to={`/team/${team.id}${link.path}`}
							key={link.path}
							className={({ isActive }) =>
								'nav-link button' + (isActive ? ' selected' : '')
							}
							end
						>
							{link.label}
						</NavLink>
					))}
				</nav>
				<div className="right-content">
					<button
						className="settings-button fas fa-cog"
						onClick={() => modalRef.current?.show()}
						data-testid="settingsButton"
					/>
				</div>
			</header>
			<SettingsDialog ref={modalRef} />
		</>
	);
}

export default Header;
