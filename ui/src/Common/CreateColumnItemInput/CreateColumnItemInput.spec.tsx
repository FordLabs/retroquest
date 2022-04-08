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
import { axe } from 'jest-axe';

import Topic from '../../Types/Topic';

import CreateColumnItemInput from './CreateColumnItemInput';

describe('Create Column Item Input', () => {
	const mockHandleSubmit = jest.fn();
	const placeholder = 'Enter A Thought';

	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('should render without axe errors', async () => {
		const { container } = render(
			<CreateColumnItemInput
				data-testid="happy"
				type={Topic.HAPPY}
				placeholder={placeholder}
				handleSubmission={mockHandleSubmit}
			/>
		);
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});

	it('should style based on type', () => {
		const { rerender } = render(
			<CreateColumnItemInput
				type={Topic.HAPPY}
				placeholder={placeholder}
				handleSubmission={mockHandleSubmit}
			/>
		);
		expect(screen.getByPlaceholderText(placeholder)).toHaveClass('happy');

		rerender(
			<CreateColumnItemInput
				type={Topic.CONFUSED}
				placeholder={placeholder}
				handleSubmission={mockHandleSubmit}
			/>
		);
		expect(screen.getByPlaceholderText(placeholder)).toHaveClass('confused');

		rerender(
			<CreateColumnItemInput
				type={Topic.UNHAPPY}
				placeholder={placeholder}
				handleSubmission={mockHandleSubmit}
			/>
		);
		expect(screen.getByPlaceholderText(placeholder)).toHaveClass('unhappy');
	});

	it('should submit on enter', () => {
		render(
			<CreateColumnItemInput
				type={Topic.HAPPY}
				placeholder={placeholder}
				handleSubmission={mockHandleSubmit}
			/>
		);
		const textField = screen.getByPlaceholderText(placeholder);
		userEvent.type(textField, 'Submission Text{enter}');
		expect(mockHandleSubmit).toHaveBeenCalledWith('Submission Text');
	});
});
