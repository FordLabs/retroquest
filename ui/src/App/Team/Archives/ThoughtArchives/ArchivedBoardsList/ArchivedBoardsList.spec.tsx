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
	getByTestId,
	screen,
	waitFor,
	within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
	mockBoard1,
	mockBoard2,
	SortOrder,
} from 'Services/Api/__mocks__/BoardService';
import { mockTeam } from 'Services/Api/__mocks__/TeamService';
import BoardService, {
	GetBoardsResponse,
	SortByType,
} from 'Services/Api/BoardService';
import { TeamState } from 'State/TeamState';
import Board from 'Types/Board';
import renderWithRecoilRoot from 'Utils/renderWithRecoilRoot';

import ArchivedBoardsList from './ArchivedBoardsList';

jest.mock('Services/Api/BoardService');

const PAGE_SIZE = 20;
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
			expect(screen.getByText('(showing 1-20 of 23)')).toBeDefined();
		});

		it('should start on first paginated page', async () => {
			await setUpThoughtArchives();
			const paginationButton = screen.getAllByText('1').slice(-1)[0];
			expect(paginationButton).toHaveClass('active');
		});

		it('should paginate to second page with default sorting of date in descending order', async () => {
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
					mockTeam.id,
					INITIAL_PAGE_INDEX + 1,
					PAGE_SIZE,
					'dateCreated',
					'DESC'
				)
			);
			expect(screen.getAllByTestId('boardArchive')).toHaveLength(1);
		});

		it('should paginate to second page with sorting of date in ascending order', async () => {
			await setUpThoughtArchives();
			const pagination2Button = screen.getAllByText('2').slice(-1)[0];
			expect(pagination2Button).not.toHaveClass('active');
			expect(screen.getAllByTestId('boardArchive')).toHaveLength(2);

			BoardService.getBoards = jest
				.fn()
				.mockResolvedValue(
					getBoardsResponse([mockBoard2], 'dateCreated', SortOrder.DESC)
				);

			clickDateSortingButton();

			await waitFor(() => expect(BoardService.getBoards).toHaveBeenCalled());

			userEvent.click(pagination2Button);

			expect(pagination2Button).toHaveClass('active');
			await waitFor(() =>
				expect(BoardService.getBoards).toHaveBeenCalledWith(
					mockTeam.id,
					INITIAL_PAGE_INDEX,
					PAGE_SIZE,
					'dateCreated',
					'ASC'
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
				mockTeam.id,
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
					mockTeam.id,
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
					mockTeam.id,
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
	});

	describe('Bulk Deletion', () => {
		it('should have a Select All checkbox', async () => {
			await setUpThoughtArchives();
			screen.getByTestId('selectAll');
		});
		it('should select all when Select All is checked', async () => {
			await setUpThoughtArchives();
			fireEvent.click(screen.getByTestId('selectAll'));
			const allCheckboxes = screen.getAllByTestId('checkboxButton');
			expect(allCheckboxes.length).toEqual(2);
			allCheckboxes.forEach((checkbox) => {
				expect(checkbox).toHaveAttribute('data-checked', 'true');
			});
		});
		it('should deselect all when Select All is unchecked', async () => {
			await setUpThoughtArchives();
			fireEvent.click(screen.getByTestId('selectAll'));
			fireEvent.click(screen.getByTestId('selectAll'));
			const allCheckboxes = screen.getAllByTestId('checkboxButton');
			expect(allCheckboxes.length).toEqual(2);
			allCheckboxes.forEach((checkbox) => {
				expect(checkbox).toHaveAttribute('data-checked', 'false');
			});
		});

		it('should indicate when all are selected, even if via other means than Select All', async () => {
			await setUpThoughtArchives();
			fireEvent.click(screen.getByTestId('selectAll'));
			expect(screen.getByTestId('selectAll')).toHaveAttribute(
				'data-checked',
				'true'
			);
			fireEvent.click(screen.getAllByTestId('checkboxButton')[0]);
			expect(screen.getByTestId('selectAll')).toHaveAttribute(
				'data-checked',
				'false'
			);
			fireEvent.click(screen.getAllByTestId('checkboxButton')[0]);
			expect(screen.getByTestId('selectAll')).toHaveAttribute(
				'data-checked',
				'true'
			);
		});

		it('should make a Delete Selected button appear if a checkbox is checked', async () => {
			await setUpThoughtArchives();
			fireEvent.click(screen.getAllByTestId('checkboxButton')[0]);
			await waitFor(() => {
				expect(screen.getByText('Delete Selected')).toBeInTheDocument();
			});
		});
	});

	it('should show "No Archives" message when no archived thoughts are present', async () => {
		BoardService.getBoards = jest.fn().mockResolvedValue(getBoardsResponse([]));

		renderWithRecoilRoot(<ArchivedBoardsList onBoardSelection={jest.fn()} />);

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
			set(TeamState, mockTeam);
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
			pageRange: '1-' + PAGE_SIZE,
			totalBoardCount: 23,
			totalPages: 2,
		},
	};
}

async function clickDateSortingButton() {
	await waitFor(() => {
		expect(screen.getByText('Date')).toBeInTheDocument();
	});
	userEvent.click(screen.getByText('Date'));
}
