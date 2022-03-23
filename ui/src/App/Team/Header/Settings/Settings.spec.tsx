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
import userEvent from '@testing-library/user-event';
import { RecoilRoot } from 'recoil';

import {
	ModalContents,
	ModalContentsState,
} from '../../../../State/ModalContentsState';
import { RecoilObserver } from '../../../../Utils/RecoilObserver';

import Settings from './Settings';

const mockLogout = jest.fn();

jest.mock('../../../../Hooks/useAuth', () => {
	return jest.fn(() => ({
		logout: mockLogout,
	}));
});

describe('Settings', () => {
	let modalContent: ModalContents | null;

	beforeEach(() => {
		jest.clearAllMocks();

		render(
			<RecoilRoot
				initializeState={({ set }) => {
					set(ModalContentsState, {
						title: 'Settings',
						component: <Settings />,
					});
				}}
			>
				<RecoilObserver
					recoilState={ModalContentsState}
					onChange={(value: ModalContents) => {
						modalContent = value;
					}}
				/>
				<Settings />
			</RecoilRoot>
		);
	});

	describe('Styles Tab', () => {
		it('should change theme from light to dark and back', () => {
			userEvent.click(screen.getByText('Appearance'));

			const lightThemeButton = screen.getByAltText('Light Theme');
			const darkThemeButton = screen.getByAltText('Dark Theme');

			expect(lightThemeButton.getAttribute('class')).toContain('selected');
			expect(darkThemeButton.getAttribute('class')).not.toContain('selected');

			userEvent.click(darkThemeButton);

			expect(lightThemeButton.getAttribute('class')).not.toContain('selected');
			expect(darkThemeButton.getAttribute('class')).toContain('selected');

			userEvent.click(lightThemeButton);

			expect(lightThemeButton.getAttribute('class')).toContain('selected');
			expect(darkThemeButton.getAttribute('class')).not.toContain('selected');
		});
	});

	describe('Account Tab', () => {
		it('should logout', () => {
			expect(modalContent).not.toBeNull();
			userEvent.click(screen.getByText('Account'));
			userEvent.click(screen.getByText('Logout'));

			expect(mockLogout).toHaveBeenCalledTimes(1);
			expect(modalContent).toBeNull();
		});
	});

	describe('Info Tab', () => {
		it('should show app version', () => {
			userEvent.click(screen.getByText('Info'));
			expect(screen.getByLabelText('Version:').getAttribute('value')).toBe(
				'0ddb411'
			);
		});
	});
});
