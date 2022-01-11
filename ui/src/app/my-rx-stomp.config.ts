/*
 * Copyright (c) 2021 Ford Motor Company
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

import { InjectableRxStompConfig } from '@stomp/ng2-stompjs';

import { AuthService } from './modules/auth/auth.service';

function getBrokerUrl(): string {
  const protocol = location.protocol === 'http:' ? 'ws://' : 'wss://';
  return protocol + location.host + '/websocket/websocket';
}

export const myRxStompConfig: InjectableRxStompConfig = {
  // Which server?
  brokerURL: getBrokerUrl(),

  // Headers
  // Typical keys: login, passcode, host
  connectHeaders: {
    Authorization: AuthService.getToken(),
  },

  // How often to heartbeat?
  // Interval in milliseconds, set to 0 to disable
  heartbeatIncoming: 0, // Typical value 0 - disabled
  heartbeatOutgoing: 20000, // Typical value 20000 - every 20 seconds

  // Wait in milliseconds before attempting auto reconnect
  // Set to 0 to disable
  // Typical value 500 (500 milli seconds)
  reconnectDelay: 200,

  // Will log diagnostics on console
  // It can be quite verbose, not recommended in production
  // Skip this key to stop logging to console
  debug: (): void => {},
};
