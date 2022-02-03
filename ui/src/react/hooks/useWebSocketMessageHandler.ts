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

import { IMessage } from '@stomp/stompjs';
import { useSetRecoilState } from 'recoil';

import { ActionItemState } from '../state/ActionItemState';
import { ThoughtsState } from '../state/ThoughtsState';
import Action from '../types/Action';
import Thought from '../types/Thought';

type MessageType = 'put' | 'delete';

interface IncomingMessage {
  type: MessageType;
  payload: unknown;
}

export type WebsocketMessageHandlerType = ({ body }: Partial<IMessage>) => void;

interface WebsocketCallback {
  thoughtMessageHandler: WebsocketMessageHandlerType;
  actionItemMessageHandler: WebsocketMessageHandlerType;
}

function useWebSocketMessageHandler(): WebsocketCallback {
  const setThoughts = useSetRecoilState(ThoughtsState);
  const setActionItems = useSetRecoilState(ActionItemState);

  const recoilStateUpdater = (recoilStateSetter: Function, item: Thought | Action, messageType: MessageType) => {
    recoilStateSetter((currentState) => {
      const deleteItem = messageType === 'delete';
      if (deleteItem) return currentState.filter((i) => i.id !== item.id);

      const updateItem = currentState.findIndex((i) => i.id === item.id) > -1;
      if (updateItem) return currentState.map((i) => (i.id === item.id ? item : i));

      return [...currentState, item];
    });
  };

  const thoughtMessageHandler = ({ body }: Partial<IMessage>) => {
    const incomingMessage: IncomingMessage = JSON.parse(body);
    const thought = incomingMessage.payload as Thought;

    recoilStateUpdater(setThoughts, thought, incomingMessage.type);
  };

  const actionItemMessageHandler = ({ body }: Partial<IMessage>) => {
    const incomingMessage: IncomingMessage = JSON.parse(body);
    const action = incomingMessage.payload as Action;

    recoilStateUpdater(setActionItems, action, incomingMessage.type);
  };

  return { thoughtMessageHandler, actionItemMessageHandler };
}

export default useWebSocketMessageHandler;
