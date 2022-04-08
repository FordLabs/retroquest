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
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Textarea from './Textarea';

describe('Textarea', () => {
	const mockOnChange = jest.fn();
	const mockOnEnter = jest.fn();
	const mockInitialValue = 'Sample Text';

	beforeEach(() => {
		Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
			configurable: true,
			value: 100,
		});

		render(
			<Textarea
				initialValue={mockInitialValue}
				onEnter={mockOnEnter}
				onChange={mockOnChange}
			/>
		);
	});

	it('should populate textarea with initial value', () => {
		expect(getTextarea()).toHaveValue(mockInitialValue);
	});

	it('should auto focus on textarea', () => {
		expect(getTextarea()).toHaveFocus();
	});

	it('should set the size of the textarea based on textarea scrollHeight', () => {
		expect(getTextarea()).toHaveAttribute('style', 'height: 100px;');
	});

	it('should show character count', () => {
		screen.getByText('244');
		userEvent.type(getTextarea(), '1234565789123456789123456789');
		screen.getByText('227');
	});

	it('should auto select value & trigger onChange when text is typed into textarea', async () => {
		userEvent.type(getTextarea(), 'Hey!');
		expect(mockOnChange).toHaveBeenCalledWith('Hey!');
	});

	it('should enter a new line when user clicks shift + enter', () => {
		const textarea = getTextarea();
		userEvent.type(textarea, 'Hello there!{shift}{enter}New line.');
		expect(textarea).toHaveValue(`Hello there!\nNew line.`);
		expect(mockOnEnter).not.toHaveBeenCalled();
	});

	it('should trigger onEnter when user types and clicks enter', async () => {
		userEvent.type(getTextarea(), 'Hello there!{enter}');

		await waitFor(() =>
			expect(mockOnEnter).toHaveBeenCalledWith(
				'Hello there!',
				expect.anything()
			)
		);
	});
});

function getTextarea() {
	return screen.getByTestId('textareaField');
}
