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

import CancelButton from './CancelButton';

describe('CancelButton', () => {
	const mockCancel = jest.fn();

	it('should display cancel text', () => {
		render(<CancelButton>Cancel</CancelButton>);

		screen.getByText('Cancel');
	});

	it('should handle clicks', () => {
		render(<CancelButton onClick={mockCancel}>Cancel</CancelButton>);

		userEvent.click(screen.getByText('Cancel'));

		expect(mockCancel).toHaveBeenCalledTimes(1);
	});

	it('should have secondary button class', () => {
		render(<CancelButton data-testid="cancelButton">Cancel</CancelButton>);
		const cancelButton = screen.getByTestId('cancelButton');
		expect(cancelButton).toHaveClass('button-secondary');
	});
});
