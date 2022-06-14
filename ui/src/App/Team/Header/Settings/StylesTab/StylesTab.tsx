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

import * as React from 'react';
import classnames from 'classnames';
import { useRecoilState } from 'recoil';

import darkThemeImagePath from '../../../../../Assets/dark-theme-picture.jpg';
import lightThemeImagePath from '../../../../../Assets/light-theme-picture.jpg';
import systemThemeImagePath from '../../../../../Assets/system-theme-picture.jpg';
import { ThemeState } from '../../../../../State/ThemeState';
import Theme from '../../../../../Types/Theme';

import './StylesTab.scss';

function StylesTab(): JSX.Element {
	const [theme, setTheme] = useRecoilState<Theme>(ThemeState);

	return (
		<div className="tab-body styles-tab-body">
			<div className="label">Appearance</div>
			<div className="theme-buttons">
				<button
					className="theme-icon-button"
					onClick={() => setTheme(Theme.LIGHT)}
				>
					<img
						src={lightThemeImagePath}
						className={classnames('theme-image', {
							selected: theme === Theme.LIGHT,
						})}
						alt="Light Theme"
					/>
					<div className="theme-icon-label">light</div>
				</button>
				<button
					className="theme-icon-button"
					onClick={() => setTheme(Theme.DARK)}
				>
					<img
						src={darkThemeImagePath}
						className={classnames('theme-image', {
							selected: theme === Theme.DARK,
						})}
						alt="Dark Theme"
					/>
					<div className="theme-icon-label">dark</div>
				</button>
				<button
					className="theme-icon-button"
					onClick={() => setTheme(Theme.SYSTEM)}
				>
					<img
						src={systemThemeImagePath}
						className={classnames('theme-image', {
							selected: theme === Theme.SYSTEM,
						})}
						alt="System Settings Theme"
					/>
					<div className="theme-icon-label">System Settings</div>
				</button>
			</div>
		</div>
	);
}

export default StylesTab;
