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
import userEvent from '@testing-library/user-event';

import AssigneeInput from './AssigneeInput';

describe('Assignee Input', () => {
	const assignee: string = 'Me, you';
	const mockOnAssign = jest.fn();
	let rerender: (arg0: React.ReactElement) => void;

	beforeEach(() => {
		({ rerender } = render(
			<AssigneeInput assignee={assignee} onAssign={mockOnAssign} />
		));
	});

	it('should show default assignee value in assignee input', () => {
		expect(getAssigneeInput()).toHaveValue(assignee);
	});

	it('should edit and save assignee on enter', () => {
		const updatedAssignee = ', Lucy Ricardo';
		const assigneeInput = getAssigneeInput();
		userEvent.type(assigneeInput, `${updatedAssignee}{enter}`);
		expect(mockOnAssign).toHaveBeenCalledWith(assignee + updatedAssignee);
	});

	it('should edit and save assignee on blur', () => {
		const updatedAssignee = ', Lucy Ricardo';
		const assigneeInput = getAssigneeInput();
		userEvent.type(assigneeInput, updatedAssignee);
		const expectedAssignee = assignee + updatedAssignee;
		expect(assigneeInput).toHaveValue(expectedAssignee);
		assigneeInput.blur();
		expect(mockOnAssign).toHaveBeenCalledWith(expectedAssignee);
	});

	it('should show max character count', () => {
		const assigneeInput = getAssigneeInput();
		userEvent.type(assigneeInput, '{selectall}{del}');
		screen.getByText('50');
	});

	it('should show remaining characters count', () => {
		const assigneeInput = getAssigneeInput();
		screen.getByText('43');
		userEvent.type(assigneeInput, '{selectall}{del}abcdefghijklmnopqrstuvwxyz');
		screen.getByText('24');
	});

	it('should be disabled', () => {
		rerender(
			<AssigneeInput
				assignee={assignee}
				onAssign={mockOnAssign}
				disabled={true}
			/>
		);
		const assigneeInput = getAssigneeInput();
		expect(assigneeInput).toBeDisabled();
	});

	it('should be read only', () => {
		rerender(
			<AssigneeInput
				assignee={assignee}
				onAssign={mockOnAssign}
				readOnly={true}
			/>
		);
		const assigneeInput = getAssigneeInput();
		expect(assigneeInput.getAttribute('readOnly')).not.toBeNull();
	});
});

function getAssigneeInput() {
	return screen.getByTestId('assigneeInput');
}
