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

import { useCallback } from 'react';
import { IMessage } from '@stomp/stompjs';
import { useSetRecoilState } from 'recoil';
import { ActionItemState } from 'State/ActionItemState';
import { ColumnsState } from 'State/ColumnsState';
import { TeamState } from 'State/TeamState';
import { ThoughtsState } from 'State/ThoughtsState';
import Action from 'Types/Action';
import { Column } from 'Types/Column';
import Team from 'Types/Team';
import Thought from 'Types/Thought';

enum MessageType {
	PUT = 'put',
	DELETE = 'delete',
}

interface IncomingMessage {
	type: MessageType;
	payload: unknown;
}

export type WebsocketMessageHandlerType = ({ body }: Partial<IMessage>) => void;

interface WebsocketCallback {
	columnMessageHandler: WebsocketMessageHandlerType;
	thoughtMessageHandler: WebsocketMessageHandlerType;
	actionItemMessageHandler: WebsocketMessageHandlerType;
	endRetroMessageHandler: WebsocketMessageHandlerType;
	teamMessageHandler: WebsocketMessageHandlerType;
}

function useWebSocketMessageHandler(): WebsocketCallback {
	const setThoughts = useSetRecoilState(ThoughtsState);
	const setActionItems = useSetRecoilState(ActionItemState);
	const setColumns = useSetRecoilState(ColumnsState);
	const setTeam = useSetRecoilState(TeamState);

	const recoilStateUpdater = (
		recoilStateSetter: Function,
		item: Thought | Action,
		messageType: MessageType
	) => {
		recoilStateSetter((currentState: any) => {
			const deleteItem = messageType === MessageType.DELETE;
			if (deleteItem)
				return currentState.filter((i: { id: number }) => i.id !== item.id);

			const updateItem =
				currentState.findIndex((i: { id: number }) => i.id === item.id) > -1;
			if (updateItem)
				return currentState.map((i: { id: number }) =>
					i.id === item.id ? item : i
				);

			return [...currentState, item];
		});
	};

	const columnMessageHandler = useCallback(
		({ body }: Partial<IMessage>) => {
			const incomingMessage: IncomingMessage = JSON.parse(body || '');
			const newColumn = incomingMessage.payload as Column;
			setColumns((currentState) => {
				const updateItem =
					currentState.findIndex((i) => i.id === newColumn.id) > -1;
				if (updateItem)
					return currentState.map((column) =>
						column.id === newColumn.id
							? { ...column, title: newColumn.title }
							: column
					);

				return [...currentState];
			});
		},
		[setColumns]
	);

	const thoughtMessageHandler = useCallback(
		({ body }: Partial<IMessage>) => {
			const incomingMessage: IncomingMessage = JSON.parse(body || '');
			const thought = incomingMessage.payload as Thought;

			recoilStateUpdater(setThoughts, thought, incomingMessage.type);
		},
		[setThoughts]
	);

	const actionItemMessageHandler = useCallback(
		({ body }: Partial<IMessage>) => {
			const incomingMessage: IncomingMessage = JSON.parse(body || '');
			const action = incomingMessage.payload as Action;

			recoilStateUpdater(setActionItems, action, incomingMessage.type);
		},
		[setActionItems]
	);

	const endRetroMessageHandler = useCallback(() => {
		setThoughts([]);
		setActionItems((actionItems) =>
			actionItems.filter((actionItem) => !actionItem.completed)
		);
	}, [setActionItems, setThoughts]);

	const teamMessageHandler = useCallback(
		({ body }: Partial<IMessage>) => {
			const incomingMessage: IncomingMessage = JSON.parse(body || '');
			const updatedTeam = incomingMessage.payload as Team;

			console.log('updatedTeam', updatedTeam);

			setTeam({ ...updatedTeam });
		},
		[setTeam]
	);

	return {
		columnMessageHandler,
		thoughtMessageHandler,
		actionItemMessageHandler,
		endRetroMessageHandler,
		teamMessageHandler,
	};
}

export default useWebSocketMessageHandler;
