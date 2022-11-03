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
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CheckboxButton } from '../index';

describe('Checkbox Button', () => {
	const mockCheck = jest.fn();

	it('should display not display checkmark when not checked', () => {
		render(<CheckboxButton checked={false} onClick={jest.fn()} />);

		screen.getByTestId('checkbox');
		expect(screen.queryByTestId('checkmark')).toBeFalsy();
	});

	it('should display display checkmark when checked', () => {
		render(<CheckboxButton checked={true} onClick={jest.fn()} />);

		screen.getByTestId('checkbox');
		screen.getByTestId('checkmark');
	});

	it('should show "Close" tooltip when checkbox is not checked', () => {
		render(<CheckboxButton checked={false} onClick={jest.fn()} />);
		screen.getByText('Close');
	});

	it('should show "Close" tooltip when checkbox is checked', () => {
		render(<CheckboxButton checked={true} onClick={jest.fn()} />);
		screen.getByText('Open');
	});

	it('should show custom tooltip text if prop is provided', () => {
		render(
			<CheckboxButton
				tooltipText={{ checked: 'Unselect', unchecked: 'Select' }}
				checked={true}
				onClick={jest.fn()}
			/>
		);
		screen.getByText('Unselect');
		render(
			<CheckboxButton
				tooltipText={{ checked: 'Unselect', unchecked: 'Select' }}
				checked={false}
				onClick={jest.fn()}
			/>
		);
		screen.getByText('Select');
	});

	it('should not have tooltips', () => {
		render(
			<CheckboxButton checked={false} onClick={jest.fn()} disableTooltips />
		);
		expect(screen.queryByText('Close')).toBeNull();

		render(
			<CheckboxButton checked={true} onClick={jest.fn()} disableTooltips />
		);
		expect(screen.queryByText('Open')).toBeNull();
	});

	it('should handle clicks', () => {
		render(<CheckboxButton checked={false} onClick={mockCheck} />);

		userEvent.click(screen.getByTestId('checkbox'));

		expect(mockCheck).toHaveBeenCalledTimes(1);
	});

	it('should be disabled button', () => {
		render(
			<CheckboxButton checked={false} onClick={mockCheck} disabled={true} />
		);
		const checkboxButton = screen.getByTestId('checkboxButton');
		userEvent.click(checkboxButton);

		expect(mockCheck).toHaveBeenCalledTimes(0);
		expect(checkboxButton.getAttribute('disabled')).not.toBeNull();
	});

	it('should return new state of checkbox on click', () => {
		render(<CheckboxButton checked={false} onClick={mockCheck} />);

		const checkboxButton = screen.getByTestId('checkboxButton');
		userEvent.click(checkboxButton);
		expect(mockCheck).toHaveBeenCalledWith(true);
	});
});
