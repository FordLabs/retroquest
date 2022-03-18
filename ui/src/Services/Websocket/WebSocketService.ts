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

import { WebsocketMessageHandlerType } from '../../Hooks/useWebSocketMessageHandler';
import CookieService from '../CookieService';

class WebSocketService {
	constructor(private client: Client) {}

	connect(onConnect: () => void): void {
		this.client.onConnect = () => {
			onConnect();
		};
		this.client.activate();
	}

	disconnect(): void {
		this.client.deactivate().catch();
	}

	subscribe(
		destination: string,
		webSocketMessageHandler: WebsocketMessageHandlerType
	): void {
		const token = CookieService.getToken();
		this.client.subscribe(
			destination,
			(event) => {
				webSocketMessageHandler(event);
			},
			{
				Authorization: `Bearer ` + token,
			}
		);
	}

	subscribeToColumnTitle(
		teamId: string,
		webSocketMessageHandler: WebsocketMessageHandlerType
	): void {
		const destination = `/topic/${teamId}/column-titles`;
		this.subscribe(destination, webSocketMessageHandler);
	}

	subscribeToThoughts(
		teamId: string,
		webSocketMessageHandler: WebsocketMessageHandlerType
	): void {
		const destination = `/topic/${teamId}/thoughts`;
		this.subscribe(destination, webSocketMessageHandler);
	}

	subscribeToActionItems(
		teamId: string,
		webSocketMessageHandler: WebsocketMessageHandlerType
	): void {
		const destination = `/topic/${teamId}/action-items`;
		this.subscribe(destination, webSocketMessageHandler);
	}

	subscribeToEndRetro(
		teamId: string,
		webSocketMessageHandler: WebsocketMessageHandlerType
	) {
		const destination = `/topic/${teamId}/end-retro`;
		this.subscribe(destination, webSocketMessageHandler);
	}
}

export default WebSocketService;
