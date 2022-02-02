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

import { ThoughtsState } from '../state/ThoughtsState';
import Thought from '../types/Thought';

export type WebsocketMessageHandlerType = ({ body }: IMessage) => void;

type MessageType = 'put' | 'delete';

interface IncomingMessage {
  type: MessageType;
  payload: unknown;
}

interface WebsocketCallback {
  thoughtMessageHandler: WebsocketMessageHandlerType;
}

function useWebSocketMessageHandler(): WebsocketCallback {
  const setThoughts = useSetRecoilState(ThoughtsState);

  const thoughtMessageHandler = ({ body }: IMessage) => {
    const incomingMessage: IncomingMessage = JSON.parse(body);
    const thought: Thought = incomingMessage.payload as Thought;

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

  return { thoughtMessageHandler };
}

export default useWebSocketMessageHandler;
