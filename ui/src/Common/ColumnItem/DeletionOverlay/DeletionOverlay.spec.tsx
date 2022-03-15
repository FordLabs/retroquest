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
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DeletionOverlay from './DeletionOverlay';

describe('DeletionOverlay', () => {
	const mockOnConfirm = jest.fn();
	const mockOnCancel = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
		render(
			<DeletionOverlay onConfirm={mockOnConfirm} onCancel={mockOnCancel}>
				Continue the test?
			</DeletionOverlay>
		);
	});

	it('should show the delete message', () => {
		expect(screen.queryByText('Continue the test?')).not.toBeNull();
	});

	it('should notify observers of accept button click', () => {
		userEvent.click(screen.getByText('Yes'));
		expect(mockOnConfirm).toHaveBeenCalled();
		expect(mockOnCancel).not.toHaveBeenCalled();
	});

	it('should notify observers of decline button click', () => {
		userEvent.click(screen.getByText('No'));
		expect(mockOnConfirm).not.toHaveBeenCalled();
		expect(mockOnCancel).toHaveBeenCalled();
	});

	it('should notify observers of decline when escaped', () => {
		fireEvent.keyDown(document.body, {
			key: 'Escape',
			code: 'Escape',
			keyCode: 27,
			charCode: 27,
		});

		expect(mockOnConfirm).not.toHaveBeenCalled();
		expect(mockOnCancel).toHaveBeenCalled();
	});
});
