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

export type WebsocketMessageHandlerType = ({ body }: IMessage) => void;

interface WebsocketCallback {
  thoughtMessageHandler: WebsocketMessageHandlerType;
  actionItemMessageHandler: WebsocketMessageHandlerType;
}

function useWebSocketMessageHandler(): WebsocketCallback {
  const setThoughts = useSetRecoilState(ThoughtsState);
  const setActionItems = useSetRecoilState(ActionItemState);

  const thoughtMessageHandler = ({ body }: IMessage) => {
    const incomingMessage: IncomingMessage = JSON.parse(body);
    const thought = incomingMessage.payload as Thought;

    switch (incomingMessage.type) {
      case 'put': {
        setThoughts((currentState) => [...currentState, thought]);
        break;
      }
      case 'delete': {
        setThoughts((currentState) => currentState.filter((t) => t.id !== thought.id));
      }
    }
  };

  const actionItemMessageHandler = ({ body }: IMessage) => {
    const incomingMessage: IncomingMessage = JSON.parse(body);
    const action = incomingMessage.payload as Action;

    switch (incomingMessage.type) {
      case 'put': {
        setActionItems((currentState) => [...currentState, action]);
        break;
      }
    }
  };

  return { thoughtMessageHandler, actionItemMessageHandler };
}

export default useWebSocketMessageHandler;
