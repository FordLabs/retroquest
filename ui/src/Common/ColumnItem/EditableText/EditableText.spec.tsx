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
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DisableDraggableState } from '../../../State/DisableDraggableState';
import { RecoilObserver } from '../../../Utils/RecoilObserver';
import renderWithRecoilRoot from '../../../Utils/renderWithRecoilRoot';

import EditableText from './EditableText';

describe('EditableText', () => {
	const mockSelect = jest.fn();
	const mockConfirmEdit = jest.fn();
	const mockCancelEdit = jest.fn();
	let disableDraggable: boolean | null;

	beforeEach(() => {
		disableDraggable = null;
		jest.clearAllMocks();
	});

	describe('When editing and selectable', () => {
		beforeEach(() => {
			renderWithRecoilRoot(
				<>
					<RecoilObserver
						recoilState={DisableDraggableState}
						onChange={(value: boolean) => {
							disableDraggable = value;
						}}
					/>
					<EditableText
						value="sample text"
						editing={true}
						selectable={true}
						onCancel={mockCancelEdit}
						onConfirm={mockConfirmEdit}
					/>
				</>
			);
		});

		it('should disable drag and drop when editing', () => {
			expect(disableDraggable).toBeTruthy();
		});

		it('should not select', () => {
			const select = screen.queryByTestId('editableText-select');
			expect(select).toBeNull();
			expect(mockSelect).not.toHaveBeenCalled();
		});

		it('can cancel edit', () => {
			textIsReadonlyAndDisabled(false);
			screen.getByText('sample text');

			editText('new text');
			screen.getByText('new text');

			escapeKey();

			expect(mockCancelEdit).toHaveBeenCalledTimes(1);
			expect(mockConfirmEdit).not.toHaveBeenCalled();
		});

		it('can complete edit', async () => {
			screen.getByText('sample text');

			editText('new text{Enter}');

			expect(mockCancelEdit).not.toHaveBeenCalled();
			await waitFor(() =>
				expect(mockConfirmEdit).toHaveBeenCalledWith('new text')
			);
		});
	});

	describe('When not editing and selectable', () => {
		beforeEach(() => {
			renderWithRecoilRoot(
				<>
					<RecoilObserver
						recoilState={DisableDraggableState}
						onChange={(value: boolean) => {
							disableDraggable = value;
						}}
					/>
					<EditableText
						value="sample text"
						editing={false}
						selectable={true}
						onSelect={mockSelect}
					/>
				</>
			);
		});

		it('should enable drag and drop when not editing', () => {
			expect(disableDraggable).toBeFalsy();
		});

		it('text is readonly and disable', () => {
			textIsReadonlyAndDisabled(true);
		});

		it('can select', () => {
			const select = screen.getByTestId('editableText-select');
			userEvent.click(select);

			expect(mockSelect).toHaveBeenCalledTimes(1);
		});
	});

	describe('when disabled', () => {
		beforeEach(() => {
			renderWithRecoilRoot(
				<EditableText value="sample text" editing={false} disabled={true} />
			);
		});

		it('can not select', () => {
			const select = screen.queryByTestId('editableText-select');
			expect(select).toBeNull();
			expect(mockSelect).not.toHaveBeenCalled();
		});

		it('is translucent', () => {
			expect(screen.getByTestId('editableText-container').className).toContain(
				'disabled'
			);
		});
	});

	describe('When not selectable', () => {
		beforeEach(() => {
			renderWithRecoilRoot(
				<EditableText value="sample text" editing={false} selectable={false} />
			);
		});

		it('can not select', () => {
			const select = screen.queryByTestId('editableText-select');

			expect(select).toBeNull();
			expect(mockSelect).not.toHaveBeenCalled();
		});
	});
});

function textIsReadonlyAndDisabled(readonlyAndDisabled: boolean) {
	const textArea = screen.getByTestId('editableText');
	expect(textArea.getAttribute('readonly')).toBe(
		readonlyAndDisabled ? '' : null
	);
	expect(textArea.getAttribute('disabled')).toBe(
		readonlyAndDisabled ? '' : null
	);
}

function editText(text: string) {
	userEvent.type(screen.getByTestId('editableText'), text);
}

function escapeKey() {
	userEvent.type(document.body, '{Escape}');
}
