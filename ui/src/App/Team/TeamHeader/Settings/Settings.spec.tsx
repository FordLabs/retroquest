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
import { MutableSnapshot } from 'recoil';
import { EnvironmentConfigState } from 'State/EnvironmentConfigState';
import renderWithRecoilRoot from 'Utils/renderWithRecoilRoot';

import Settings, { SettingsTabs } from './Settings';

describe('Settings', () => {
	it('should be on the styles tab by default', () => {
		renderWithRecoilRoot(<Settings />, getRecoilState());
		expect(hasSelectedTabClass(getStylesTab())).toBeTruthy();
		expect(screen.getByText('Appearance')).toBeInTheDocument();
		expect(screen.queryByTestId('accountTab')).not.toBeInTheDocument();
		expect(screen.queryByText('Version:')).not.toBeInTheDocument();
	});

	it('should start on a different tab if specified via prop', () => {
		renderWithRecoilRoot(
			<Settings activeTab={SettingsTabs.ACCOUNT} />,
			getRecoilState()
		);
		expect(hasSelectedTabClass(getAccountTab())).toBeTruthy();
		expect(screen.getByText('Add Board Owners')).toBeInTheDocument();
	});

	it('should pre-populate "Add Board Owners" if emails are passed down via props', () => {
		renderWithRecoilRoot(
			<Settings
				activeTab={SettingsTabs.ACCOUNT}
				accountTabData={{
					email1: 'email1@mail.com',
					email2: 'email2@mail.com',
				}}
			/>,
			getRecoilState()
		);
		expect(hasSelectedTabClass(getAccountTab())).toBeTruthy();
		expect(screen.getByText('Add Board Owners')).toBeInTheDocument();

		const email1Field = screen.getByLabelText('Email Address 1');
		expect(email1Field).toHaveValue('email1@mail.com');
		const email2Field = screen.getByLabelText(
			'Second Teammate’s Email (optional)'
		);
		expect(email2Field).toHaveValue('email2@mail.com');
	});

	it('should go to the account settings when user clicks on the account tab', () => {
		renderWithRecoilRoot(<Settings />, getRecoilState());
		userEvent.click(getAccountTab());
		expect(hasSelectedTabClass(getAccountTab())).toBeTruthy();
		expect(screen.getByTestId('accountTab')).toBeInTheDocument();
	});

	it('should go to the styles settings when user clicks on the styles tab', () => {
		renderWithRecoilRoot(<Settings />, getRecoilState());
		userEvent.click(getAccountTab());
		const stylesTab = getStylesTab();
		expect(hasSelectedTabClass(stylesTab)).toBeFalsy();
		userEvent.click(stylesTab);
		expect(hasSelectedTabClass(stylesTab)).toBeTruthy();
		expect(screen.getByText('Appearance')).toBeInTheDocument();
	});

	it('should go to the info settings when user clicks on the info tab', () => {
		renderWithRecoilRoot(<Settings />, getRecoilState());
		const infoTab = getInfoTab();
		expect(hasSelectedTabClass(infoTab)).toBeFalsy();

		userEvent.click(infoTab);

		expect(hasSelectedTabClass(infoTab)).toBeTruthy();
		expect(screen.getByText('Version:')).toBeInTheDocument();
	});

	it('should hide account tab if email is not enabled', () => {
		renderWithRecoilRoot(<Settings />, getRecoilState(false));

		expect(screen.queryByText('Account')).toBeNull();
		expect(getStylesTab()).toBeInTheDocument();
		expect(getInfoTab()).toBeInTheDocument();
	});
});

function getRecoilState(emailEnabled = true) {
	return ({ set }: MutableSnapshot) => {
		set(EnvironmentConfigState, {
			email_is_enabled: emailEnabled,
			email_from_address: '',
		});
	};
}

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
