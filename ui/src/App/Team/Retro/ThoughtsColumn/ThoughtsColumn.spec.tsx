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
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { getMockThought } from '../../../../Services/Api/__mocks__/ThoughtService';
import ColumnService from '../../../../Services/Api/ColumnService';
import ThoughtService from '../../../../Services/Api/ThoughtService';
import DragAndDrop from '../../../../Services/DragAndDrop/DragAndDrop';
import { TeamState } from '../../../../State/TeamState';
import { ThoughtsState } from '../../../../State/ThoughtsState';
import { Column } from '../../../../Types/Column';
import Team from '../../../../Types/Team';
import Thought from '../../../../Types/Thought';
import Topic from '../../../../Types/Topic';
import renderWithRecoilRoot from '../../../../Utils/renderWithRecoilRoot';

import ThoughtsColumn from './ThoughtsColumn';

const team: Team = {
	name: 'My Team',
	id: 'my-team',
};

const activeThought1: Thought = getMockThought(1, false, 1);
activeThought1.id = 943;
const activeThought2: Thought = getMockThought(1, false, 2);
const discussedThought1: Thought = getMockThought(1, true, 3);
const discussedThought2: Thought = getMockThought(1, true, 4);

const column: Column = {
	id: 1,
	topic: Topic.HAPPY,
	title: 'Happy',
};

jest.mock('../../../../Services/Api/ThoughtService');
jest.mock('../../../../Services/Api/ColumnService');

describe('ThoughtsColumn', () => {
	beforeEach(async () => {
		renderWithRecoilRoot(
			<DragAndDrop>
				<ThoughtsColumn column={column} />
			</DragAndDrop>,
			({ set }) => {
				set(ThoughtsState, [
					activeThought1,
					activeThought2,
					discussedThought1,
					discussedThought2,
				]);
				set(TeamState, team);
			}
		);
	});

	it('should show column title', () => {
		expect(screen.getByText(column.title)).toBeDefined();
	});

	it('should show count of active thoughts', () => {
		const countContainer = screen.getByTestId('countSeparator');
		const activeItemCount = within(countContainer).getByText('2');
		expect(activeItemCount).toBeDefined();
	});

	it('should render retro items', () => {
		const retroItems = screen.getAllByTestId('retroItem');
		expect(retroItems.length).toBe(4);
	});

	describe('Create Thought', () => {
		const placeholderText = 'Enter a Thought';

		it('should not make call to create thought until user types a thought', () => {
			const textField = screen.getByPlaceholderText(placeholderText);
			userEvent.type(textField, `{enter}`);

			expect(ThoughtService.create).not.toHaveBeenCalled();
		});

		it('should make call to create thought when user types and submits a new thought', () => {
			const textField = screen.getByPlaceholderText(placeholderText);

			const thoughtMessage = 'I had a new thought...';
			userEvent.type(textField, `${thoughtMessage}{enter}`);

			expect(ThoughtService.create).toHaveBeenCalledWith(team.id, {
				message: thoughtMessage,
				columnId: column.id,
			});
		});
	});

	describe('Sorting Columns', () => {
		it('should sort thoughts in descending order based on heart count', () => {
			confirmThoughtsAreInOriginalOrder();
			userEvent.click(getSortButton());
			confirmThoughtsAreInSortedOrder();
		});

		it('should unsort thoughts by returning thoughts original order', () => {
			const sortButton = getSortButton();
			userEvent.click(sortButton);
			userEvent.click(sortButton);
			const thoughtItems = screen.getAllByTestId('retroItem');
			expect(thoughtItems).toHaveLength(4);
			confirmThoughtsAreInOriginalOrder();
		});
	});

	it('should update header title', async () => {
		userEvent.click(screen.getByTestId('columnHeader-editTitleButton'));
		userEvent.type(
			await screen.findByTestId('column-input'),
			'Something Else{enter}'
		);
		await waitFor(() =>
			expect(ColumnService.updateColumnTitle).toHaveBeenCalledWith(
				'my-team',
				1,
				'Something Else'
			)
		);
	});
});

const getSortButton = () => screen.getByTestId('columnHeader-sortButton');

const confirmThoughtsAreInOriginalOrder = () => {
	const thoughtItems = screen.getAllByTestId('retroItem');
	expect(within(thoughtItems[0]).getByText('1')).toBeDefined();
	expect(within(thoughtItems[1]).getByText('2')).toBeDefined();
	expect(within(thoughtItems[2]).getByText('3')).toBeDefined();
	expect(within(thoughtItems[3]).getByText('4')).toBeDefined();
};

const confirmThoughtsAreInSortedOrder = () => {
	const thoughtItems = screen.getAllByTestId('retroItem');
	expect(thoughtItems).toHaveLength(4);
	expect(within(thoughtItems[0]).getByText('2')).toBeDefined();
	expect(within(thoughtItems[1]).getByText('1')).toBeDefined();
	expect(within(thoughtItems[2]).getByText('4')).toBeDefined();
	expect(within(thoughtItems[3]).getByText('3')).toBeDefined();
};
