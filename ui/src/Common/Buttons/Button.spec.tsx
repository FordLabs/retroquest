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

import { PrimaryButton, SecondaryButton } from './Button';

const mockOnClick = jest.fn();

describe('Buttons', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('PrimaryButton', () => {
		it('should render and click', () => {
			render(
				<PrimaryButton onClick={mockOnClick}>PrimaryButton</PrimaryButton>
			);
			const buttonText = screen.getByText('PrimaryButton');

			userEvent.click(buttonText);

			// eslint-disable-next-line testing-library/no-node-access
			expect(buttonText.parentElement?.className).toContain('primary');
			expect(mockOnClick).toHaveBeenCalledTimes(1);
		});
	});

	describe('SecondaryButton', () => {
		it('should render and click', () => {
			render(
				<SecondaryButton onClick={mockOnClick}>SecondaryButton</SecondaryButton>
			);
			const buttonText = screen.getByText('SecondaryButton');

			userEvent.click(buttonText);

			// eslint-disable-next-line testing-library/no-node-access
			expect(buttonText.parentElement?.className).toContain('secondary');
			expect(mockOnClick).toHaveBeenCalledTimes(1);
		});
	});
});
