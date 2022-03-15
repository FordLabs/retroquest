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

import { ActionItemState } from '../State/ActionItemState';
import { ColumnsState } from '../State/ColumnsState';
import { ThoughtsState } from '../State/ThoughtsState';
import Action from '../Types/Action';
import { ColumnTitle } from '../Types/ColumnTitle';
import Thought from '../Types/Thought';

type MessageType = 'put' | 'delete';

interface IncomingMessage {
	type: MessageType;
	payload: unknown;
}

export type WebsocketMessageHandlerType = ({ body }: Partial<IMessage>) => void;

interface WebsocketCallback {
	columnTitleMessageHandler: WebsocketMessageHandlerType;
	thoughtMessageHandler: WebsocketMessageHandlerType;
	actionItemMessageHandler: WebsocketMessageHandlerType;
	endRetroMessageHandler: WebsocketMessageHandlerType;
}

function useWebSocketMessageHandler(): WebsocketCallback {
	const setThoughts = useSetRecoilState(ThoughtsState);
	const setActionItems = useSetRecoilState(ActionItemState);
	const setColumns = useSetRecoilState(ColumnsState);

	const recoilStateUpdater = (
		recoilStateSetter: Function,
		item: Thought | Action,
		messageType: MessageType
	) => {
		recoilStateSetter((currentState: any) => {
			const deleteItem = messageType === 'delete';
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

	const columnTitleMessageHandler = useCallback(
		({ body }: Partial<IMessage>) => {
			const incomingMessage: IncomingMessage = JSON.parse(body || '');
			const columnTitle = incomingMessage.payload as ColumnTitle;
			setColumns((currentState) => {
				const updateItem =
					currentState.findIndex((i) => i.id === columnTitle.id) > -1;
				if (updateItem)
					return currentState.map((column) =>
						column.id === columnTitle.id
							? { ...column, title: columnTitle.title }
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

	return {
		columnTitleMessageHandler,
		thoughtMessageHandler,
		actionItemMessageHandler,
		endRetroMessageHandler,
	};
}

export default useWebSocketMessageHandler;
