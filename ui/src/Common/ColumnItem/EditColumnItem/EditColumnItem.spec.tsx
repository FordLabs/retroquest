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
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DisableDraggableState } from 'State/DisableDraggableState';
import { ModalContents } from 'State/ModalContentsState';
import { RecoilObserver } from 'Utils/RecoilObserver';
import renderWithRecoilRoot from 'Utils/renderWithRecoilRoot';

import EditColumnItem from './EditColumnItem';

describe('Edit Column Item', () => {
	const mockOnConfirm = jest.fn();
	const mockOnCancel = jest.fn();
	const mockInitialValue = 'Initial Value';
	let disableDraggable: ModalContents | null;

	beforeEach(() => {
		jest.clearAllMocks();

		disableDraggable = null;

		renderWithRecoilRoot(
			<>
				<RecoilObserver
					recoilState={DisableDraggableState}
					onChange={(value: ModalContents) => {
						disableDraggable = value;
					}}
				/>
				<EditColumnItem
					initialValue={mockInitialValue}
					onConfirm={mockOnConfirm}
					onCancel={mockOnCancel}
					className="new-class-name"
					height={50}
				>
					child component
				</EditColumnItem>
			</>
		);
	});

	it('should show the children', () => {
		expect(screen.getByText('child component')).toBeDefined();
	});

	it('should have className', () => {
		expect(screen.getByTestId('editColumnItem')).toHaveClass('new-class-name');
	});

	it('should disable draggable on render', async () => {
		expect(disableDraggable).toBeTruthy();
	});

	it('should have min-height', () => {
		expect(screen.getByTestId('editColumnItem')).toHaveAttribute(
			'style',
			'min-height: 50px;'
		);
	});

	it('should click the "Save!" button', () => {
		userEvent.click(screen.getByText('Save!'));
		expect(mockOnConfirm).toHaveBeenCalled();
		expect(mockOnCancel).not.toHaveBeenCalled();
	});

	it('should click the "Cancel" button', () => {
		userEvent.click(screen.getByText('Cancel'));
		expect(mockOnConfirm).not.toHaveBeenCalled();
		expect(mockOnCancel).toHaveBeenCalled();
	});

	it('should cancel editing column item on escaped', () => {
		userEvent.type(document.body, '{Escape}');
		expect(mockOnConfirm).not.toHaveBeenCalled();
		expect(mockOnCancel).toHaveBeenCalled();
	});
});
