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

import DeleteColumnItem from './DeleteColumnItem';

describe('Delete Column Item', () => {
	const mockOnConfirm = jest.fn();
	const mockOnCancel = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();

		render(
			<DeleteColumnItem
				onConfirm={mockOnConfirm}
				onCancel={mockOnCancel}
				className="new-class-name"
				height={50}
			>
				child component
			</DeleteColumnItem>
		);
	});

	it('should show the delete message', () => {
		expect(screen.getByText('child component')).toBeDefined();
	});

	it('should have className', () => {
		expect(screen.getByTestId('deleteColumnItem')).toHaveClass(
			'new-class-name'
		);
	});

	it('should have height', () => {
		expect(screen.getByTestId('deleteColumnItem')).toHaveAttribute(
			'style',
			'height: 50px;'
		);
	});

	it('should click the "Yes" button', () => {
		userEvent.click(getConfirmDeleteButton());
		expect(mockOnConfirm).toHaveBeenCalled();
		expect(mockOnCancel).not.toHaveBeenCalled();
	});

	it('should click the "No" button', () => {
		userEvent.click(getCancelDeleteButton());
		expect(mockOnConfirm).not.toHaveBeenCalled();
		expect(mockOnCancel).toHaveBeenCalled();
	});

	it('should cancel column item deletion on escaped', () => {
		userEvent.type(document.body, '{Escape}');
		expect(mockOnConfirm).not.toHaveBeenCalled();
		expect(mockOnCancel).toHaveBeenCalled();
	});

	it("should auto focus on 'No' button", () => {
		expect(getCancelDeleteButton()).toHaveFocus();
	});
});

function getConfirmDeleteButton() {
	return screen.getByText('Yes, Delete');
}

function getCancelDeleteButton() {
	return screen.getByText('Cancel');
}
