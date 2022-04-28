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

import React from 'react';
import {
	fireEvent,
	render,
	screen,
	waitFor,
	within,
} from '@testing-library/react';
import { RecoilRoot } from 'recoil';

import {
	mockBoard1,
	mockBoard2,
	SortOrder,
} from '../../../../../Services/Api/__mocks__/BoardService';
import BoardService, {
	GetBoardsResponse,
} from '../../../../../Services/Api/BoardService';
import { TeamState } from '../../../../../State/TeamState';
import Board from '../../../../../Types/Board';
import renderWithRecoilRoot from '../../../../../Utils/renderWithRecoilRoot';

import ArchivedBoardsList from './ArchivedBoardsList';

jest.mock('../../../../../Services/Api/BoardService');

const PAGE_SIZE = 30;
const PAGE_INDEX = 0;

describe('Archived Boards List', () => {
	const oldestDate = 'October 1st, 1982';
	const newestDate = 'April 22nd, 1998';

	beforeEach(() => {
		BoardService.getBoards = jest
			.fn()
			.mockResolvedValue(getBoardsResponse([mockBoard1, mockBoard2]));
	});

	it('should display a list and count of completed retros', async () => {
		await setUpThoughtArchives();
		screen.getByText('( showing 1-5 of 11 )');
		screen.getByText(oldestDate);
		screen.getByText(newestDate);
	});

	it('should be sorted by date descending by default', async () => {
		BoardService.getBoards = jest
			.fn()
			.mockResolvedValue(getBoardsResponse([mockBoard2, mockBoard1]));
		await setUpThoughtArchives();

		expect(BoardService.getBoards).toHaveBeenCalledWith(
			'teamId',
			PAGE_INDEX,
			PAGE_SIZE,
			'dateCreated',
			'DESC'
		);

		const tiles = screen.getAllByTestId('boardArchive');
		expect(within(tiles[0]).getByText(newestDate)).toBeDefined();
		expect(within(tiles[1]).getByText(oldestDate)).toBeDefined();
	});

	it('should be sorted by date ascending when Date clicked', async () => {
		await setUpThoughtArchives();

		BoardService.getBoards = jest
			.fn()
			.mockResolvedValue(getBoardsResponse([mockBoard1, mockBoard2]));

		fireEvent.click(screen.getByText('Date'));

		await waitFor(() =>
			expect(BoardService.getBoards).toHaveBeenCalledWith(
				'teamId',
				PAGE_INDEX,
				PAGE_SIZE,
				'dateCreated',
				'ASC'
			)
		);

		const tiles = screen.getAllByTestId('boardArchive');
		expect(within(tiles[0]).getByText(oldestDate)).toBeDefined();
		expect(within(tiles[1]).getByText(newestDate)).toBeDefined();
	});

	it('should be sorted by date descending when Date clicked and already sorted by ascending', async () => {
		await setUpThoughtArchives();
		fireEvent.click(screen.getByText('Date'));

		BoardService.getBoards = jest
			.fn()
			.mockResolvedValue(getBoardsResponse([mockBoard2, mockBoard1]));

		fireEvent.click(screen.getByText('Date'));

		await waitFor(() =>
			expect(BoardService.getBoards).toHaveBeenCalledWith(
				'teamId',
				PAGE_INDEX,
				PAGE_SIZE,
				'dateCreated',
				'DESC'
			)
		);

		const tiles = screen.getAllByTestId('boardArchive');
		expect(within(tiles[0]).getByText('April 22nd, 1998')).toBeDefined();
		expect(within(tiles[1]).getByText('October 1st, 1982')).toBeDefined();
	});

	it('should be sorted by thought count descending when # clicked', async () => {
		await setUpThoughtArchives();

		BoardService.getBoards = jest
			.fn()
			.mockResolvedValue(getBoardsResponse([mockBoard1, mockBoard2]));

		fireEvent.click(screen.getByText('#'));

		await waitFor(() =>
			expect(BoardService.getBoards).toHaveBeenCalledWith(
				'teamId',
				PAGE_INDEX,
				PAGE_SIZE,
				'thoughtCount',
				'DESC'
			)
		);

		const tiles = screen.getAllByTestId('boardArchive');
		expect(within(tiles[0]).getByText('1')).toBeDefined();
		expect(within(tiles[1]).getByText('0')).toBeDefined();
	});

	it('should be sorted by thought count ascending when # clicked and already sorted by descending', async () => {
		await setUpThoughtArchives();
		fireEvent.click(screen.getByText('#'));

		BoardService.getBoards = jest
			.fn()
			.mockResolvedValue(getBoardsResponse([mockBoard2, mockBoard1]));

		fireEvent.click(screen.getByText('#'));

		await waitFor(() =>
			expect(BoardService.getBoards).toHaveBeenCalledWith(
				'teamId',
				PAGE_INDEX,
				PAGE_SIZE,
				'thoughtCount',
				'ASC'
			)
		);

		const tiles = screen.getAllByTestId('boardArchive');
		expect(within(tiles[0]).queryByText('0')).not.toBeNull();
		expect(within(tiles[1]).queryByText('1')).not.toBeNull();
	});

	it('should show "No Archives" message when no archived thoughts are present', async () => {
		BoardService.getBoards = jest.fn().mockResolvedValue(getBoardsResponse([]));

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
	renderWithRecoilRoot(
		<ArchivedBoardsList onBoardSelection={jest.fn()} />,
		({ set }) => {
			set(TeamState, { id: 'teamId', name: 'Team' });
		}
	);

	await waitFor(() => expect(BoardService.getBoards).toHaveBeenCalled());
	await screen.findByText('Thought Archives');
};

function getBoardsResponse(boards: Board[]): GetBoardsResponse {
	return {
		boards,
		paginationData: {
			sortOrder: SortOrder.DESC,
			sortBy: 'dateCreated',
			pageIndex: PAGE_INDEX,
			pageSize: PAGE_SIZE,
			pageRange: '1-5',
			totalBoardCount: 11,
			totalPages: 3,
		},
	};
}
