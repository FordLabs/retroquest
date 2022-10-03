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
import { screen } from '@testing-library/react';
import { useRecoilValue } from 'recoil';
import { getMockActionItem } from 'Services/Api/__mocks__/ActionItemService';
import { getMockThought } from 'Services/Api/__mocks__/ThoughtService';
import { ActionItemState } from 'State/ActionItemState';
import { ColumnsState } from 'State/ColumnsState';
import { TeamState } from 'State/TeamState';
import { ThoughtsState } from 'State/ThoughtsState';
import { Column } from 'Types/Column';
import Team from 'Types/Team';
import Topic from 'Types/Topic';
import renderWithRecoilRoot from 'Utils/renderWithRecoilRoot';

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
			const newThought = getMockThought(1, false);

			renderWithRecoilRoot(
				<ThoughtsTestComponent
					websocketMessageBody={{
						type: 'put',
						payload: newThought,
					}}
				/>,
				({ set }) => {
					set(ThoughtsState, []);
				}
			);

			expect(screen.getByText(JSON.stringify([newThought]))).toBeDefined();
		});

		it('should update a thought in the global thoughts state', async () => {
			const originalThought = getMockThought(2, false);
			const updatedThought = originalThought;
			updatedThought.discussed = true;
			updatedThought.hearts = 2;

			renderWithRecoilRoot(
				<ThoughtsTestComponent
					websocketMessageBody={{
						type: 'put',
						payload: updatedThought,
					}}
				/>,
				({ set }) => {
					set(ThoughtsState, [originalThought]);
				}
			);

			expect(screen.getByText(JSON.stringify([updatedThought]))).toBeDefined();
		});

		it('should delete a thought from the global thoughts state', async () => {
			const thoughtNotToDelete = getMockThought(1, true);
			const thoughtToDelete = getMockThought(2, false);

			renderWithRecoilRoot(
				<ThoughtsTestComponent
					websocketMessageBody={{
						type: 'delete',
						payload: thoughtToDelete,
					}}
				/>,
				({ set }) => {
					set(ThoughtsState, [thoughtToDelete, thoughtNotToDelete]);
				}
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

			renderWithRecoilRoot(
				<ActionItemsTestComponent
					websocketMessageBody={{
						type: 'put',
						payload: newActionItem,
					}}
				/>,
				({ set }) => {
					set(ActionItemState, []);
				}
			);

			expect(screen.getByText(JSON.stringify([newActionItem]))).toBeDefined();
		});

		it('should update an action item in the global action items state', async () => {
			const originalActionItem = getMockActionItem(false);
			const updatedActionItem = originalActionItem;
			updatedActionItem.completed = true;
			updatedActionItem.task = 'I changed this action.. the last one sucked.';

			renderWithRecoilRoot(
				<ActionItemsTestComponent
					websocketMessageBody={{
						type: 'put',
						payload: updatedActionItem,
					}}
				/>,
				({ set }) => {
					set(ActionItemState, [originalActionItem]);
				}
			);

			expect(
				screen.getByText(JSON.stringify([updatedActionItem]))
			).toBeDefined();
		});

		it('should delete an action item from the global action items state', async () => {
			const actionItemNotToDelete = getMockActionItem(true);
			const actionItemToDelete = getMockActionItem(false);

			renderWithRecoilRoot(
				<ActionItemsTestComponent
					websocketMessageBody={{
						type: 'delete',
						payload: actionItemToDelete,
					}}
				/>,
				({ set }) => {
					set(ActionItemState, [actionItemToDelete, actionItemNotToDelete]);
				}
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
				getMockThought(1),
				getMockThought(2),
				getMockThought(3),
			];
			renderWithRecoilRoot(
				<EndRetroTestComponent
					websocketMessageBody={{
						type: 'put',
						payload: null,
					}}
				/>,
				({ set }) => {
					set(ActionItemState, actionItems);
					set(ThoughtsState, thoughts);
				}
			);

			const thoughtsColumn = screen.getByTestId('thoughts');
			expect(thoughtsColumn.innerHTML).toBe(JSON.stringify([]));

			const actionItemsColumn = screen.getByTestId('action-items');
			expect(actionItemsColumn.innerHTML).toBe(
				JSON.stringify([activeActionItem])
			);
		});
	});

	describe('columnMessageHandler', () => {
		const ColumnTestComponent = ({
			websocketMessageBody,
		}: TestComponentProps): ReactElement => {
			const columns = useRecoilValue(ColumnsState);

			const { columnMessageHandler } = useWebSocketMessageHandler();

			useEffect(() => {
				const imessage = formatWebsocketMessage(websocketMessageBody);
				columnMessageHandler(imessage);
			}, [columnMessageHandler, websocketMessageBody]);

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

			renderWithRecoilRoot(
				<ColumnTestComponent
					websocketMessageBody={{
						type: 'put',
						payload: {
							id: 2,
							topic: Topic.CONFUSED,
							title: 'Updated Confused',
						},
					}}
				/>,
				({ set }) => {
					set(ColumnsState, [...expectedColumns]);
				}
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

	describe('teamMessageHandler', () => {
		const TeamTestComponent = ({
			websocketMessageBody,
		}: TestComponentProps): ReactElement => {
			const team = useRecoilValue(TeamState);

			const { teamMessageHandler } = useWebSocketMessageHandler();

			useEffect(() => {
				const imessage = formatWebsocketMessage(websocketMessageBody);
				teamMessageHandler(imessage);
			}, [teamMessageHandler, websocketMessageBody]);

			return <div data-testid="team">{JSON.stringify(team)}</div>;
		};

		it('should update team with the latest team data', async () => {
			const initialTeam: Team = {
				id: '123',
				name: 'Test Team Name',
				email: 'a@b.c',
				secondaryEmail: 'b@c.d',
			};
			const expectedTeam: Team = {
				...initialTeam,
				email: 'changed@it.com',
				secondaryEmail: 'something@else.com',
			};

			renderWithRecoilRoot(
				<TeamTestComponent
					websocketMessageBody={{
						type: 'put',
						payload: expectedTeam,
					}}
				/>,
				({ set }) => {
					set(TeamState, { ...initialTeam });
				}
			);

			await screen.findByText(JSON.stringify(expectedTeam));
		});
	});
});
