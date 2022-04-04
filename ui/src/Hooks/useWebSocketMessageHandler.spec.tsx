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

import React, { ReactElement, useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { RecoilRoot, useRecoilValue } from 'recoil';

import { getMockActionItem } from '../Services/Api/__mocks__/ActionItemService';
import { getMockThought } from '../Services/Api/__mocks__/ThoughtService';
import { ActionItemState } from '../State/ActionItemState';
import { ColumnsState } from '../State/ColumnsState';
import { ThoughtsState } from '../State/ThoughtsState';
import { Column } from '../Types/Column';
import Topic from '../Types/Topic';

import useWebSocketMessageHandler from './useWebSocketMessageHandler';

type WebsocketMessageBody = { type: string; payload: unknown };

interface TestComponentProps {
	websocketMessageBody: WebsocketMessageBody;
}

const formatWebsocketMessage = (body: WebsocketMessageBody) => ({
	body: JSON.stringify(body),
});

describe('useWebsocketMessageHandler Hook', () => {
	describe('thoughtMessageHandler', () => {
		const ThoughtsTestComponent = ({
			websocketMessageBody,
		}: TestComponentProps): ReactElement => {
			const thoughts = useRecoilValue(ThoughtsState);
			const { thoughtMessageHandler } = useWebSocketMessageHandler();

			useEffect(() => {
				const imessage = formatWebsocketMessage(websocketMessageBody);
				thoughtMessageHandler(imessage);
			}, [thoughtMessageHandler, websocketMessageBody]);

			return <div data-testid="thoughts">{JSON.stringify(thoughts)}</div>;
		};

		it('should add a thought to the global thoughts state', async () => {
			const newThought = getMockThought(Topic.HAPPY, 1, false);

			render(
				<RecoilRoot
					initializeState={({ set }) => {
						set(ThoughtsState, []);
					}}
				>
					<ThoughtsTestComponent
						websocketMessageBody={{
							type: 'put',
							payload: newThought,
						}}
					/>
				</RecoilRoot>
			);

			expect(screen.getByText(JSON.stringify([newThought]))).toBeDefined();
		});

		it('should update a thought in the global thoughts state', async () => {
			const originalThought = getMockThought(Topic.CONFUSED, 2, false);
			const updatedThought = originalThought;
			updatedThought.discussed = true;
			updatedThought.hearts = 2;

			render(
				<RecoilRoot
					initializeState={({ set }) => {
						set(ThoughtsState, [originalThought]);
					}}
				>
					<ThoughtsTestComponent
						websocketMessageBody={{
							type: 'put',
							payload: updatedThought,
						}}
					/>
				</RecoilRoot>
			);

			expect(screen.getByText(JSON.stringify([updatedThought]))).toBeDefined();
		});

		it('should delete a thought from the global thoughts state', async () => {
			const thoughtNotToDelete = getMockThought(Topic.HAPPY, 1, true);
			const thoughtToDelete = getMockThought(Topic.CONFUSED, 2, false);

			render(
				<RecoilRoot
					initializeState={({ set }) => {
						set(ThoughtsState, [thoughtToDelete, thoughtNotToDelete]);
					}}
				>
					<ThoughtsTestComponent
						websocketMessageBody={{
							type: 'delete',
							payload: thoughtToDelete,
						}}
					/>
				</RecoilRoot>
			);

			expect(
				screen.getByText(JSON.stringify([thoughtNotToDelete]))
			).toBeDefined();
		});
	});

	describe('actionItemMessageHandler', () => {
		const ActionItemsTestComponent = ({
			websocketMessageBody,
		}: TestComponentProps): ReactElement => {
			const actionItems = useRecoilValue(ActionItemState);

			const { actionItemMessageHandler } = useWebSocketMessageHandler();

			useEffect(() => {
				const imessage = formatWebsocketMessage(websocketMessageBody);
				actionItemMessageHandler(imessage);
			}, [actionItemMessageHandler, websocketMessageBody]);

			return (
				<div data-testid="action-items">{JSON.stringify(actionItems)}</div>
			);
		};

		it('should add an action item to the global action items state', async () => {
			const newActionItem = getMockActionItem();

			render(
				<RecoilRoot
					initializeState={({ set }) => {
						set(ActionItemState, []);
					}}
				>
					<ActionItemsTestComponent
						websocketMessageBody={{
							type: 'put',
							payload: newActionItem,
						}}
					/>
				</RecoilRoot>
			);

			expect(screen.getByText(JSON.stringify([newActionItem]))).toBeDefined();
		});

		it('should update an action item in the global action items state', async () => {
			const originalActionItem = getMockActionItem(false);
			const updatedActionItem = originalActionItem;
			updatedActionItem.completed = true;
			updatedActionItem.task = 'I changed this action.. the last one sucked.';

			render(
				<RecoilRoot
					initializeState={({ set }) => {
						set(ActionItemState, [originalActionItem]);
					}}
				>
					<ActionItemsTestComponent
						websocketMessageBody={{
							type: 'put',
							payload: updatedActionItem,
						}}
					/>
				</RecoilRoot>
			);

			expect(
				screen.getByText(JSON.stringify([updatedActionItem]))
			).toBeDefined();
		});

		it('should delete an action item from the global action items state', async () => {
			const actionItemNotToDelete = getMockActionItem(true);
			const actionItemToDelete = getMockActionItem(false);

			render(
				<RecoilRoot
					initializeState={({ set }) => {
						set(ActionItemState, [actionItemToDelete, actionItemNotToDelete]);
					}}
				>
					<ActionItemsTestComponent
						websocketMessageBody={{
							type: 'delete',
							payload: actionItemToDelete,
						}}
					/>
				</RecoilRoot>
			);

			expect(
				screen.getByText(JSON.stringify([actionItemNotToDelete]))
			).toBeDefined();
		});
	});

	describe('endRetroMessageHandler', () => {
		const EndRetroTestComponent = ({
			websocketMessageBody,
		}: TestComponentProps): ReactElement => {
			const actionItems = useRecoilValue(ActionItemState);
			const thoughts = useRecoilValue(ThoughtsState);

			const { endRetroMessageHandler } = useWebSocketMessageHandler();

			useEffect(() => {
				const imessage = formatWebsocketMessage(websocketMessageBody);
				endRetroMessageHandler(imessage);
			}, [endRetroMessageHandler, websocketMessageBody]);

			return (
				<>
					<div data-testid="action-items">{JSON.stringify(actionItems)}</div>
					<div data-testid="thoughts">{JSON.stringify(thoughts)}</div>
				</>
			);
		};

		it('should clear all thoughts and all completed action items from state', async () => {
			const activeActionItem = getMockActionItem();
			const completeActionItem = getMockActionItem(true);
			const actionItems = [activeActionItem, completeActionItem];
			const thoughts = [
				getMockThought(Topic.HAPPY, 1),
				getMockThought(Topic.CONFUSED, 2),
				getMockThought(Topic.UNHAPPY, 3),
			];
			render(
				<RecoilRoot
					initializeState={({ set }) => {
						set(ActionItemState, actionItems);
						set(ThoughtsState, thoughts);
					}}
				>
					<EndRetroTestComponent
						websocketMessageBody={{
							type: 'put',
							payload: null,
						}}
					/>
				</RecoilRoot>
			);

			const thoughtsColumn = screen.getByTestId('thoughts');
			expect(thoughtsColumn.innerHTML).toBe(JSON.stringify([]));

			const actionItemsColumn = screen.getByTestId('action-items');
			expect(actionItemsColumn.innerHTML).toBe(
				JSON.stringify([activeActionItem])
			);
		});
	});

	describe('columnTitleMessageHandler', () => {
		const ColumnTestComponent = ({
			websocketMessageBody,
		}: TestComponentProps): ReactElement => {
			const columns = useRecoilValue(ColumnsState);

			const { columnTitleMessageHandler } = useWebSocketMessageHandler();

			useEffect(() => {
				const imessage = formatWebsocketMessage(websocketMessageBody);
				columnTitleMessageHandler(imessage);
			}, [columnTitleMessageHandler, websocketMessageBody]);

			return <div data-testid="columns">{JSON.stringify(columns)}</div>;
		};

		it('should replace the column title in the column state', async () => {
			const expectedColumns: Column[] = [
				{
					id: 1,
					title: 'Happy',
					topic: Topic.HAPPY,
				},
				{
					id: 2,
					title: 'Confused',
					topic: Topic.CONFUSED,
				},
				{
					id: 3,
					title: 'Sad',
					topic: Topic.UNHAPPY,
				},
			];

			render(
				<RecoilRoot
					initializeState={({ set }) => {
						set(ColumnsState, [...expectedColumns]);
					}}
				>
					<ColumnTestComponent
						websocketMessageBody={{
							type: 'put',
							payload: {
								id: 2,
								topic: Topic.CONFUSED,
								title: 'Updated Confused',
							},
						}}
					/>
				</RecoilRoot>
			);

			await screen.findByText(
				JSON.stringify([
					expectedColumns[0],
					{ ...expectedColumns[1], title: 'Updated Confused' },
					expectedColumns[2],
				])
			);
		});
	});
});
