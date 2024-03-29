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
import { screen, within } from '@testing-library/react';
import { UseWebsocketHandlerResponse } from 'Hooks/useWebSocketMessageHandler';
import { mockColumns } from 'Services/Api/__mocks__/ColumnService';
import { mockTeam } from 'Services/Api/__mocks__/TeamService';
import ActionItemService from 'Services/Api/ActionItemService';
import ColumnService from 'Services/Api/ColumnService';
import ThoughtService from 'Services/Api/ThoughtService';
import { TeamState } from 'State/TeamState';
import renderWithRecoilRoot from 'Utils/renderWithRecoilRoot';

import RetroPage from './RetroPage';

jest.mock('Hooks/useAuth', () => {
	return jest.fn(() => ({
		logout: jest.fn(),
	}));
});
jest.mock('Services/Api/ColumnService');
jest.mock('Services/Api/ThoughtService');
jest.mock('Services/Api/ActionItemService');
jest.mock('Services/Websocket/WebSocketService');
jest.mock('Services/Websocket/WebSocketController');

jest.setTimeout(60000);

jest.mock('Hooks/useWebSocketMessageHandler', () => {
	return (): UseWebsocketHandlerResponse => ({
		columnMessageHandler: jest.fn(),
		thoughtMessageHandler: jest.fn(),
		actionItemMessageHandler: jest.fn(),
		endRetroMessageHandler: jest.fn(),
		teamMessageHandler: jest.fn(),
	});
});

describe('RetroPage.spec.tsx', () => {
	beforeEach(() => {
		jest.useRealTimers();
	});

	const setupComponent = async () => {
		renderWithRecoilRoot(<RetroPage />, ({ set }) => {
			set(TeamState, mockTeam);
		});

		await screen.findByTestId('retroColumn__happy');
	};

	it('should allow column item animations after 1 second', async () => {
		jest.useFakeTimers();
		await setupComponent();
		const retroPageContent = screen.getByTestId('retroPageContent');
		expect(retroPageContent.className).toContain('stop-animations');

		jest.advanceTimersByTime(2000);
		expect(retroPageContent.className).not.toContain('stop-animations');
	});

	it('should show all columns and column items returned from backend', async () => {
		await setupComponent();

		expect(ColumnService.getColumns).toHaveBeenCalledWith(mockTeam.id);
		expect(ActionItemService.get).toHaveBeenCalledWith(mockTeam.id, false);
		expect(ThoughtService.getThoughts).toHaveBeenCalledWith(mockTeam.id);

		for (const column of mockColumns) {
			const retroColumn = await screen.findByTestId(
				`retroColumn__${column.topic}`
			);
			expect(within(retroColumn).getByText(column.title)).toBeDefined();
			expect(within(retroColumn).getAllByTestId(/retroItem$/)).toHaveLength(2);
		}
	});
});
