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

import { snapshot_UNSTABLE } from 'recoil';

import Theme from '../Types/Theme';

import { getThemeClassFromUserSettings, ThemeState } from './ThemeState';

describe('Theme State', () => {
	describe('ThemeState', () => {
		it('should default theme to system theme', () => {
			const initialSnapshot = snapshot_UNSTABLE();
			const actual = initialSnapshot.getLoadable(ThemeState).valueOrThrow();
			expect(actual).toEqual('system-theme');
		});
	});

	describe('getThemeClassFromUserSettings', () => {
		it('should return light theme when localstorage theme is set to "light-theme"', () => {
			window.localStorage.setItem('theme', Theme.LIGHT);
			expect(getThemeClassFromUserSettings()).toBe('light-theme');
		});

		it('should return dark theme when localstorage theme is set to "dark-theme"', () => {
			window.localStorage.setItem('theme', Theme.DARK);
			expect(getThemeClassFromUserSettings()).toBe('dark-theme');
		});

		it('should return system preferences when no theme is set in localstorage', () => {
			window.localStorage.removeItem('theme');
			(window.matchMedia as jest.Mock).mockReturnValue({ matches: true });
			expect(getThemeClassFromUserSettings()).toBe('dark-theme');

			(window.matchMedia as jest.Mock).mockReturnValue({ matches: false });
			expect(getThemeClassFromUserSettings()).toBe('light-theme');
		});

		it('should return light theme when localstorage is set to "system-theme" and system preferences are light mode', () => {
			window.localStorage.setItem('theme', Theme.SYSTEM);
			(window.matchMedia as jest.Mock).mockReturnValue({ matches: false });
			expect(getThemeClassFromUserSettings()).toBe('light-theme');
		});

		it('should return dark theme when localstorage is set to "system-theme" and system preferences are dark mode', () => {
			window.localStorage.setItem('theme', Theme.SYSTEM);
			(window.matchMedia as jest.Mock).mockReturnValue({ matches: true });
			expect(getThemeClassFromUserSettings()).toBe('dark-theme');
		});
	});
});
