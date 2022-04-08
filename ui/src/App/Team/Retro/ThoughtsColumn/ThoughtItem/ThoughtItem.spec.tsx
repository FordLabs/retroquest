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

import {
	ModalContents,
	ModalContentsState,
} from '../../../../../State/ModalContentsState';
import { TeamState } from '../../../../../State/TeamState';
import { ThoughtsState } from '../../../../../State/ThoughtsState';
import Team from '../../../../../Types/Team';
import Thought from '../../../../../Types/Thought';
import Topic from '../../../../../Types/Topic';
import { RecoilObserver } from '../../../../../Utils/RecoilObserver';
import renderWithRecoilRoot from '../../../../../Utils/renderWithRecoilRoot';
import ThoughtItemWithAddAction from '../ThoughtItemWithAddAction/ThoughtItemWithAddAction';

import ThoughtItem from './ThoughtItem';

jest.mock('../../../../../Services/Api/ThoughtService');

describe('Thought Item', () => {
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
		columnId: 1,
	};

	beforeEach(() => {
		modalContent = null;
	});

	it('should render without axe errors', async () => {
		const { container } = renderWithRecoilRoot(
			<ThoughtItem thoughtId={fakeThought.id} type={Topic.HAPPY} />,
			({ set }) => {
				set(ThoughtsState, [fakeThought]);
			}
		);
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});

	describe('Switching view states', () => {
		beforeEach(() => {
			renderWithRecoilRoot(
				<ThoughtItem thoughtId={fakeThought.id} type={Topic.HAPPY} />,
				({ set }) => {
					set(ThoughtsState, [fakeThought]);
				}
			);

			isInDefaultView(fakeThought.message);
		});

		it('should show delete thought view when user clicks the delete button', () => {
			getDeleteButton().click();
			isInDeleteThoughtView();
		});

		it('should show default view when user clicks cancel from delete thought item view', () => {
			getDeleteButton().click();
			screen.getByText('No').click();
			isInDefaultView(fakeThought.message);
		});

		it('should show edit thought item view when user clicks the edit button', () => {
			getEditButton().click();
			isInEditThoughtView();
		});

		it('should show default view when user clicks save from edit thought item view', () => {
			getEditButton().click();
			screen.getByText('Save!').click();
			isInDefaultView(fakeThought.message);
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
					<ThoughtItem thoughtId={fakeThought.id} type={Topic.HAPPY} />,
				</>,
				({ set }) => {
					set(TeamState, team);
					set(ThoughtsState, [{ ...fakeThought, discussed: true }]);
					set(ModalContentsState, {
						title: 'Retro Item',
						component: (
							<ThoughtItemWithAddAction
								thoughtId={fakeThought.id}
								type={Topic.HAPPY}
							/>
						),
						superSize: true,
					});
				}
			);
		});

		it('should close modal when deleting item from thought item modal', async () => {
			clickDeleteThoughtItemButton();
			clickConfirmDeleteButton();

			await waitFor(() => expect(modalContent).toBeNull());
		});

		it('should close modal when marked as complete from thought item modal', async () => {
			clickCheckboxToMarkItemAsDiscussed();

			await waitFor(() => expect(modalContent).toBeNull());
		});

		it('should disable thought item message button', () => {
			expect(getThoughtMessageButton()).toBeDisabled();
		});
	});
});

function clickDeleteThoughtItemButton() {
	userEvent.click(screen.getByTestId('deleteButton'));
}

function clickCheckboxToMarkItemAsDiscussed() {
	userEvent.click(screen.getByTestId('checkboxButton'));
}

function clickConfirmDeleteButton() {
	userEvent.click(screen.getByText('Yes'));
}

function getThoughtMessageButton() {
	return screen.getByTestId('thoughtMessageButton');
}

function isInDefaultView(activeThought: string) {
	expect(getThoughtMessageButton()).toHaveTextContent(activeThought);
	expect(screen.queryByText('Delete this Thought?')).toBeNull();
	expect(screen.queryByTestId('textareaField')).toBeNull();
}

function isInEditThoughtView() {
	expect(screen.getByTestId('textareaField')).toBeDefined();
	expect(screen.queryByText('Delete this Thought?')).toBeNull();
	expect(screen.queryByTestId('thoughtMessageButton')).toBeNull();
}

function isInDeleteThoughtView() {
	expect(screen.getByText('Delete this Thought?')).toBeDefined();
	expect(screen.queryByTestId('thoughtMessageButton')).toBeNull();
	expect(screen.queryByTestId('textareaField')).toBeNull();
}

function getDeleteButton() {
	return screen.getByTestId('deleteButton');
}

function getEditButton() {
	return screen.getByTestId('editButton');
}
