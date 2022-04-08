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
		render(<CheckboxButton checked={false} />);

		screen.getByTestId('checkbox');
		expect(screen.queryByTestId('checkmark')).toBeFalsy();
	});

	it('should display display checkmark when checked', () => {
		render(<CheckboxButton checked={true} />);

		screen.getByTestId('checkbox');
		screen.getByTestId('checkmark');
	});

	it('should have tooltips', () => {
		render(<CheckboxButton checked={false} />);

		screen.getByText('Close');

		render(<CheckboxButton checked={true} />);

		screen.getByText('Open');
	});

	it('should handle clicks', () => {
		render(<CheckboxButton checked={false} onClick={mockCheck} />);

		userEvent.click(screen.getByTestId('checkbox'));

		expect(mockCheck).toHaveBeenCalledTimes(1);
	});

	it('can be disabled', () => {
		render(
			<CheckboxButton checked={false} onClick={mockCheck} disabled={true} />
		);
		const checkboxButton = screen.getByTestId('checkboxButton');

		userEvent.click(checkboxButton);

		expect(mockCheck).toHaveBeenCalledTimes(0);
		expect(checkboxButton.getAttribute('disabled')).not.toBeNull();
	});
});
