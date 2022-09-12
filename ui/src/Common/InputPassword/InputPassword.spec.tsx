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

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ThemeState } from '../../State/ThemeState';
import Theme from '../../Types/Theme';
import renderWithRecoilRoot from '../../Utils/renderWithRecoilRoot';

import InputPassword from './InputPassword';

describe('Input Password', () => {
	it('should hide password and show opened eye icon by default', () => {
		renderWithRecoilRoot(
			<InputPassword
				password="HideMyPassword!"
				onPasswordInputChange={() => {}}
			/>
		);

		expect(screen.queryByText('HideMyPassword!')).toBeNull();
		shouldShowOpenedEyeIconAndNotClosedEyeIcon();
	});

	it('should show password and closed eye icon when opened eye icon is clicked', () => {
		renderWithRecoilRoot(
			<InputPassword
				password="ShowMyPassword!"
				onPasswordInputChange={() => {}}
			/>
		);

		clickOnEyeIcon('Show Password');

		expect(screen.getByDisplayValue('ShowMyPassword!')).toBeInTheDocument();
		const closedEyeIcon = screen.getByLabelText('Hide Password');
		expect(closedEyeIcon).toBeDefined();
		const openEyeIcon = screen.queryByLabelText('Show Password');
		expect(openEyeIcon).toBeNull();
	});

	it('should hide password and opened eye icon when closed eye icon is clicked', () => {
		renderWithRecoilRoot(
			<InputPassword
				password="HideMyPasswordAgain!"
				onPasswordInputChange={() => {}}
			/>
		);

		clickOnEyeIcon('Show Password');
		clickOnEyeIcon('Hide Password');

		expect(screen.queryByText('HideMyPasswordAgain!')).toBeNull();
		shouldShowOpenedEyeIconAndNotClosedEyeIcon();
	});

	it('should eye icons should be blue in light mode', () => {
		renderWithRecoilRoot(
			<InputPassword password="" onPasswordInputChange={() => {}} />,
			({ set }) => {
				set(ThemeState, Theme.LIGHT);
			}
		);
		const eyeOpenIcon = screen.getByTestId('eyeOpenIcon');
		expect(eyeOpenIcon.getAttribute('fill')).toBe('#34495E');
		clickOnEyeIcon('Show Password');
		const eyeSlashIcon = screen.getByTestId('eyeSlashIcon');
		expect(eyeSlashIcon.getAttribute('fill')).toBe('#34495E');
	});

	it('should eye icons should be off white in dark mode', () => {
		renderWithRecoilRoot(
			<InputPassword password="" onPasswordInputChange={() => {}} />,
			({ set }) => {
				set(ThemeState, Theme.DARK);
			}
		);
		const eyeOpenIcon = screen.getByTestId('eyeOpenIcon');
		expect(eyeOpenIcon.getAttribute('fill')).toBe('#ecf0f1');
		clickOnEyeIcon('Show Password');
		const eyeSlashIcon = screen.getByTestId('eyeSlashIcon');
		expect(eyeSlashIcon.getAttribute('fill')).toBe('#ecf0f1');
	});
});

function clickOnEyeIcon(iconButtonAriaLabel: string) {
	userEvent.click(screen.getByLabelText(iconButtonAriaLabel));
}

function shouldShowOpenedEyeIconAndNotClosedEyeIcon() {
	const openEyeIcon = screen.getByLabelText('Show Password');
	expect(openEyeIcon).toBeDefined();
	const closedEyeIcon = screen.queryByLabelText('Hide Password');
	expect(closedEyeIcon).toBeNull();
}