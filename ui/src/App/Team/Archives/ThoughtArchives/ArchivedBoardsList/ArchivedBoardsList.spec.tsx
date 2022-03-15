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

import * as React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

import BoardService from '../../../../../Services/Api/BoardService';
import { TeamState } from '../../../../../State/TeamState';

import ArchivedBoardsList from './ArchivedBoardsList';

jest.mock('../../../../../Services/Api/BoardService');

describe('Archived Boards List', () => {
	it('should display a list of completed retros', async () => {
		await setUpThoughtArchives();
		screen.getByText('October 1st, 1982');
		screen.getByText('April 22nd, 1998');
	});

	it('should be sorted by date descending by default', async () => {
		await setUpThoughtArchives();
		const tiles = screen.getAllByTestId('boardArchive');
		expect(within(tiles[0]).queryByText('April 22nd, 1998')).not.toBeNull();
		expect(within(tiles[1]).queryByText('October 1st, 1982')).not.toBeNull();
	});

	it('should be sorted by date ascending when Date clicked', async () => {
		await setUpThoughtArchives();
		fireEvent.click(screen.getByText('Date'));
		const tiles = screen.getAllByTestId('boardArchive');
		expect(within(tiles[0]).queryByText('October 1st, 1982')).not.toBeNull();
		expect(within(tiles[1]).queryByText('April 22nd, 1998')).not.toBeNull();
	});

	it('should be sorted by date descending when Date clicked and already sorted by ascending', async () => {
		await setUpThoughtArchives();
		fireEvent.click(screen.getByText('Date'));
		fireEvent.click(screen.getByText('Date'));
		const tiles = screen.getAllByTestId('boardArchive');
		expect(within(tiles[0]).queryByText('April 22nd, 1998')).not.toBeNull();
		expect(within(tiles[1]).queryByText('October 1st, 1982')).not.toBeNull();
	});

	it('should be sorted by thought count descending when # clicked', async () => {
		await setUpThoughtArchives();
		fireEvent.click(screen.getByText('#'));
		const tiles = screen.getAllByTestId('boardArchive');
		expect(within(tiles[0]).queryByText('1')).not.toBeNull();
		expect(within(tiles[1]).queryByText('0')).not.toBeNull();
	});

	it('should be sorted by thought count ascending when # clicked and already sorted by descending', async () => {
		await setUpThoughtArchives();
		fireEvent.click(screen.getByText('#'));
		fireEvent.click(screen.getByText('#'));
		const tiles = screen.getAllByTestId('boardArchive');
		expect(within(tiles[0]).queryByText('0')).not.toBeNull();
		expect(within(tiles[1]).queryByText('1')).not.toBeNull();
	});

	it('should show "No Archives" message when no archived thoughts are present', async () => {
		BoardService.getBoards = jest.fn().mockResolvedValue([]);

		render(
			<RecoilRoot>
				<ArchivedBoardsList onBoardSelection={jest.fn()} />
			</RecoilRoot>
		);

		screen.getByText('No archives were found.');
		const description = screen.getByTestId('notFoundSectionDescription');
		expect(description.innerHTML).toBe(
			'Boards will appear when retros are ended with <span class="bold">thoughts</span>.'
		);
	});
});

const setUpThoughtArchives = async () => {
	render(
		<RecoilRoot
			initializeState={({ set }) => {
				set(TeamState, { id: 'teamId', name: '' });
			}}
		>
			<ArchivedBoardsList onBoardSelection={jest.fn()} />
		</RecoilRoot>
	);
};
