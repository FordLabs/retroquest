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

import Form from './Form';

describe('Form', () => {
	let mockSubmit = jest.fn();

	it('should display children', () => {
		render(
			<Form
				submitButtonText="Submit"
				onSubmit={mockSubmit}
				errorMessages={[]}
				isLoading={false}
			>
				Child Elements
			</Form>
		);

		expect(screen.getByText('Child Elements')).toBeDefined();
	});

	it('should display error messages', () => {
		render(
			<Form
				submitButtonText="Submit"
				onSubmit={mockSubmit}
				errorMessages={['error message1', 'error message2']}
				isLoading={false}
			>
				Child Elements
			</Form>
		);

		screen.getByText('error message1');
		screen.getByText('error message2');
	});

	it('should submit form when submit button is enabled', () => {
		const submitButtonText = 'Submit Form';
		render(
			<Form
				submitButtonText={submitButtonText}
				onSubmit={mockSubmit}
				errorMessages={['error message1', 'error message2']}
				isLoading={false}
			>
				Child Elements
			</Form>
		);

		const submitButton = screen.getByText(submitButtonText);
		userEvent.click(submitButton);
		expect(mockSubmit).toHaveBeenCalled();
	});

	it('should not be able to submit form when submit button is disabled', () => {
		const submitButtonText = 'Submit Form';
		render(
			<Form
				submitButtonText={submitButtonText}
				onSubmit={mockSubmit}
				errorMessages={['error message1', 'error message2']}
				isLoading={true}
			>
				Child Elements
			</Form>
		);

		const submitButton = screen.getByText(submitButtonText);
		expect(submitButton).toBeDisabled();
		userEvent.click(submitButton);
		expect(mockSubmit).not.toHaveBeenCalled();
	});
});
