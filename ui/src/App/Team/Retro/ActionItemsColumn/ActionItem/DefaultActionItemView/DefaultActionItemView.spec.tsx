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
import ActionItemService from 'Services/Api/ActionItemService';
import { ActionItemState } from 'State/ActionItemState';
import { ModalContents, ModalContentsState } from 'State/ModalContentsState';
import { TeamState } from 'State/TeamState';
import Action from 'Types/Action';
import { RecoilObserver } from 'Utils/RecoilObserver';
import renderWithRecoilRoot from 'Utils/renderWithRecoilRoot';

import { mockTeam } from '../../../../../../Services/Api/__mocks__/TeamService';
import ActionItem, { ActionItemViewState } from '../ActionItem';

import DefaultActionItemView from './DefaultActionItemView';

jest.mock('Services/Api/ActionItemService');

describe('Default Action Item View', () => {
	let modalContent: ModalContents | null;

	const fakeActionItem: Action = {
		id: 0,
		task: 'fake task',
		assignee: '',
		completed: false,
		dateCreated: '2021-08-12',
		archived: false,
	};
	const mockSetViewState = jest.fn();
	const mockSetActionItemHeight = jest.fn();

	beforeEach(() => {
		modalContent = null;

		Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
			configurable: true,
			value: 100,
		});
	});

	it('should render without axe errors', async () => {
		const { container } = renderWithRecoilRoot(
			<DefaultActionItemView
				actionItem={fakeActionItem}
				setViewState={mockSetViewState}
				setActionItemMinHeight={mockSetActionItemHeight}
			/>
		);
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});

	describe('When action item is NOT completed', () => {
		beforeEach(() => {
			renderWithRecoilRoot(
				<>
					<RecoilObserver
						recoilState={ModalContentsState}
						onChange={(value: ModalContents) => {
							modalContent = value;
						}}
					/>
					<DefaultActionItemView
						actionItem={fakeActionItem}
						setViewState={mockSetViewState}
						setActionItemMinHeight={mockSetActionItemHeight}
					/>
				</>,
				({ set }) => {
					set(TeamState, mockTeam);
					set(ActionItemState, [fakeActionItem]);
				}
			);
		});

		it('should not have opacity class on action item', () => {
			expect(getActionItemTaskButton().className).not.toContain('opacity');
		});

		it('should show current action item task', () => {
			expect(getActionItemTaskButton()).toHaveTextContent(fakeActionItem.task);
		});

		it('should show created date', () => {
			expect(screen.getByText('Aug 12th')).toBeDefined();
		});

		it('should show delete action item view when user clicks delete button', () => {
			const deleteButton = getDeleteButton();
			expect(deleteButton).toBeEnabled();
			userEvent.click(deleteButton);
			expect(mockSetViewState).toHaveBeenCalledWith(
				ActionItemViewState.DELETE_ACTION_ITEM
			);
			expect(mockSetActionItemHeight).toHaveBeenCalledWith(100);
		});

		it('should show edit action item view when user clicks the edit button', () => {
			userEvent.click(getEditButton());
			expect(mockSetViewState).toHaveBeenCalledWith(
				ActionItemViewState.EDIT_ACTION_ITEM
			);
		});

		it('should mark as completed when user clicks the checkbox button', async () => {
			userEvent.click(getCheckboxButton());

			await waitFor(() =>
				expect(ActionItemService.updateCompletionStatus).toHaveBeenCalledWith(
					mockTeam.id,
					fakeActionItem.id,
					true
				)
			);
		});

		it('should open modal when clicking on action item task', async () => {
			userEvent.click(getActionItemTaskButton());

			await waitFor(() =>
				expect(modalContent).toEqual({
					title: 'Action Item',
					component: <ActionItem actionItemId={fakeActionItem.id} />,
					superSize: true,
				})
			);
		});
	});

	describe('When action item IS completed', () => {
		const completedActionItem: Action = { ...fakeActionItem, completed: true };

		beforeEach(() => {
			renderWithRecoilRoot(
				<>
					<RecoilObserver
						recoilState={ModalContentsState}
						onChange={(value: ModalContents) => {
							modalContent = value;
						}}
					/>
					<DefaultActionItemView
						actionItem={completedActionItem}
						setViewState={mockSetViewState}
						setActionItemMinHeight={mockSetActionItemHeight}
					/>
				</>,
				({ set }) => {
					set(TeamState, mockTeam);
					set(ActionItemState, [completedActionItem]);
				}
			);
		});

		it('should have opacity class on action item task button', () => {
			expect(getActionItemTaskButton()).toHaveClass('opacity');
		});

		it('should disable action item task button', () => {
			expect(getActionItemTaskButton()).toBeDisabled();
		});

		it('should disable edit button', () => {
			expect(getEditButton()).toBeDisabled();
		});

		it('should NOT disable delete button', () => {
			expect(getDeleteButton()).toBeEnabled();
		});

		it('should NOT disable checkbox button', async () => {
			expect(getCheckboxButton()).toBeEnabled();
		});
	});
});

function getActionItemTaskButton() {
	return screen.getByTestId('actionItemTaskButton');
}

function getDeleteButton() {
	return screen.getByTestId('deleteButton');
}

function getCheckboxButton() {
	return screen.getByTestId('checkboxButton');
}

function getEditButton() {
	return screen.getByTestId('editButton');
}
