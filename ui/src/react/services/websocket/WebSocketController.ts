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

import { Client } from '@stomp/stompjs';

import CookieService from '../CookieService';

const url = window.location.hostname.includes('localhost')
  ? 'ws://localhost:8080/websocket/websocket'
  : 'wss://' + window.location.hostname + '/websocket/websocket';

const getClient = () =>
  new Client({
    brokerURL: url,
    connectHeaders: {
      Authorization: `Bearer ` + CookieService.getToken(),
    },
    reconnectDelay: 3000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

const WebSocketController = {
  getClient,
};

export default WebSocketController;
