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
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';

import ThoughtService from '../../../../../../Services/Api/ThoughtService';
import { TeamState } from '../../../../../../State/TeamState';
import { ThoughtsState } from '../../../../../../State/ThoughtsState';
import Team from '../../../../../../Types/Team';
import Thought from '../../../../../../Types/Thought';
import Topic from '../../../../../../Types/Topic';
import renderWithRecoilRoot from '../../../../../../Utils/renderWithRecoilRoot';
import { ThoughtItemViewState } from '../ThoughtItem';

import EditThoughtView from './EditThoughtView';

jest.mock('../../../../../../Services/Api/ThoughtService');

describe('Edit Thought View', () => {
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
	const newThought = 'New Fake Text';
	const mockSetViewState = jest.fn();
	let container: string | Element;

	beforeEach(() => {
		({ container } = renderWithRecoilRoot(
			<EditThoughtView thought={fakeThought} setViewState={mockSetViewState} />,
			({ set }) => {
				set(TeamState, team);
				set(ThoughtsState, [fakeThought]);
			}
		));
	});

	it('should render without axe errors', async () => {
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});

	it('should cancel editing thought on escape', () => {
		editThought(newThought);
		expect(getTextarea()).toHaveValue(newThought);

		userEvent.type(document.body, '{Escape}');
		expect(mockSetViewState).toHaveBeenCalledWith(ThoughtItemViewState.DEFAULT);
		expect(ThoughtService.updateMessage).not.toHaveBeenCalled();
	});

	it('should cancel editing thought on cancel button click', () => {
		editThought(newThought);
		expect(getTextarea()).toHaveValue(newThought);

		screen.getByText('Cancel').click();
		expect(mockSetViewState).toHaveBeenCalledWith(ThoughtItemViewState.DEFAULT);
		expect(ThoughtService.updateMessage).not.toHaveBeenCalled();
	});

	it('should edit thought and save on enter', () => {
		const updatedText = 'New Fake Text';
		editThought(`${updatedText}{Enter}`);
		expect(ThoughtService.updateMessage).toHaveBeenCalledWith(
			team.id,
			fakeThought.id,
			updatedText
		);
		expect(mockSetViewState).toHaveBeenCalledWith(ThoughtItemViewState.DEFAULT);
	});

	it('should edit thought and save on submit button click', () => {
		const updatedText = 'New Fake Text';
		editThought(`${updatedText}`);
		screen.getByText('Save!').click();
		expect(ThoughtService.updateMessage).toHaveBeenCalledWith(
			team.id,
			fakeThought.id,
			updatedText
		);
		expect(mockSetViewState).toHaveBeenCalledWith(ThoughtItemViewState.DEFAULT);
	});
});

function editThought(text: string) {
	const textArea = screen.getByTestId('textareaField') as HTMLTextAreaElement;
	textArea.select();
	userEvent.type(textArea, text);
}

function getTextarea() {
	return screen.getByTestId('textareaField');
}
