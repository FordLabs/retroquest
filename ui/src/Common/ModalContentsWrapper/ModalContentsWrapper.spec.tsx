/*
 * Copyright (c) 2021 Ford Motor Company
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
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ModalContentsWrapper from './ModalContentsWrapper';

describe('ModalContentsWrapper', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('default dialog', () => {
		beforeEach(() => {
			render(
				<ModalContentsWrapper
					title="ModalContentsWrapper Header"
					subtitle="ModalContentsWrapper Sub Header"
				>
					ModalContentsWrapper Content
				</ModalContentsWrapper>
			);
		});

		it('should render header, subheader, and content', () => {
			screen.getByText('ModalContentsWrapper Header');
			screen.getByText('ModalContentsWrapper Sub Header');
			screen.getByText('ModalContentsWrapper Content');
		});

		it('should not be a form element if button props are not provided', () => {
			const dialog = screen.queryByRole('form');
			expect(dialog).toBeNull();
		});
	});

	describe('dialog with buttons', () => {
		let mockConfirmCallback: jest.Mock;
		let mockCancelCallback: jest.Mock;

		beforeEach(() => {
			mockConfirmCallback = jest.fn();
			mockCancelCallback = jest.fn();
			const buttons = {
				cancel: {
					text: 'Custom Cancel',
					onClick: mockCancelCallback,
				},
				confirm: {
					text: 'Custom Confirm',
					onClick: mockConfirmCallback,
				},
			};

			render(
				<ModalContentsWrapper
					title="ModalContentsWrapper Header"
					subtitle="ModalContentsWrapper Sub Header"
					buttons={buttons}
					testId="dialog"
				>
					ModalContentsWrapper Content
				</ModalContentsWrapper>
			);
		});

		it('should call cancel method when cancel button is clicked', () => {
			userEvent.click(screen.getByText('Custom Cancel'));
			expect(mockCancelCallback).toHaveBeenCalledTimes(1);
			expect(mockConfirmCallback).not.toHaveBeenCalled();
		});

		it('should call confirm method when confirm button is clicked', () => {
			userEvent.click(screen.getByText('Custom Confirm'));
			expect(mockConfirmCallback).toHaveBeenCalledTimes(1);
			expect(mockCancelCallback).not.toHaveBeenCalled();
		});

		xit('should be a form element if button props are provided', () => {
			const dialog = screen.getByRole('form');
			expect(dialog).toBeDefined();
		});
	});
});
