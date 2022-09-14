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

import React, { ReactNode } from 'react';
import darkLogoPath from 'Assets/icons/icon-72x72.png';
import lightLogoPath from 'Assets/icons/icon-light-72x72.png';
import { getThemeClassFromUserSettings } from 'State/ThemeState';
import Theme from 'Types/Theme';

import './Header.scss';

interface Props {
	name: string;
	children?: ReactNode;
}

function Header(props: Props) {
	const { name, children } = props;

	const retroquestLogo =
		getThemeClassFromUserSettings() === Theme.DARK
			? lightLogoPath
			: darkLogoPath;

	return (
		<header className="header">
			<div className="left-content">
				<a href="/" className="logo-link" data-testid="retroquestLogoLink">
					<img
						src={retroquestLogo}
						className="logo"
						title="RetroQuest"
						alt="Retro Quest"
					/>
				</a>
				<span className="horizontal-separator" />
				<h1 className="team-name">{name}</h1>
			</div>
			{children}
		</header>
	);
}

export default Header;
