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
import { mockTeam } from 'Services/Api/__mocks__/TeamService';
import { ActionItemState } from 'State/ActionItemState';
import { ModalContents, ModalContentsState } from 'State/ModalContentsState';
import { TeamState } from 'State/TeamState';
import Action from 'Types/Action';
import { RecoilObserver } from 'Utils/RecoilObserver';
import renderWithRecoilRoot from 'Utils/renderWithRecoilRoot';

import ActionItem from './ActionItem';

jest.mock('Services/Api/ActionItemService');

describe('Action Item', () => {
	let modalContent: ModalContents | null;

	const fakeActionItem: Action = {
		id: 0,
		task: 'fake task',
		assignee: '',
		completed: false,
		dateCreated: '2021-08-12',
		archived: false,
	};

	beforeEach(() => {
		modalContent = null;
	});

	it('should render without axe errors', async () => {
		const { container } = renderWithRecoilRoot(
			<ActionItem actionItemId={fakeActionItem.id} />,
			({ set }) => {
				set(ActionItemState, [fakeActionItem]);
			}
		);
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});

	describe('Switching view states', () => {
		beforeEach(() => {
			renderWithRecoilRoot(
				<ActionItem actionItemId={fakeActionItem.id} />,
				({ set }) => {
					set(ActionItemState, [fakeActionItem]);
				}
			);

			isInDefaultView(fakeActionItem.task);
		});

		it('should show delete action item view when user clicks the delete button', () => {
			getDeleteButton().click();
			isInDeleteActionItemView();
		});

		it('should show default view when user clicks cancel from delete action item view', () => {
			getDeleteButton().click();
			screen.getByText('No').click();
			isInDefaultView(fakeActionItem.task);
		});

		it('should show edit action item view when user clicks the edit button', () => {
			getEditButton().click();
			isInEditActionItemView();
		});

		it('should show default view when user clicks save from edit action item view', () => {
			getEditButton().click();
			screen.getByText('Save!').click();
			isInDefaultView(fakeActionItem.task);
		});
	});

	describe('When inside modal', () => {
		beforeEach(() => {
			renderWithRecoilRoot(
				<>
					<RecoilObserver
						recoilState={ModalContentsState}
						onChange={(value: ModalContents) => {
							modalContent = value;
						}}
					/>
					<ActionItem actionItemId={fakeActionItem.id} />,
				</>,
				({ set }) => {
					set(TeamState, mockTeam);
					set(ActionItemState, [{ ...fakeActionItem, completed: true }]);
					set(ModalContentsState, {
						title: 'Action Item',
						component: <ActionItem actionItemId={fakeActionItem.id} />,
						superSize: true,
					});
				}
			);
		});

		it('should close modal when deleting item from action item modal', async () => {
			clickDeleteActionItemButton();
			clickConfirmDeleteButton();

			await waitFor(() => expect(modalContent).toBeNull());
		});

		it('should close modal when marked as complete from action item modal', async () => {
			clickCheckboxToMarkItemAsCompleted();

			await waitFor(() => expect(modalContent).toBeNull());
		});

		it('should disable action item task button', () => {
			expect(getActionItemTaskButton()).toBeDisabled();
		});
	});
});

function clickDeleteActionItemButton() {
	userEvent.click(screen.getByTestId('deleteButton'));
}

function clickCheckboxToMarkItemAsCompleted() {
	userEvent.click(screen.getByTestId('checkboxButton'));
}

function clickConfirmDeleteButton() {
	userEvent.click(screen.getByText('Yes'));
}

function getActionItemTaskButton() {
	return screen.getByTestId('actionItemTaskButton');
}

function isInDefaultView(activeThought: string) {
	expect(getActionItemTaskButton()).toHaveTextContent(activeThought);
	expect(screen.queryByText('Delete this Action Item?')).toBeNull();
	expect(screen.queryByTestId('textareaField')).toBeNull();
}

function isInEditActionItemView() {
	expect(screen.getByTestId('textareaField')).toBeDefined();
	expect(screen.queryByText('Delete this Action Item?')).toBeNull();
	expect(screen.queryByTestId('thoughtMessageButton')).toBeNull();
}

function isInDeleteActionItemView() {
	expect(screen.getByText('Delete this Action Item?')).toBeDefined();
	expect(screen.queryByTestId('thoughtMessageButton')).toBeNull();
	expect(screen.queryByTestId('textareaField')).toBeNull();
}

function getDeleteButton() {
	return screen.getByTestId('deleteButton');
}

function getEditButton() {
	return screen.getByTestId('editButton');
}
