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

import DeleteButton from './DeleteButton';

describe('DeleteButton', () => {
	const mockDelete = jest.fn();

	it('should display trash icon', () => {
		render(<DeleteButton />);

		screen.getByTestId('trashIcon');
	});

	it('should have a tooltip', () => {
		render(<DeleteButton />);

		screen.getByText('Delete');
	});

	it('should handle clicks', () => {
		render(<DeleteButton onClick={mockDelete} />);

		userEvent.click(screen.getByTestId('trashIcon'));

		expect(mockDelete).toHaveBeenCalledTimes(1);
	});

	it('can be disabled', () => {
		render(<DeleteButton onClick={mockDelete} disabled={true} />);
		const deleteButton = screen.getByTestId('deleteButton');

		userEvent.click(deleteButton);

		expect(mockDelete).toHaveBeenCalledTimes(0);
		expect(deleteButton.getAttribute('disabled')).not.toBeNull();
	});
});
