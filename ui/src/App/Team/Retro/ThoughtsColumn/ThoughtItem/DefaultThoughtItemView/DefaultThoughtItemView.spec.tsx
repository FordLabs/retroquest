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
import ThoughtService from 'Services/Api/ThoughtService';
import { ModalContents, ModalContentsState } from 'State/ModalContentsState';
import { TeamState } from 'State/TeamState';
import { ThoughtsState } from 'State/ThoughtsState';
import Team from 'Types/Team';
import Thought from 'Types/Thought';
import Topic from 'Types/Topic';
import { RecoilObserver } from 'Utils/RecoilObserver';
import renderWithRecoilRoot from 'Utils/renderWithRecoilRoot';

import ThoughtItemWithAddAction from '../../ThoughtItemWithAddAction/ThoughtItemWithAddAction';
import ThoughtItem, { ThoughtItemViewState } from '../ThoughtItem';

import DefaultThoughtItemView from './DefaultThoughtItemView';

jest.mock('Services/Api/ThoughtService');

describe('Default Thought Item View', () => {
	let modalContent: ModalContents | null;
	const team: Team = {
		name: 'My Team',
		id: 'my-team',
	};

	const fakeThought: Thought = {
		id: 12,
		message: 'fake message',
		hearts: 3,
		discussed: false,
		columnId: 1,
	};
	const mockSetViewState = jest.fn();
	const mockSetThoughtItemHeight = jest.fn();

	beforeEach(() => {
		modalContent = null;

		Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
			configurable: true,
			value: 100,
		});
	});

	it('should render without axe errors', async () => {
		const { container } = renderWithRecoilRoot(
			<DefaultThoughtItemView
				type={Topic.HAPPY}
				thought={fakeThought}
				setViewState={mockSetViewState}
				setThoughtItemHeight={mockSetThoughtItemHeight}
				disableButtons={false}
			/>
		);
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});

	describe('When thought is NOT discussed', () => {
		beforeEach(() => {
			renderWithRecoilRoot(
				<>
					<RecoilObserver
						recoilState={ModalContentsState}
						onChange={(value: ModalContents) => {
							modalContent = value;
						}}
					/>
					<DefaultThoughtItemView
						type={Topic.HAPPY}
						thought={fakeThought}
						setViewState={mockSetViewState}
						setThoughtItemHeight={mockSetThoughtItemHeight}
						disableButtons={false}
					/>
				</>,
				({ set }) => {
					set(TeamState, team);
					set(ThoughtsState, [fakeThought]);
				}
			);
		});

		it('should not have opacity class on thought', () => {
			expect(getThoughtMessageButton().className).not.toContain('opacity');
		});

		it('should show current thought message', () => {
			expect(getThoughtMessageButton()).toHaveTextContent(fakeThought.message);
		});

		it('should upvote thought', () => {
			userEvent.click(getUpvoteButton());

			expect(ThoughtService.upvoteThought).toHaveBeenCalledWith(
				team.id,
				fakeThought.id
			);
		});

		it('should change view state to delete confirmation when user clicks delete button', () => {
			const deleteButton = getDeleteButton();
			expect(deleteButton).toBeEnabled();
			userEvent.click(deleteButton);
			expect(mockSetViewState).toHaveBeenCalledWith(
				ThoughtItemViewState.DELETE_THOUGHT
			);
			expect(mockSetThoughtItemHeight).toHaveBeenCalledWith(100);
		});

		it('should show edit thought view when user clicks the edit button', () => {
			userEvent.click(getEditButton());
			expect(mockSetViewState).toHaveBeenCalledWith(
				ThoughtItemViewState.EDIT_THOUGHT
			);
		});

		it('should mark as discussed when user clicks the checkbox button', async () => {
			userEvent.click(getCheckboxButton());

			await waitFor(() =>
				expect(ThoughtService.updateDiscussionStatus).toHaveBeenCalledWith(
					team.id,
					fakeThought.id,
					true
				)
			);
		});

		it('should open modal when clicking on thought message', async () => {
			userEvent.click(getThoughtMessageButton());

			await waitFor(() =>
				expect(modalContent).toEqual({
					title: 'Retro Item',
					component: (
						<ThoughtItemWithAddAction
							thoughtId={fakeThought.id}
							type={Topic.HAPPY}
						/>
					),
					superSize: true,
				})
			);
		});
	});

	describe('When thought IS discussed', () => {
		const discussedThought: Thought = { ...fakeThought, discussed: true };

		beforeEach(() => {
			renderWithRecoilRoot(
				<>
					<RecoilObserver
						recoilState={ModalContentsState}
						onChange={(value: ModalContents) => {
							modalContent = value;
						}}
					/>
					<DefaultThoughtItemView
						type={Topic.HAPPY}
						thought={discussedThought}
						setViewState={mockSetViewState}
						setThoughtItemHeight={mockSetThoughtItemHeight}
						disableButtons={false}
					/>
				</>,
				({ set }) => {
					set(TeamState, team);
					set(ThoughtsState, [discussedThought]);
				}
			);
		});

		it('should have opacity class on thought message button', () => {
			expect(getThoughtMessageButton()).toHaveClass('opacity');
		});

		it('should disable thought message button', () => {
			expect(getThoughtMessageButton()).toBeDisabled();
		});

		it('should disable upvote button', () => {
			expect(getUpvoteButton()).toBeDisabled();
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

	describe('When buttons are disabled', () => {
		beforeEach(() => {
			renderWithRecoilRoot(
				<>
					<RecoilObserver
						recoilState={ModalContentsState}
						onChange={(value: ModalContents) => {
							modalContent = value;
						}}
					/>
					<ThoughtItem
						disableButtons={true}
						type={Topic.HAPPY}
						thoughtId={fakeThought.id}
					/>
				</>,
				({ set }) => {
					set(ThoughtsState, [fakeThought]);
				}
			);
		});

		it('should disable thought message button', () => {
			const thoughtMessageButton = getThoughtMessageButton();
			expect(thoughtMessageButton).toBeDisabled();
		});

		it('should disable upvote button', () => {
			expect(getUpvoteButton()).toBeDisabled();
		});

		it('should disable edit button', () => {
			expect(getEditButton()).toBeDisabled();
		});

		it('should disable delete button', () => {
			expect(getDeleteButton()).toBeDisabled();
		});

		it('should disable checkbox', () => {
			expect(getCheckboxButton()).toBeDisabled();
		});
	});
});

function getThoughtMessageButton() {
	return screen.getByTestId('thoughtMessageButton');
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

function getUpvoteButton() {
	return screen.getByTestId('retroItem-upvote');
}
