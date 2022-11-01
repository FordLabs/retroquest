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
import { axe } from 'jest-axe';

import ConfirmationModal from './ConfirmationModal';

describe('FormTemplate', () => {
	const mockOnSubmitCallback = jest.fn();
	const mockOnCancelCallback = jest.fn();
	let container: string | Element;

	beforeEach(() => {
		({ container } = render(
			<ConfirmationModal
				title="Form Template Header"
				subtitle="Form Template Sub Header"
				onSubmit={mockOnSubmitCallback}
				onCancel={mockOnCancelCallback}
				cancelButtonText="Custom Cancel"
				submitButtonText="Custom Submit!"
			>
				<>Form Template Content</>
			</ConfirmationModal>
		));
	});

	it('should render without axe errors', async () => {
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});

	it('should render header, subheader, and content', () => {
		screen.getByText('Form Template Header');
		screen.getByText('Form Template Sub Header');
		screen.getByText('Form Template Content');
	});

	it('should call cancel method when cancel button is clicked', () => {
		const cancelButton = screen.getByText('Custom Cancel');
		userEvent.click(cancelButton);
		expect(mockOnCancelCallback).toHaveBeenCalledTimes(1);
		expect(mockOnSubmitCallback).not.toHaveBeenCalled();
	});

	it('should call confirm method when confirm button is clicked', () => {
		const submitButton = screen.getByText('Custom Submit!');
		fireEvent.submit(submitButton);
		expect(mockOnSubmitCallback).toHaveBeenCalledTimes(1);
		expect(mockOnCancelCallback).not.toHaveBeenCalled();
	});
});
