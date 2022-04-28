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
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
	mockBoard1,
	mockBoard2,
	SortOrder,
} from '../../../../../Services/Api/__mocks__/BoardService';
import BoardService, {
	GetBoardsResponse,
	SortByType,
} from '../../../../../Services/Api/BoardService';
import { TeamState } from '../../../../../State/TeamState';
import Board from '../../../../../Types/Board';
import renderWithRecoilRoot from '../../../../../Utils/renderWithRecoilRoot';

import ArchivedBoardsList from './ArchivedBoardsList';

jest.mock('../../../../../Services/Api/BoardService');

const PAGE_SIZE = 5;
const INITIAL_PAGE_INDEX = 0;

describe('Archived Boards List', () => {
	const oldestDate = 'October 1st, 1982';
	const newestDate = 'April 22nd, 1998';

	beforeEach(() => {
		BoardService.getBoards = jest
			.fn()
			.mockResolvedValue(getBoardsResponse([mockBoard1, mockBoard2]));
	});

	it('should display a list of completed retros', async () => {
		await setUpThoughtArchives();
		expect(screen.getByText(oldestDate)).toBeDefined();
		expect(screen.getByText(newestDate)).toBeDefined();
	});

	describe('Pagination', () => {
		it('should display text telling user info about what is on the page', async () => {
			await setUpThoughtArchives();
			expect(screen.getByText('( showing 1-5 of 11 )')).toBeDefined();
		});

		it('should start on first paginated page', async () => {
			await setUpThoughtArchives();
			const paginationButton = screen.getAllByText('1').slice(-1)[0];
			expect(paginationButton).toHaveClass('active');
		});

		it('should paginate to second page with default sorting', async () => {
			await setUpThoughtArchives();
			const pagination2Button = screen.getAllByText('2').slice(-1)[0];
			expect(pagination2Button).not.toHaveClass('active');
			expect(screen.getAllByTestId('boardArchive')).toHaveLength(2);

			BoardService.getBoards = jest
				.fn()
				.mockResolvedValue(getBoardsResponse([mockBoard2]));

			userEvent.click(pagination2Button);

			expect(pagination2Button).toHaveClass('active');
			await waitFor(() =>
				expect(BoardService.getBoards).toHaveBeenCalledWith(
					'teamId',
					INITIAL_PAGE_INDEX + 1,
					PAGE_SIZE,
					'dateCreated',
					'DESC'
				)
			);
			expect(screen.getAllByTestId('boardArchive')).toHaveLength(1);
		});

		it('should paginate to second page with new sorting', async () => {
			await setUpThoughtArchives();
			const pagination2Button = screen.getAllByText('2').slice(-1)[0];
			expect(pagination2Button).not.toHaveClass('active');
			expect(screen.getAllByTestId('boardArchive')).toHaveLength(2);

			BoardService.getBoards = jest
				.fn()
				.mockResolvedValue(
					getBoardsResponse([mockBoard2], 'thoughtCount', SortOrder.DESC)
				);

			clickThoughtCountSortingButton();

			await waitFor(() => expect(BoardService.getBoards).toHaveBeenCalled());

			userEvent.click(pagination2Button);

			expect(pagination2Button).toHaveClass('active');
			await waitFor(() =>
				expect(BoardService.getBoards).toHaveBeenCalledWith(
					'teamId',
					INITIAL_PAGE_INDEX,
					PAGE_SIZE,
					'thoughtCount',
					'DESC'
				)
			);
			expect(screen.getAllByTestId('boardArchive')).toHaveLength(1);
		});
	});

	describe('Sorting', () => {
		it('should be sorted by date descending by default', async () => {
			BoardService.getBoards = jest
				.fn()
				.mockResolvedValue(getBoardsResponse([mockBoard2, mockBoard1]));
			await setUpThoughtArchives();

			expect(BoardService.getBoards).toHaveBeenCalledWith(
				'teamId',
				INITIAL_PAGE_INDEX,
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

			clickDateSortingButton();

			await waitFor(() =>
				expect(BoardService.getBoards).toHaveBeenCalledWith(
					'teamId',
					INITIAL_PAGE_INDEX,
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
			clickDateSortingButton();

			BoardService.getBoards = jest
				.fn()
				.mockResolvedValue(getBoardsResponse([mockBoard2, mockBoard1]));

			clickDateSortingButton();

			await waitFor(() =>
				expect(BoardService.getBoards).toHaveBeenCalledWith(
					'teamId',
					INITIAL_PAGE_INDEX,
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

			clickThoughtCountSortingButton();

			await waitFor(() =>
				expect(BoardService.getBoards).toHaveBeenCalledWith(
					'teamId',
					INITIAL_PAGE_INDEX,
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
			clickThoughtCountSortingButton();

			BoardService.getBoards = jest
				.fn()
				.mockResolvedValue(getBoardsResponse([mockBoard2, mockBoard1]));

			clickThoughtCountSortingButton();

			await waitFor(() =>
				expect(BoardService.getBoards).toHaveBeenCalledWith(
					'teamId',
					INITIAL_PAGE_INDEX,
					PAGE_SIZE,
					'thoughtCount',
					'ASC'
				)
			);

			const tiles = screen.getAllByTestId('boardArchive');
			expect(within(tiles[0]).queryByText('0')).not.toBeNull();
			expect(within(tiles[1]).queryByText('1')).not.toBeNull();
		});
	});

	it('should show "No Archives" message when no archived thoughts are present', async () => {
		BoardService.getBoards = jest.fn().mockResolvedValue(getBoardsResponse([]));

		renderWithRecoilRoot(
			<ArchivedBoardsList onBoardSelection={jest.fn()} pageSize={PAGE_SIZE} />
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
		<ArchivedBoardsList onBoardSelection={jest.fn()} pageSize={PAGE_SIZE} />,
		({ set }) => {
			set(TeamState, { id: 'teamId', name: 'Team' });
		}
	);

	await waitFor(() => expect(BoardService.getBoards).toHaveBeenCalled());
	await screen.findByText('Thought Archives');
};

function getBoardsResponse(
	boards: Board[],
	sortBy: SortByType = 'dateCreated',
	sortOrder: SortOrder = SortOrder.DESC
): GetBoardsResponse {
	return {
		boards,
		paginationData: {
			sortOrder: sortOrder,
			sortBy: sortBy,
			pageIndex: INITIAL_PAGE_INDEX,
			pageSize: PAGE_SIZE,
			pageRange: '1-5',
			totalBoardCount: 11,
			totalPages: 3,
		},
	};
}

function clickDateSortingButton() {
	userEvent.click(screen.getByText('Date'));
}

function clickThoughtCountSortingButton() {
	userEvent.click(screen.getByText('#'));
}
