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
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { RecoilRoot } from 'recoil';

import * as ThemeState from '../../State/ThemeState';
import Theme from '../../Types/Theme';

import RetroQuestLogo from './RetroQuestLogo';

describe('RetroQuestLogo', () => {
	function renderLogo() {
		return render(
			<RecoilRoot>
				<RetroQuestLogo />
			</RecoilRoot>
		);
	}

	it('should render without axe errors', async () => {
		const { container } = renderLogo();
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});

	it('should render title and link correctly', () => {
		renderLogo();
		screen.getByText('RetroQuest');
		expect(screen.getByText('FordLabs').getAttribute('href')).toBe(
			'https://fordlabs.com'
		);
	});

	describe('Icon', () => {
		it('should render light image in dark mode or system mode and system preferences are dark mode', () => {
			jest
				.spyOn(ThemeState, 'getThemeClassFromUserSettings')
				.mockImplementation(() => Theme.DARK);
			renderLogo();
			expect(screen.getByTestId('retroquestLogoImage')).toHaveAttribute(
				'src',
				'icon-light-72x72.png'
			);
		});

		it('should render dark image in light mode or system mode and system preferences are light mode', () => {
			jest
				.spyOn(ThemeState, 'getThemeClassFromUserSettings')
				.mockImplementation(() => Theme.LIGHT);
			renderLogo();
			expect(screen.getByTestId('retroquestLogoImage')).toHaveAttribute(
				'src',
				'icon-72x72.png'
			);
		});
	});
});
