/*
 * Copyright (c) 2022. Ford Motor Company
 *  All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';

import Dropdown, { DropdownOption } from './Dropdown';

const mockOptions: DropdownOption[] = [
	{ label: 'One', value: 1 },
	{ label: 'Two', value: 2 },
	{ label: 'Three', value: 3 },
	{ label: 'Four', value: 4 },
];

describe('Dropdown', () => {
	let container: string | Element;
	let mockOnChange = jest.fn();

	beforeEach(() => {
		({ container } = render(
			<Dropdown
				label="Mock Label"
				options={mockOptions}
				defaultValue={2}
				onChange={mockOnChange}
			/>
		));
	});

	it('should render without axe errors', async () => {
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});

	it('should have default value selected', () => {
		confirmOptionIsSelected(mockOptions[1]);
	});

	it('should render visually hidden label for accessibility', () => {
		expect(screen.getByLabelText('Mock Label')).toBeDefined();
	});

	it('should be able to select all available options', () => {
		expect(screen.getAllByRole('option')).toHaveLength(4);
		selectOptionAndConfirmOptionIsSelected(mockOptions[0]);
		selectOptionAndConfirmOptionIsSelected(mockOptions[1]);
		selectOptionAndConfirmOptionIsSelected(mockOptions[2]);
		selectOptionAndConfirmOptionIsSelected(mockOptions[3]);
	});

	it('should emit value on change', () => {
		selectOptionAndConfirmOptionIsSelected(mockOptions[2]);
		expect(mockOnChange).toHaveBeenCalledWith(mockOptions[2].value.toString());
	});
});

function selectOptionAndConfirmOptionIsSelected(
	expectedOption: DropdownOption
) {
	userEvent.selectOptions(
		screen.getByTestId('dropdown-select'),
		expectedOption.value.toString()
	);
	confirmOptionIsSelected(expectedOption);
}

function confirmOptionIsSelected(expectedOption: DropdownOption) {
	const actualOption: HTMLOptionElement = screen.getByRole('option', {
		name: expectedOption.label,
	});
	expect(actualOption.selected).toBe(true);
	expect(actualOption.label).toBe(expectedOption.label);
	expect(actualOption.value).toBe(expectedOption.value.toString());
}
