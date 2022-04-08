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
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';

import ActionItemService from '../../../../../Services/Api/ActionItemService';
import { ActionItemState } from '../../../../../State/ActionItemState';
import {
	ModalContents,
	ModalContentsState,
} from '../../../../../State/ModalContentsState';
import { TeamState } from '../../../../../State/TeamState';
import Action from '../../../../../Types/Action';
import Team from '../../../../../Types/Team';
import { RecoilObserver } from '../../../../../Utils/RecoilObserver';
import renderWithRecoilRoot from '../../../../../Utils/renderWithRecoilRoot';

import ActionItem from './ActionItem';

jest.mock('../../../../../Services/Api/ActionItemService');

describe('ActionItem', () => {
	let modalContent: ModalContents | null;

	const team: Team = {
		name: 'My Team',
		id: 'my-team',
	};

	const fakeAction: Action = {
		id: 0,
		task: 'fake task',
		assignee: '',
		completed: false,
		dateCreated: '2021-08-12',
		archived: false,
	};

	beforeEach(() => {
		jest.clearAllMocks();

		modalContent = null;
	});

	it('should render without axe errors', async () => {
		const { container } = renderWithRecoilRoot(
			<ActionItem actionItemId={fakeAction.id} />,
			({ set }) => {
				set(ActionItemState, [fakeAction]);
			}
		);
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});

	it('should render as an action column item with created date', () => {
		renderWithRecoilRoot(
			<ActionItem actionItemId={fakeAction.id} />,
			({ set }) => {
				set(ActionItemState, [fakeAction]);
			}
		);

		expect(screen.getByTestId('actionItem').className).toContain('action');
		screen.getByText('Aug 12th');
	});

	describe('When not completed', () => {
		beforeEach(() => {
			renderWithRecoilRoot(
				<>
					<RecoilObserver
						recoilState={ModalContentsState}
						onChange={(value: ModalContents) => {
							modalContent = value;
						}}
					/>
					<ActionItem actionItemId={fakeAction.id} />
				</>,
				({ set }) => {
					set(TeamState, team);
					set(ActionItemState, [fakeAction]);
				}
			);
		});

		it('should open retro item modal', async () => {
			openActionItemModal();
			await waitFor(() =>
				expect(modalContent).toEqual({
					title: 'Action Item',
					component: <ActionItem actionItemId={fakeAction.id} />,
					superSize: true,
				})
			);
		});

		it('should start and cancel editing of action item', () => {
			const newTask = 'New Fake Task';

			screen.getByText(fakeAction.task);

			clickEdit();
			screen.getByText(fakeAction.task);

			editTask(newTask);
			screen.getByText(newTask);

			hitEscapeKey();
			screen.getByText(fakeAction.task);

			clickEdit();
			screen.getByText(fakeAction.task);

			editTask(newTask);
			screen.getByText(newTask);

			screen.getByText('Cancel').click();
			screen.getByText(fakeAction.task);
		});

		it('should show edit view on edit button click', () => {
			clickEdit();
			expect(screen.getByTestId('textareaField')).toBeDefined();
			expect(screen.queryByText('Delete this')).toBeNull();
			expect(screen.queryByTestId('columnItemMessageButton')).toBeNull();
		});

		it('should edit action item', () => {
			clickEdit();
			const updatedTask = 'New Fake Task';
			editTask(`${updatedTask}{Enter}`);

			expect(ActionItemService.updateTask).toHaveBeenCalledWith(
				team.id,
				fakeAction.id,
				updatedTask
			);
		});

		it('should close delete confirmation overlay if user clicks escape', () => {
			clickDelete();
			expect(deleteMessage()).toBeTruthy();

			hitEscapeKey();
			expect(deleteMessage()).toBeFalsy();
		});

		it('should not delete thought user cancels deletion', () => {
			expect(deleteMessage()).toBeFalsy();
			clickDelete();
			expect(deleteMessage()).toBeTruthy();

			clickCancelDelete();
			expect(deleteMessage()).toBeFalsy();
			expect(ActionItemService.delete).not.toHaveBeenCalled();
		});

		it('should delete action item when user confirms deletion', async () => {
			clickDelete();
			clickConfirmDelete();

			await waitFor(() =>
				expect(ActionItemService.delete).toHaveBeenCalledWith(
					team.id,
					fakeAction.id
				)
			);
		});

		it('should close modal on delete if deleting from action item modal', async () => {
			openActionItemModal();

			await waitFor(() => expect(modalContent).not.toBeNull());

			clickDelete();
			clickConfirmDelete();

			await waitFor(() => expect(modalContent).toBeNull());
		});

		it('should mark action item as completed', async () => {
			clickCheckbox();

			await waitFor(() =>
				expect(ActionItemService.updateCompletionStatus).toHaveBeenCalledWith(
					team.id,
					fakeAction.id,
					true
				)
			);
		});

		it('should close modal after marking item complete from action item modal', async () => {
			openActionItemModal();

			await waitFor(() => expect(modalContent).not.toBeNull());

			clickCheckbox();

			await waitFor(() => expect(modalContent).toBeNull());
		});

		it('should edit Assignee', () => {
			typeAssignee('FordLabs{enter}');

			expect(ActionItemService.updateAssignee).toHaveBeenCalledWith(
				team.id,
				fakeAction.id,
				'FordLabs'
			);
			expect(ActionItemService.updateAssignee).toBeCalledTimes(1);

			typeAssignee(' Team');
			openActionItemModal();

			expect(ActionItemService.updateAssignee).toHaveBeenCalledWith(
				team.id,
				fakeAction.id,
				'FordLabs Team'
			);
			expect(ActionItemService.updateAssignee).toBeCalledTimes(2);
		});
	});

	describe('When completed', () => {
		beforeEach(() => {
			renderWithRecoilRoot(
				<ActionItem actionItemId={fakeAction.id} />,
				({ set }) => {
					set(TeamState, team);
					set(ActionItemState, [{ ...fakeAction, completed: true }]);
				}
			);
		});

		it('should have completed class', () => {
			const actionItem = screen.getByTestId('actionItem');
			expect(actionItem.className).toContain('completed');
		});

		it('should disable edit button', () => {
			expect(screen.getByTestId('editButton')).toBeDisabled();
		});

		it('should not open modal', () => {
			const actionItemTaskButton = screen.queryByTestId(
				'columnItemMessageButton'
			);
			expect(actionItemTaskButton).toBeDisabled();
			expect(modalContent).toBeNull();
		});

		it('should not disable delete button', () => {
			expect(screen.getByTestId('deleteButton')).not.toBeDisabled();
		});

		it('should not disable checkbox button', async () => {
			clickCheckbox();
			await waitFor(() =>
				expect(ActionItemService.updateCompletionStatus).toHaveBeenCalledWith(
					team.id,
					fakeAction.id,
					false
				)
			);
		});
	});
});

export function editTask(text: string) {
	const textArea: HTMLTextAreaElement = screen.getByTestId('textareaField');
	textArea.select();
	userEvent.type(textArea, text);
}

function openActionItemModal() {
	userEvent.click(screen.getByTestId('columnItemMessageButton'));
}

export function typeAssignee(text: string) {
	return userEvent.type(screen.getByTestId('actionItem-assignee'), text);
}

function clickEdit() {
	userEvent.click(screen.getByTestId('editButton'));
}

function clickDelete() {
	userEvent.click(screen.getByTestId('deleteButton'));
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

export function hitEscapeKey() {
	userEvent.type(document.body, '{Escape}');
}

function deleteMessage() {
	return screen.queryByText('Delete this Action Item?');
}
