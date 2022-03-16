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
import { atom } from 'recoil';

import { TEAM_PAGE_ROOT } from '../RouteConstants';
import Theme from '../Types/Theme';

const ITEM_KEY = 'theme';

export const ThemeState = atom<Theme>({
	key: 'themeState',
	default: getThemeUserSettings(),
	effects_UNSTABLE: [
		({ onSet }) => {
			onSet((newTheme) => {
				if (isNotLoggedIn()) return Theme.LIGHT;

				const isDarkMode = newTheme === Theme.DARK;
				if (isDarkMode) {
					document.body.classList.add(Theme.DARK);
					localStorage.setItem(ITEM_KEY, Theme.DARK);
				} else {
					document.body.classList.remove(Theme.DARK);
					localStorage.setItem(ITEM_KEY, Theme.LIGHT);
				}
			});
		},
	],
});

function getThemeUserSettings() {
	if (isNotLoggedIn()) return Theme.LIGHT;

	const activeTheme = localStorage.getItem(ITEM_KEY) as Theme;
	if (activeTheme === Theme.DARK) {
		document.body.classList.add(Theme.DARK);
	}
	return activeTheme || Theme.LIGHT;
}

function isNotLoggedIn() {
	const { pathname } = window.location;
	return !pathname.includes(TEAM_PAGE_ROOT);
}
