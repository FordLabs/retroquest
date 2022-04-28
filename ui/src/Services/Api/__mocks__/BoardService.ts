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

import Board from 'Types/Board';
import Retro from 'Types/Retro';

import { GetBoardsResponse, PaginationData } from '../BoardService';

import { mockColumns } from './ColumnService';

export enum SortOrder {
	DESC = 'DESC',
	ASC = 'ASC',
}

export const mockBoard1: Board = {
	id: 1,
	dateCreated: new Date(1982, 9, 1),
	teamId: 'teamId',
	thoughts: [
		{
			id: 100,
			message: 'I am a message',
			hearts: 0,
			discussed: false,
			columnId: 1,
		},
	],
};

export const mockBoard2: Board = {
	id: 2,
	dateCreated: new Date(1998, 3, 22),
	teamId: 'teamId',
	thoughts: [],
};

export const mockBoards: Board[] = [mockBoard1, mockBoard2];

export const mockRetro: Retro = {
	id: 2,
	dateCreated: new Date(1998, 3, 22),
	teamId: 'teamId',
	thoughts: [
		{
			id: 100,
			message: 'I am a message',
			hearts: 0,
			discussed: false,
			columnId: 1,
		},
	],
	columns: mockColumns,
};

export const mockPaginationData: PaginationData = {
	sortOrder: SortOrder.DESC,
	sortBy: 'dateCreated',
	pageIndex: 0,
	pageSize: 5,
	pageRange: '1-5',
	totalBoardCount: 0,
	totalPages: 0,
};

const BoardService = {
	archiveRetro: jest.fn().mockResolvedValue(null),
	getBoards: jest.fn().mockResolvedValue({
		boards: mockBoards,
		paginationData: mockPaginationData,
	} as GetBoardsResponse),
	getBoard: jest.fn().mockResolvedValue(mockRetro),
};

export default BoardService;
