/*
 * Copyright (c) 2022. Ford Motor Company
 *  All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
import React, { ReactChildren } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { screen, waitFor } from '@testing-library/react';

import { ColumnsState } from '../../State/ColumnsState';
import { TeamState } from '../../State/TeamState';
import { ThoughtsState } from '../../State/ThoughtsState';
import { Column } from '../../Types/Column';
import Thought from '../../Types/Thought';
import Topic from '../../Types/Topic';
import { RecoilObserver } from '../../Utils/RecoilObserver';
import renderWithRecoilRoot from '../../Utils/renderWithRecoilRoot';
import ThoughtService from '../Api/ThoughtService';

import DragAndDrop from './DragAndDrop';

const team = { id: 'team-name', name: 'Team Name' };

const thoughts: Thought[] = [
	{
		id: 12,
		message: `This is a thought`,
		topic: Topic.HAPPY,
		hearts: 2,
		discussed: false,
		columnId: 10,
	},
	{
		id: 13,
		message: `This is a thought`,
		topic: Topic.UNHAPPY,
		hearts: 2,
		discussed: false,
		columnId: 11,
	},
];

const columns: Column[] = [
	{ id: 1, title: 'Happy', topic: Topic.HAPPY },
	{ id: 2, title: 'Unhappy', topic: Topic.UNHAPPY },
];

jest.mock('../Api/ThoughtService');
jest.mock('react-beautiful-dnd', () => ({
	DragDropContext: ({
		children,
		onDragEnd,
	}: {
		children: ReactChildren;
		onDragEnd: (result: any) => void;
	}) => {
		const dropResult: DropResult = {
			mode: 'SNAP',
			reason: 'DROP',
			source: {
				droppableId: '1', // column 1 id
				index: 1,
			},
			type: '',
			draggableId: '12', // thought 1 id
			destination: {
				droppableId: '2', // column 2 id
				index: 2,
			},
		};

		return (
			<>
				<button onClick={() => onDragEnd(dropResult)}>trigger-onDragEnd</button>
				{children}
			</>
		);
	},
}));

describe('Drag and Drop', () => {
	describe('onDragEnd', () => {
		let updatedThoughtsState: Thought[];
		const thoughtToMove = thoughts[0];
		const thoughtNotToMove = thoughts[1];
		const columnThoughtWasOriginallyIn = columns[0];
		const columnToMoveThoughtTo = columns[1];

		beforeEach(() => {
			updatedThoughtsState = [...thoughts];

			renderWithRecoilRoot(
				<>
					<RecoilObserver
						recoilState={ThoughtsState}
						onChange={(value: Thought[]) => {
							updatedThoughtsState = value;
						}}
					/>
					<DragAndDrop>children</DragAndDrop>
				</>,
				({ set }) => {
					set(TeamState, team);
					set(ColumnsState, columns);
					set(ThoughtsState, thoughts);
				}
			);
		});

		it('should move thought to new column in global state then update database', async () => {
			expect(thoughtToMove.topic).toBe(columnThoughtWasOriginallyIn.topic);

			screen.getByText('trigger-onDragEnd').click();

			await waitFor(() =>
				expect(ThoughtService.updateColumn).toHaveBeenCalledWith(
					team.id,
					thoughtToMove.id,
					columnToMoveThoughtTo.id
				)
			);

			expect(updatedThoughtsState).toEqual([
				{ ...thoughtToMove, topic: columnToMoveThoughtTo.topic },
				thoughtNotToMove,
			]);
		});

		it('should move thought back to original spot in global state if database update failed', async () => {
			ThoughtService.updateColumn = jest.fn().mockRejectedValue('');
			screen.getByText('trigger-onDragEnd').click();

			await waitFor(() =>
				expect(ThoughtService.updateColumn).toHaveBeenCalledWith(
					team.id,
					thoughtToMove.id,
					columnToMoveThoughtTo.id
				)
			);

			expect(updatedThoughtsState).toEqual([
				{ ...thoughtToMove, topic: columnThoughtWasOriginallyIn.topic },
				thoughtNotToMove,
			]);
		});
	});
});
