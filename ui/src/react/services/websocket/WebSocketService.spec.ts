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
import { waitFor } from '@testing-library/react';

import CookieService from '../CookieService';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { mockClient } from './WebSocketController';
import WebSocketService from './WebSocketService';

jest.mock('./WebSocketController');

describe('WebSocketService', () => {
  const mockAccessToken = 'access-token-12345';

  beforeEach(() => {
    mockClient.deactivate = jest.fn().mockResolvedValue({});
    CookieService.setToken(mockAccessToken);
  });

  it('should activate websocket connection', async () => {
    WebSocketService.connect(() => undefined);
    expect(mockClient.activate).toHaveBeenCalled();
  });

  it('should deactivate websocket connection', async () => {
    console.log = jest.fn();
    WebSocketService.disconnect();
    expect(mockClient.deactivate).toHaveBeenCalled();
    await waitFor(() => expect(console.log).toHaveBeenCalledWith('Deactivation successful!'));
  });

  it('should subscribe to thoughts', async () => {
    const teamId = 'Idddddd';
    const webSocketMessageHandler = jest.fn();
    WebSocketService.subscribeToThoughts(teamId, webSocketMessageHandler);

    const expectedDestination = `/topic/${teamId}/thoughts`;
    expect(mockClient.subscribe).toHaveBeenCalledWith(expectedDestination, expect.any(Function), {
      Authorization: `Bearer ` + mockAccessToken,
    });
  });

  it('should subscribe to action items', async () => {
    const teamId = 'Idddddd';
    const webSocketMessageHandler = jest.fn();
    WebSocketService.subscribeToActionItems(teamId, webSocketMessageHandler);

    const expectedDestination = `/topic/${teamId}/action-items`;
    expect(mockClient.subscribe).toHaveBeenCalledWith(expectedDestination, expect.any(Function), {
      Authorization: `Bearer ` + mockAccessToken,
    });
  });

  it('should subscribe to end retro', async () => {
    const teamId = 'Idddddd';
    const webSocketMessageHandler = jest.fn();
    WebSocketService.subscribeToEndRetro(teamId, webSocketMessageHandler);

    const expectedDestination = `/topic/${teamId}/end-retro`;
    expect(mockClient.subscribe).toHaveBeenCalledWith(expectedDestination, expect.any(Function), {
      Authorization: `Bearer ` + mockAccessToken,
    });
  });
});
