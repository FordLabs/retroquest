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

import axios from 'axios';

import { mockGetCookie } from '../../__mocks__/universal-cookie';
import Board from '../../Types/Board';

import BoardService, { SortOrder } from './BoardService';

describe('Board Service', () => {
	const teamId = 'teamId';
	const fakeToken = 'fake-token';
	const mockConfig = { headers: { Authorization: `Bearer ${fakeToken}` } };
	const boardId = 234;
	const boardUrl = `/api/team/${teamId}/boards`;
	const expectedBoard: Board = {
		id: boardId,
		teamId,
		thoughtCount: 2,
		dateCreated: new Date(),
		thoughts: [],
	};

	beforeAll(() => {
		mockGetCookie.mockReturnValue(fakeToken);
	});

	describe('archiveRetro', () => {
		it('should archive the active retro for a team', () => {
			BoardService.archiveRetro(teamId);
			expect(axios.put).toHaveBeenCalledWith(
				`/api/team/${teamId}/end-retro`,
				mockConfig
			);
		});
	});

	describe('getBoards', () => {
		beforeEach(() => {
			const headers = {
				'page-index': '0',
				'page-size': '5',
				'total-board-count': '15',
				'total-pages': '3',
			};
			axios.get = jest
				.fn()
				.mockResolvedValue({ data: [expectedBoard], headers });
		});

		it('should return list of boards and pagination data by page index, and pageSize', async () => {
			const actualResponse = await BoardService.getBoards(teamId, 0, 5);

			expect(actualResponse).toEqual({
				boards: [expectedBoard],
				paginationData: {
					pageIndex: 0,
					pageSize: 5,
					totalBoardCount: 15,
					totalPages: 3,
				},
			});

			expect(axios.get).toHaveBeenCalledWith(
				`${boardUrl}?pageIndex=0&pageSize=5`,
				mockConfig
			);
		});

		it('should return list of boards sorted by thoughtCount in ascending order', async () => {
			const actualResponse = await BoardService.getBoards(
				teamId,
				0,
				5,
				'thoughtCount',
				SortOrder.ASC
			);

			expect(actualResponse.boards).toEqual([expectedBoard]);
			expect(axios.get).toHaveBeenCalledWith(
				`${boardUrl}?pageIndex=0&pageSize=5&sortBy=thoughtCount&sortOrder=ASC`,
				mockConfig
			);
		});

		it('should return list of boards sorted by thoughtCount in descending order', async () => {
			const actualResponse = await BoardService.getBoards(
				teamId,
				0,
				5,
				'thoughtCount',
				SortOrder.DESC
			);

			expect(actualResponse.boards).toEqual([expectedBoard]);
			expect(axios.get).toHaveBeenCalledWith(
				`${boardUrl}?pageIndex=0&pageSize=5&sortBy=thoughtCount&sortOrder=DESC`,
				mockConfig
			);
		});
	});

	describe('getBoard', () => {
		it('should get board by team id and board id', async () => {
			axios.get = jest.fn().mockResolvedValue({ data: expectedBoard });

			const actualBoard = await BoardService.getBoard(teamId, boardId);

			expect(actualBoard).toEqual(expectedBoard);
			expect(axios.get).toHaveBeenCalledWith(
				`${boardUrl}/${boardId}`,
				mockConfig
			);
		});
	});
});
