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

import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { RecoilRoot } from 'recoil';

import ActionItemService from '../../../../../Services/Api/ActionItemService';
import {
	ModalContents,
	ModalContentsState,
} from '../../../../../State/ModalContentsState';
import { TeamState } from '../../../../../State/TeamState';
import Action from '../../../../../Types/Action';
import Team from '../../../../../Types/Team';
import { RecoilObserver } from '../../../../../Utils/RecoilObserver';
import ActionItemModal from '../ActionItemModal/ActionItemModal';

import ActionItem from './ActionItem';

jest.mock('../../../../../Services/Api/ActionItemService');

describe('ActionItem', () => {
	let modalContent: ModalContents | null;
	const fadeInAnimationClass = 'fade-in';
	const fadeOutAnimationClass = 'fade-out';

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
		const { container } = render(
			<RecoilRoot>
				<ActionItem action={fakeAction} />
			</RecoilRoot>
		);
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});

	it('should render as an action column item with created date', () => {
		render(
			<RecoilRoot>
				<ActionItem action={fakeAction} />
			</RecoilRoot>
		);

		expect(screen.getByTestId('actionItem').className).toContain('action');
		screen.getByText('Aug 12th');
	});

	it('should disable animations', () => {
		render(
			<RecoilRoot>
				<ActionItem action={fakeAction} disableAnimations={true} />
			</RecoilRoot>
		);

		const actionItem = screen.getByTestId('actionItem');
		expect(actionItem.className).not.toContain(fadeInAnimationClass);
		expect(actionItem.className).not.toContain(fadeOutAnimationClass);
	});

	describe('When not completed', () => {
		beforeEach(() => {
			render(
				<RecoilRoot
					initializeState={({ set }) => {
						set(TeamState, team);
					}}
				>
					<RecoilObserver
						recoilState={ModalContentsState}
						onChange={(value: ModalContents) => {
							modalContent = value;
						}}
					/>
					<ActionItem action={fakeAction} />
				</RecoilRoot>
			);
		});

		it('should open retro item modal', async () => {
			openActionItemModal();
			await waitFor(() =>
				expect(modalContent).toEqual({
					title: 'Action Item',
					component: <ActionItemModal actionItemId={fakeAction.id} />,
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

			clickEdit();
			screen.getByText(fakeAction.task);
		});

		it('should disable other items while editing', () => {
			clickEdit();
			expect(
				screen.getByTestId('editableText').getAttribute('readonly') === ''
			).toBeFalsy();

			expect(
				screen.getByTestId('actionItem-assignee').getAttribute('disabled')
			).not.toBeNull();

			clickDelete();
			expect(deleteMessage()).toBeFalsy();

			clickCheckbox();
			expect(ActionItemService.updateCompletionStatus).not.toHaveBeenCalled();
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

		it('should mark action item as completed and switch animation class', async () => {
			const actionItem = screen.getByTestId('actionItem');
			expect(actionItem.className).toContain(fadeInAnimationClass);
			expect(actionItem.className).not.toContain(fadeOutAnimationClass);
			clickCheckbox();

			await waitFor(() =>
				expect(ActionItemService.updateCompletionStatus).toHaveBeenCalledWith(
					team.id,
					fakeAction.id,
					true
				)
			);
			expect(actionItem.className).not.toContain(fadeInAnimationClass);
			expect(actionItem.className).toContain(fadeOutAnimationClass);
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
			render(
				<RecoilRoot
					initializeState={({ set }) => {
						set(TeamState, team);
					}}
				>
					<ActionItem action={{ ...fakeAction, completed: true }} />
				</RecoilRoot>
			);
		});

		it('should disable edit button', () => {
			clickEdit();
			expect(screen.getByTestId('editableText').getAttribute('readonly')).toBe(
				''
			);
		});

		it('should not open modal', () => {
			const actionItemTaskButton = screen.queryByTestId('editableText-select');
			expect(actionItemTaskButton).toBeNull();
			expect(modalContent).toBeNull();
		});

		it('should not disable delete button', () => {
			clickDelete();
			expect(deleteMessage()).toBeTruthy();
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
	const textArea = (screen.queryByTestId('editableText') ||
		screen.queryByTestId('addActionItem-task')) as HTMLTextAreaElement;
	textArea.select();
	userEvent.type(textArea, text);
}

function openActionItemModal() {
	userEvent.click(screen.getByTestId('editableText-select'));
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
