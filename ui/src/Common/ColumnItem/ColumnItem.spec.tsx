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
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Topic from '../../Types/Topic';
import * as Modal from '../Modal/Modal';

import ColumnItem from './ColumnItem';

const mockUseModalValue = {
	hide: jest.fn(),
	show: jest.fn(),
	setHideOnEscape: jest.fn(),
	setHideOnBackdropClick: jest.fn(),
};

describe('ColumnItem', () => {
	const mockSelect = jest.fn();
	const mockEdit = jest.fn();
	const mockDelete = jest.fn();
	const mockCheck = jest.fn();

	const startingText = 'fake text';

	beforeEach(() => {
		jest.clearAllMocks();

		jest.spyOn(Modal, 'useModal').mockReturnValue(mockUseModalValue);
	});

	it.each([[Topic.HAPPY], [Topic.CONFUSED], [Topic.UNHAPPY], [Topic.ACTION]])(
		'should render %s type',
		(type) => {
			render(<ColumnItem text={startingText} type={type} />);

			expect(screen.getByTestId('columnItem').className).toContain(type);
		}
	);

	describe('when not checked and not readonly', () => {
		beforeEach(() => {
			render(
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
			clickText();

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

			clickEdit();
			screen.getByText(startingText);
		});

		it('should disable other buttons while editing', () => {
			clickEdit();
			expect(textReadonly()).toBeFalsy();

			clickDelete();
			expect(deleteMessage()).toBeFalsy();

			clickCheckbox();
			expect(mockCheck).not.toHaveBeenCalled();
		});

		it('should disable modal closing while editing', () => {
			clickEdit();

			expect(mockUseModalValue.setHideOnEscape).toHaveBeenCalledWith(false);
			expect(mockUseModalValue.setHideOnBackdropClick).toHaveBeenCalledWith(
				false
			);

			clickEdit();

			expect(mockUseModalValue.setHideOnEscape).toHaveBeenCalledWith(true);
			expect(mockUseModalValue.setHideOnBackdropClick).toHaveBeenCalledWith(
				true
			);
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

		it('should disable modal closing while deleting', () => {
			clickDelete();

			expect(mockUseModalValue.setHideOnEscape).toHaveBeenCalledWith(false);
			expect(mockUseModalValue.setHideOnBackdropClick).toHaveBeenCalledWith(
				false
			);

			escapeKey();

			expect(mockUseModalValue.setHideOnEscape).toHaveBeenCalledWith(true);
			expect(mockUseModalValue.setHideOnBackdropClick).toHaveBeenCalledWith(
				true
			);
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

	describe('when checked', () => {
		beforeEach(() => {
			render(
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
			clickEdit();
			expect(textReadonly()).toBeTruthy();
		});

		it('should disable select', () => {
			clickText();

			expect(mockSelect).not.toHaveBeenCalled();
		});

		it('should not disable delete button', () => {
			clickDelete();
			expect(deleteMessage()).toBeTruthy();
		});

		it('should not disable checkbox button', () => {
			clickCheckbox();
			expect(mockCheck).toHaveBeenCalledTimes(1);
		});
	});

	describe('when readonly', () => {
		beforeEach(() => {
			render(
				<ColumnItem
					type={Topic.HAPPY}
					text={startingText}
					readOnly={true}
					checked={true}
					onSelect={mockSelect}
					onEdit={mockEdit}
					onDelete={mockDelete}
					onCheck={mockCheck}
				/>
			);
		});

		it('should disable all buttons', () => {
			clickEdit();
			expect(textReadonly()).toBeTruthy();

			clickDelete();
			expect(deleteMessage()).toBeFalsy();

			clickCheckbox();
			expect(mockCheck).not.toHaveBeenCalled();
		});

		it('should not disable select', () => {
			clickText();
			expect(mockSelect).toHaveBeenCalledTimes(1);
		});
	});

	describe('without default buttons', () => {
		beforeEach(() => {
			render(
				<ColumnItem
					type={Topic.HAPPY}
					text={startingText}
					defaultButtons={false}
				/>
			);
		});

		it('should not render the edit, delete, and checkbox buttons', () => {
			expect(screen.queryByTestId('editButton')).toBeFalsy();
			expect(screen.queryByTestId('checkboxButton')).toBeFalsy();
			expect(screen.queryByTestId('checkboxButton')).toBeFalsy();
		});
	});

	describe('with custom buttons', () => {
		beforeEach(() => {
			render(
				<ColumnItem
					type={Topic.HAPPY}
					text={startingText}
					customButtons={() => <button data-testid="columnItem-upvote" />}
				/>
			);
		});

		it('should render custom buttons', () => {
			screen.getByTestId('columnItem-upvote');
		});
	});

	describe('with children', () => {
		beforeEach(() => {
			render(
				<ColumnItem type={Topic.HAPPY} text={startingText}>
					{() => "I'm a child"}
				</ColumnItem>
			);
		});

		it('should render children between editable text and button group', () => {
			screen.getByText("I'm a child");
		});
	});
});

function editText(text: string) {
	const textArea = screen.getByTestId('editableText') as HTMLTextAreaElement;
	textArea.select();
	userEvent.type(textArea, text);
}

function clickText() {
	userEvent.click(screen.getByTestId('editableText-container'));
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

function textReadonly() {
	return screen.getByTestId('editableText').getAttribute('readonly') === '';
}

function deleteMessage() {
	return screen.queryByText('Delete this Thought?');
}
