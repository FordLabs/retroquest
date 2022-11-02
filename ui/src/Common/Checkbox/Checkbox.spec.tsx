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
import { axe } from 'jest-axe';

import Checkbox from './Checkbox';

describe('Checkbox', () => {
	it('should render without axe errors', async () => {
		const { container } = render(
			<Checkbox id="1" label="Label" value="1" onChange={jest.fn()} />
		);
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});

	it('should mark checkbox as checked and change icon', async () => {
		render(<Checkbox id="1" label="Label" value="1" onChange={jest.fn()} />);

		const checkbox = getCheckbox();
		expect(checkbox).toHaveAttribute('data-checked', 'false');

		const checkboxIcon = screen.getByTestId('checkboxIcon');
		expect(checkboxIcon).toHaveClass('fa-square');
		expect(checkboxIcon).not.toHaveClass('fa-square-check');

		checkbox.click();

		expect(checkbox).toHaveAttribute('data-checked', 'true');
		expect(checkboxIcon).toHaveClass('fa-square-check');
		expect(checkboxIcon).not.toHaveClass('fa-square');
	});

	it('should call onChange callback when checkbox is clicked', () => {
		const onChange = jest.fn();
		render(<Checkbox id="1" label="Label" value="1" onChange={onChange} />);
		const checkbox = getCheckbox();

		checkbox.click();
		expect(onChange).toHaveBeenCalledWith(true);
		checkbox.click();
		expect(onChange).toHaveBeenCalledWith(false);
		checkbox.click();
		expect(onChange).toHaveBeenCalledWith(true);
	});
});

function getCheckbox() {
	return screen.getByLabelText('Label', { selector: 'input' });
}
