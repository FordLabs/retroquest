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

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import InputPassword from './InputPassword';

describe('Input Password', () => {
	it('should hide password and show opened eye icon by default', () => {
		render(
			<InputPassword
				password="HideMyPassword!"
				onPasswordInputChange={() => {}}
			/>
		);

		expect(screen.queryByText('HideMyPassword!')).toBeNull();
		shouldShowOpenedEyeIconAndNotClosedEyeIcon();
	});

	it('should show password and closed eye icon when opened eye icon is clicked', () => {
		render(
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
		render(
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
