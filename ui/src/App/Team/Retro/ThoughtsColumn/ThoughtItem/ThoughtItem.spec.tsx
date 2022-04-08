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
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { RecoilRoot } from 'recoil';

import ThoughtService from '../../../../../Services/Api/ThoughtService';
import {
	ModalContents,
	ModalContentsState,
} from '../../../../../State/ModalContentsState';
import { TeamState } from '../../../../../State/TeamState';
import { ThoughtsState } from '../../../../../State/ThoughtsState';
import Team from '../../../../../Types/Team';
import Thought from '../../../../../Types/Thought';
import Topic, { ThoughtTopic } from '../../../../../Types/Topic';
import { RecoilObserver } from '../../../../../Utils/RecoilObserver';
import ThoughtItemWithAddAction from '../ThoughtItemWithAddAction/ThoughtItemWithAddAction';

import ThoughtItem from './ThoughtItem';

jest.mock('../../../../../Services/Api/ThoughtService');

describe('Retro Item', () => {
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
		topic: Topic.HAPPY,
		columnId: 10,
	};

	beforeEach(() => {
		modalContent = null;
	});

	it('should render without axe errors', async () => {
		const { container } = render(
			<RecoilRoot
				initializeState={({ set }) => {
					set(ThoughtsState, [fakeThought]);
				}}
			>
				<ThoughtItem thoughtId={fakeThought.id} type={Topic.HAPPY} />
			</RecoilRoot>
		);
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});

	it.each([[Topic.HAPPY], [Topic.CONFUSED], [Topic.UNHAPPY]])(
		'should render %s type',
		(type: Topic) => {
			render(
				<RecoilRoot
					initializeState={({ set }) => {
						set(ThoughtsState, [fakeThought]);
					}}
				>
					<ThoughtItem thoughtId={fakeThought.id} type={type as ThoughtTopic} />
				</RecoilRoot>
			);

			expect(screen.getByTestId('retroItem').className).toContain(type);
		}
	);

	it('should render thought message and upvotes', () => {
		render(
			<RecoilRoot
				initializeState={({ set }) => {
					set(ThoughtsState, [fakeThought]);
				}}
			>
				<ThoughtItem thoughtId={fakeThought.id} type={Topic.HAPPY} />
			</RecoilRoot>
		);

		screen.getByText(fakeThought.message);
		screen.getByText(fakeThought.hearts);
		screen.getByText('Upvote');
	});

	describe('When not discussed and buttons are not disabled', () => {
		beforeEach(() => {
			render(
				<RecoilRoot
					initializeState={({ set }) => {
						set(TeamState, team);
						set(ThoughtsState, [fakeThought]);
					}}
				>
					<RecoilObserver
						recoilState={ModalContentsState}
						onChange={(value: ModalContents) => {
							modalContent = value;
						}}
					/>
					<ThoughtItem type={Topic.HAPPY} thoughtId={fakeThought.id} />
				</RecoilRoot>
			);
		});

		it('should open retro item modal', async () => {
			openRetroItemModal();

			await waitFor(() =>
				expect(modalContent).toEqual({
					title: 'Retro Item',
					component: (
						<ThoughtItemWithAddAction
							type={Topic.HAPPY}
							thoughtId={fakeThought.id}
						/>
					),
					superSize: true,
				})
			);
		});

		it('should upvote thought', () => {
			clickUpvote();

			expect(ThoughtService.upvoteThought).toHaveBeenCalledWith(
				team.id,
				fakeThought.id
			);
		});

		it('should start and cancel editing of thought', () => {
			const newText = 'New Fake Text';

			screen.getByText(fakeThought.message);

			clickEdit();
			screen.getByText(fakeThought.message);

			editText(newText);
			screen.getByText(newText);

			escapeKey();
			screen.getByText(fakeThought.message);

			clickEdit();
			screen.getByText(fakeThought.message);

			editText(newText);
			screen.getByText(newText);

			screen.getByText('Cancel').click();
			screen.getByText(fakeThought.message);
		});

		it('should show edit view on edit button click', () => {
			clickEdit();
			expect(screen.getByTestId('textareaField')).toBeDefined();
			expect(screen.queryByText('Delete this')).toBeNull();
			expect(screen.queryByTestId('columnItemMessageButton')).toBeNull();
		});

		it('should edit thought', () => {
			clickEdit();
			const updatedText = 'New Fake Text';
			editText(`${updatedText}{Enter}`);
			expect(ThoughtService.updateMessage).toHaveBeenCalledWith(
				team.id,
				fakeThought.id,
				updatedText
			);
		});

		it('should close delete confirmation overlay if user clicks escape', () => {
			clickDelete();
			expect(deleteMessage()).toBeTruthy();

			escapeKey();
			expect(deleteMessage()).toBeFalsy();
		});

		it('should not delete thought user cancels deletion', () => {
			expect(deleteMessage()).toBeFalsy();
			clickDelete();
			expect(deleteMessage()).toBeTruthy();

			clickCancelDelete();
			expect(deleteMessage()).toBeFalsy();
			expect(ThoughtService.delete).not.toHaveBeenCalled();
		});

		it('should delete thought when user confirms deletion', async () => {
			clickDelete();
			clickConfirmDelete();
			await waitFor(() =>
				expect(ThoughtService.delete).toHaveBeenCalledWith(
					team.id,
					fakeThought.id
				)
			);
		});

		it('should close modal when deleting item from retro item modal', async () => {
			openRetroItemModal();

			await waitFor(() => expect(modalContent).not.toBeNull());

			clickDelete();
			clickConfirmDelete();

			await waitFor(() => expect(modalContent).toBeNull());
		});

		it('should mark as discussed', async () => {
			clickCheckboxToMarkItemAsDiscussed();
			await waitFor(() =>
				expect(ThoughtService.updateDiscussionStatus).toHaveBeenCalledWith(
					team.id,
					fakeThought.id,
					true
				)
			);
		});

		it('should close modal when marked as discussed retro item modal', async () => {
			openRetroItemModal();

			await waitFor(() => expect(modalContent).not.toBeNull());

			clickCheckboxToMarkItemAsDiscussed();

			await waitFor(() => expect(modalContent).toBeNull());
		});
	});

	describe('When discussed', () => {
		beforeEach(() => {
			render(
				<RecoilRoot
					initializeState={({ set }) => {
						set(TeamState, team);
						set(ThoughtsState, [{ ...fakeThought, discussed: true }]);
					}}
				>
					<ThoughtItem type={Topic.HAPPY} thoughtId={fakeThought.id} />
				</RecoilRoot>
			);
		});

		it('should have completed class', () => {
			const retroItem = screen.getByTestId('retroItem');
			expect(retroItem.className).toContain('completed');
		});

		it('should disable upvote button', () => {
			clickUpvote();
			expect(ThoughtService.upvoteThought).not.toHaveBeenCalled();
		});

		it('should disable edit button', () => {
			expect(screen.getByTestId('editButton')).toBeDisabled();
		});

		it('should not open modal', () => {
			const retroItemButton = screen.queryByTestId('textareaField');
			expect(retroItemButton).toBeNull();
			expect(modalContent).toBeNull();
		});

		it('should not disable delete button', () => {
			clickDelete();
			expect(deleteMessage()).toBeTruthy();
		});

		it('should not disable checkbox button', async () => {
			clickCheckboxToMarkItemAsDiscussed();
			await waitFor(() =>
				expect(ThoughtService.updateDiscussionStatus).toHaveBeenCalledWith(
					team.id,
					fakeThought.id,
					false
				)
			);
		});
	});

	describe('When buttons are disabled', () => {
		beforeEach(() => {
			render(
				<RecoilRoot
					initializeState={({ set }) => {
						set(ThoughtsState, [fakeThought]);
					}}
				>
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
				</RecoilRoot>
			);
		});

		it('should disable all buttons', () => {
			expect(screen.getByTestId('columnItemMessageButton')).toBeDisabled();
			expect(screen.getByTestId('retroItem-upvote')).toBeDisabled();
			expect(screen.getByTestId('editButton')).toBeDisabled();
			expect(screen.getByTestId('deleteButton')).toBeDisabled();
			expect(screen.getByTestId('checkboxButton')).toBeDisabled();
		});
	});
});

function editText(text: string) {
	const textArea = screen.getByTestId('textareaField') as HTMLTextAreaElement;
	textArea.select();
	userEvent.type(textArea, text);
}

function openRetroItemModal() {
	userEvent.click(screen.getByTestId('columnItemMessageButton'));
}

function clickUpvote() {
	userEvent.click(screen.getByTestId('retroItem-upvote'));
}

function clickEdit() {
	userEvent.click(screen.getByTestId('editButton'));
}

function clickDelete() {
	userEvent.click(screen.getByTestId('deleteButton'));
}

function clickCheckboxToMarkItemAsDiscussed() {
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
