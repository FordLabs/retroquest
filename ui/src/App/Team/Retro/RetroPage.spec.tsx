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
import { render, screen, within } from '@testing-library/react';
import { axe } from 'jest-axe';
import { RecoilRoot } from 'recoil';

import { mockColumns } from '../../../Services/Api/__mocks__/ColumnService';
import ActionItemService from '../../../Services/Api/ActionItemService';
import ColumnService from '../../../Services/Api/ColumnService';
import ThoughtService from '../../../Services/Api/ThoughtService';
import { TeamState } from '../../../State/TeamState';

import RetroPage from './RetroPage';

jest.mock('../../../Services/Api/ColumnService');
jest.mock('../../../Services/Api/ThoughtService');
jest.mock('../../../Services/Api/ActionItemService');
jest.mock('../../../Services/Websocket/WebSocketService');

jest.setTimeout(60000);

const mockColumnTitleMessageHandler = jest.fn();
const mockThoughtMessageHandler = jest.fn();
const mockActionItemMessageHandler = jest.fn();
const mockEndRetroMessageHandler = jest.fn();

jest.mock('../../../Hooks/useWebSocketMessageHandler', () => {
	return () => ({
		columnTitleMessageHandler: mockColumnTitleMessageHandler,
		thoughtMessageHandler: mockThoughtMessageHandler,
		actionItemMessageHandler: mockActionItemMessageHandler,
		endRetroMessageHandler: mockEndRetroMessageHandler,
	});
});

describe('RetroPage.spec.tsx', () => {
	let container: HTMLElement;
	const teamId = 'some-team-id';

	beforeEach(() => {
		jest.useRealTimers();
	});

	const setupComponent = async () => {
		({ container } = render(
			<RecoilRoot
				initializeState={({ set }) => {
					set(TeamState, { name: '', id: teamId });
				}}
			>
				<RetroPage />
			</RecoilRoot>
		));

		expect(ColumnService.getColumns).toHaveBeenCalledWith(teamId);
		expect(ActionItemService.get).toHaveBeenCalledWith(teamId, false);
		expect(ThoughtService.getThoughts).toHaveBeenCalledWith(teamId);
	};

	it('should render without axe errors', async () => {
		await setupComponent();
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});

	it('should allow column item animations after 1 second', () => {
		jest.useFakeTimers();
		setupComponent();
		const retroPageContent = screen.getByTestId('retroPageContent');
		expect(retroPageContent.className).toContain('stop-animations');

		jest.advanceTimersByTime(2000);
		expect(retroPageContent.className).not.toContain('stop-animations');
	});

	it('should show all columns and column items returned from backend', async () => {
		await setupComponent();
		for (const column of mockColumns) {
			const retroColumn = await screen.findByTestId(
				`retroColumn__${column.topic}`
			);
			expect(within(retroColumn).getByText(column.title)).toBeDefined();
			expect(within(retroColumn).getAllByTestId(/retroItem$/)).toHaveLength(2);
		}
	});
});
