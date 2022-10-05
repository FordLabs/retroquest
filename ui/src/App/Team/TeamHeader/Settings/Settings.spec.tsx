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
import userEvent from '@testing-library/user-event';
import renderWithRecoilRoot from 'Utils/renderWithRecoilRoot';

import Settings from './Settings';

describe('Settings', () => {
	beforeEach(() => {
		renderWithRecoilRoot(<Settings />);
	});

	it('should be on the styles tab by default', () => {
		expect(hasSelectedTabClass(getStylesTab())).toBeTruthy();
		expect(screen.getByText('Appearance')).toBeInTheDocument();
		expect(screen.queryByTestId('accountTab')).not.toBeInTheDocument();
		expect(screen.queryByText('Version:')).not.toBeInTheDocument();
	});

	it('should go to the account settings when user clicks on the account tab', () => {
		userEvent.click(getAccountTab());
		expect(hasSelectedTabClass(getAccountTab())).toBeTruthy();
		expect(screen.getByTestId('accountTab')).toBeInTheDocument();
	});

	it('should go to the styles settings when user clicks on the styles tab', () => {
		userEvent.click(getAccountTab());
		const stylesTab = getStylesTab();
		expect(hasSelectedTabClass(stylesTab)).toBeFalsy();
		userEvent.click(stylesTab);
		expect(hasSelectedTabClass(stylesTab)).toBeTruthy();
		expect(screen.getByText('Appearance')).toBeInTheDocument();
	});

	it('should go to the info settings when user clicks on the info tab', () => {
		const infoTab = getInfoTab();
		expect(hasSelectedTabClass(infoTab)).toBeFalsy();

		userEvent.click(infoTab);

		expect(hasSelectedTabClass(infoTab)).toBeTruthy();
		expect(screen.getByText('Version:')).toBeInTheDocument();
	});
});

function getStylesTab() {
	return screen.getByText('Styles');
}

function getAccountTab() {
	return screen.getByText('Account');
}

function getInfoTab() {
	return screen.getByText('Info');
}

function hasSelectedTabClass(element: HTMLElement): boolean {
	return element.classList.contains('selected');
}
