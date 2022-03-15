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

import {
	CancelButton,
	CheckboxButton,
	ColumnItemButtonGroup,
	ConfirmButton,
	DeleteButton,
	EditButton,
} from './ColumnItemButtons';

describe('ColumnItemButtons', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('RetroItemButtonGroup', () => {
		it('should render', () => {
			render(
				<ColumnItemButtonGroup>
					<EditButton editing={false} />
				</ColumnItemButtonGroup>
			);

			screen.getByTestId('editIcon');
		});
	});

	describe('EditButton', () => {
		const mockEdit = jest.fn();

		it('should display edit icon', () => {
			render(<EditButton editing={false} />);

			screen.getByTestId('editIcon');
		});

		it('should display cancel icon', () => {
			render(<EditButton editing={true} />);

			screen.getByTestId('cancelIcon');
		});

		it('should have tooltips', () => {
			render(<EditButton editing={false} />);

			screen.getByText('Edit');

			render(<EditButton editing={true} />);

			screen.getByText('Cancel');
		});

		it('should handle clicks', () => {
			render(<EditButton editing={false} onClick={mockEdit} />);

			userEvent.click(screen.getByTestId('editIcon'));

			expect(mockEdit).toHaveBeenCalledTimes(1);
		});

		it('can be disabled', () => {
			render(<EditButton editing={false} onClick={mockEdit} disabled={true} />);
			const editButton = screen.getByTestId('editButton');

			userEvent.click(editButton);

			expect(mockEdit).toHaveBeenCalledTimes(0);
			expect(editButton.getAttribute('disabled')).not.toBeNull();
		});
	});

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

	describe('CheckboxButton', () => {
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

	describe('ConfirmButton', () => {
		const mockConfirm = jest.fn();

		it('should display confirm text', () => {
			render(<ConfirmButton>Confirm</ConfirmButton>);

			screen.getByText('Confirm');
		});

		it('should handle clicks', () => {
			render(<ConfirmButton onClick={mockConfirm}>Confirm</ConfirmButton>);

			userEvent.click(screen.getByText('Confirm'));

			expect(mockConfirm).toHaveBeenCalledTimes(1);
		});
	});

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
	});
});
