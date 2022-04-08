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

import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Topic from '../../Types/Topic';
import renderWithRecoilRoot from '../../Utils/renderWithRecoilRoot';

import ColumnItem from './ColumnItem';

describe('ColumnItem', () => {
	const mockSelect = jest.fn();
	const mockEdit = jest.fn();
	const mockDelete = jest.fn();
	const mockCheck = jest.fn();

	const startingText = 'fake text';

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it.each([[Topic.HAPPY], [Topic.CONFUSED], [Topic.UNHAPPY], [Topic.ACTION]])(
		'should render %s type',
		(type) => {
			renderWithRecoilRoot(<ColumnItem text={startingText} type={type} />);

			expect(screen.getByTestId('columnItem').className).toContain(type);
		}
	);

	describe('When not checked and not disabled', () => {
		beforeEach(() => {
			renderWithRecoilRoot(
				<ColumnItem
					type={Topic.HAPPY}
					text={startingText}
					onSelect={mockSelect}
					onEdit={mockEdit}
					onDelete={mockDelete}
					onCheck={mockCheck}
				/>
			);
		});

		it('can select', () => {
			userEvent.click(screen.getByTestId('columnItemMessageButton'));
			expect(mockSelect).toHaveBeenCalledTimes(1);
		});

		it('can start and cancel edit', () => {
			const newText = 'New Fake Text';

			screen.getByText(startingText);

			clickEdit();
			screen.getByText(startingText);

			editText(newText);
			screen.getByText(newText);

			escapeKey();
			screen.getByText(startingText);

			clickEdit();
			screen.getByText(startingText);

			editText(newText);
			screen.getByText(newText);

			screen.getByText('Cancel').click();
			screen.getByText(startingText);
		});

		it('should show edit view on edit button click', () => {
			clickEdit();
			expect(screen.getByTestId('textareaField')).toBeDefined();
			expect(screen.queryByText('Delete this')).toBeNull();
			expect(screen.queryByTestId('columnItemMessageButton')).toBeNull();
		});

		it('can complete edit', () => {
			clickEdit();
			editText('New Fake Text{Enter}');
			expect(mockEdit).toHaveBeenCalledWith('New Fake Text');
		});

		it('can start and cancel delete', () => {
			expect(deleteMessage()).toBeFalsy();

			clickDelete();
			expect(deleteMessage()).toBeTruthy();

			escapeKey();
			expect(deleteMessage()).toBeFalsy();

			clickDelete();
			expect(deleteMessage()).toBeTruthy();

			clickCancelDelete();
			expect(deleteMessage()).toBeFalsy();
		});

		it('can complete delete', () => {
			clickDelete();
			clickConfirmDelete();
			expect(mockDelete).toHaveBeenCalledTimes(1);
		});

		it('can check', () => {
			clickCheckbox();
			expect(mockCheck).toHaveBeenCalledTimes(1);
		});
	});

	describe('When checked', () => {
		beforeEach(() => {
			renderWithRecoilRoot(
				<ColumnItem
					type={Topic.HAPPY}
					text={startingText}
					checked={true}
					onSelect={mockSelect}
					onEdit={mockEdit}
					onDelete={mockDelete}
					onCheck={mockCheck}
				/>
			);
		});

		it('should disable edit button', () => {
			expect(screen.getByTestId('editButton')).toBeDisabled();
		});

		it('should disable select', () => {
			const select = screen.queryByTestId('textareaField');
			expect(select).toBeNull();
			expect(mockSelect).not.toHaveBeenCalled();
		});

		it('should not disable delete button', () => {
			expect(screen.getByTestId('deleteButton')).not.toBeDisabled();
		});

		it('should not disable checkbox button', () => {
			clickCheckbox();
			expect(mockCheck).toHaveBeenCalledTimes(1);
		});
	});

	describe('When buttons are disabled', () => {
		beforeEach(() => {
			renderWithRecoilRoot(
				<ColumnItem
					type={Topic.HAPPY}
					text={startingText}
					disableButtons={true}
					checked={true}
					onSelect={mockSelect}
					onEdit={mockEdit}
					onDelete={mockDelete}
					onCheck={mockCheck}
				/>
			);
		});

		it('should disable all buttons', () => {
			expect(screen.getByTestId('columnItemMessageButton')).toBeDisabled();
			expect(screen.getByTestId('editButton')).toBeDisabled();
			expect(screen.getByTestId('deleteButton')).toBeDisabled();
			expect(screen.getByTestId('checkboxButton')).toBeDisabled();
		});
	});

	describe('With custom buttons', () => {
		beforeEach(() => {
			renderWithRecoilRoot(
				<ColumnItem
					type={Topic.HAPPY}
					text={startingText}
					customButton={<button data-testid="columnItem-upvote" />}
				/>
			);
		});

		it('should render custom buttons', () => {
			screen.getByTestId('columnItem-upvote');
		});
	});

	describe('With children', () => {
		beforeEach(() => {
			renderWithRecoilRoot(
				<ColumnItem type={Topic.HAPPY} text={startingText}>
					I'm a child
				</ColumnItem>
			);
		});

		it('should render children between editable text and button group', () => {
			screen.getByText("I'm a child");
		});
	});
});

function editText(text: string) {
	const textArea = screen.getByTestId('textareaField') as HTMLTextAreaElement;
	textArea.select();
	userEvent.type(textArea, text);
}

function clickEdit() {
	userEvent.click(screen.getByTestId('editButton'));
}

function clickDelete() {
	const deleteButton = screen.getByTestId('deleteButton');
	userEvent.click(deleteButton);
}

function clickCheckbox() {
	userEvent.click(screen.getByTestId('checkboxButton'));
}

function clickCancelDelete() {
	userEvent.click(screen.getByText('No'));
}

function clickConfirmDelete() {
	userEvent.click(screen.getByText('Yes'));
}

function escapeKey() {
	userEvent.type(document.body, '{Escape}');
}

function deleteMessage() {
	return screen.queryByText('Delete this Thought?');
}
