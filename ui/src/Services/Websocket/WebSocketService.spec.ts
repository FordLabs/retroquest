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
import { mockGetCookie } from '../../__mocks__/universal-cookie';

import WebSocketController from './WebSocketController';
import WebSocketService from './WebSocketService';

jest.mock('./WebSocketController');

describe('webSocketService', () => {
	const mockAccessToken = 'access-token-12345';
	const mockClient = WebSocketController.getClient();
	let webSocketService: WebSocketService;

	beforeEach(() => {
		mockGetCookie.mockReturnValue(mockAccessToken);
		webSocketService = new WebSocketService(mockClient);
	});

	it('should activate websocket connection', async () => {
		webSocketService.connect(() => undefined);
		expect(mockClient.activate).toHaveBeenCalled();
	});

	it('should deactivate websocket connection', async () => {
		webSocketService.disconnect();
		expect(mockClient.deactivate).toHaveBeenCalled();
	});

	it('should subscribe to column title', async () => {
		const teamId = 'Idddddd';
		const webSocketMessageHandler = jest.fn();
		webSocketService.subscribeToColumnTitle(teamId, webSocketMessageHandler);

		const expectedDestination = `/topic/${teamId}/column-titles`;
		expect(mockClient.subscribe).toHaveBeenCalledWith(
			expectedDestination,
			expect.any(Function),
			{
				Authorization: `Bearer ` + mockAccessToken,
			}
		);
	});

	it('should subscribe to thoughts', async () => {
		const teamId = 'Idddddd';
		const webSocketMessageHandler = jest.fn();
		webSocketService.subscribeToThoughts(teamId, webSocketMessageHandler);

		const expectedDestination = `/topic/${teamId}/thoughts`;
		expect(mockClient.subscribe).toHaveBeenCalledWith(
			expectedDestination,
			expect.any(Function),
			{
				Authorization: `Bearer ` + mockAccessToken,
			}
		);
	});

	it('should subscribe to action items', async () => {
		const teamId = 'Idddddd';
		const webSocketMessageHandler = jest.fn();
		webSocketService.subscribeToActionItems(teamId, webSocketMessageHandler);

		const expectedDestination = `/topic/${teamId}/action-items`;
		expect(mockClient.subscribe).toHaveBeenCalledWith(
			expectedDestination,
			expect.any(Function),
			{
				Authorization: `Bearer ` + mockAccessToken,
			}
		);
	});

	it('should subscribe to end retro', async () => {
		const teamId = 'Idddddd';
		const webSocketMessageHandler = jest.fn();
		webSocketService.subscribeToEndRetro(teamId, webSocketMessageHandler);

		const expectedDestination = `/topic/${teamId}/end-retro`;
		expect(mockClient.subscribe).toHaveBeenCalledWith(
			expectedDestination,
			expect.any(Function),
			{
				Authorization: `Bearer ` + mockAccessToken,
			}
		);
	});
});
