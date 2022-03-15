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
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import EditableText from './EditableText';

describe('EditableText', () => {
	const mockSelect = jest.fn();
	const mockConfirmEdit = jest.fn();
	const mockCancelEdit = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('when editing and selectable', () => {
		beforeEach(() => {
			render(
				<EditableText
					value="sample text"
					editing={true}
					selectable={true}
					onCancel={mockCancelEdit}
					onConfirm={mockConfirmEdit}
				/>
			);
		});

		it('should not select', () => {
			clickContainer();
			clickSelectButton();

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

	describe('when not editing and selectable', () => {
		beforeEach(() => {
			render(
				<EditableText
					value={'sample text'}
					editing={false}
					selectable={true}
					onSelect={mockSelect}
				/>
			);
		});

		it('text is readonly and disable', () => {
			textIsReadonlyAndDisabled(true);
		});

		it('can select', () => {
			clickContainer();
			clickSelectButton();

			expect(mockSelect).toHaveBeenCalledTimes(2);
		});
	});

	describe('when disabled', () => {
		beforeEach(() => {
			render(
				<EditableText value={'sample text'} editing={false} disabled={true} />
			);
		});

		it('can not select', () => {
			clickContainer();
			clickSelectButton();

			expect(mockSelect).not.toHaveBeenCalled();
		});

		it('is is translucent', () => {
			expect(screen.getByTestId('editableText-container').className).toContain(
				'disabled'
			);
		});
	});

	describe('when not selectable', () => {
		beforeEach(() => {
			render(
				<EditableText
					value={'sample text'}
					editing={false}
					selectable={false}
				/>
			);
		});

		it('can not select', () => {
			clickContainer();
			clickSelectButton();

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

function clickContainer() {
	userEvent.click(screen.getByTestId('editableText-container'));
}

function clickSelectButton() {
	const select = screen.queryByTestId('editableText-select');
	select && userEvent.click(select);
}

function escapeKey() {
	userEvent.type(document.body, '{Escape}');
}
