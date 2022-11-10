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

import axios, { AxiosResponseHeaders } from 'axios';

import Board from '../../Types/Board';

import getAuthConfig from './getAuthConfig';

export interface GetBoardsResponse {
	boards: Board[];
	paginationData: PaginationData;
}

export type SortByType = 'dateCreated' | 'thoughtCount';

export interface PaginationData {
	sortOrder: SortOrder;
	sortBy: SortByType;
	pageIndex: number;
	pageSize: number;
	pageRange: string;
	totalBoardCount: number;
	totalPages: number;
}

export enum SortOrder {
	DESC = 'DESC',
	ASC = 'ASC',
}

const BoardService = {
	archiveRetro(teamId: string): Promise<void> {
		const url = `/api/team/${teamId}/end-retro`;
		return axios.put(url, undefined, getAuthConfig());
	},

	getBoards(
		teamId: string,
		pageIndex: number,
		pageSize?: number,
		sortBy?: SortByType,
		sortOrder?: SortOrder
	): Promise<GetBoardsResponse> {
		let url = `/api/team/${teamId}/boards?`;
		if (pageIndex !== undefined) url += `pageIndex=${pageIndex}`;
		if (pageSize !== undefined) url += `&pageSize=${pageSize}`;
		if (sortBy !== undefined) url += `&sortBy=${sortBy}`;
		if (sortOrder !== undefined) url += `&sortOrder=${sortOrder}`;

		return axios.get(url, getAuthConfig()).then((response) => {
			return {
				boards: response.data,
				paginationData: getPaginatedDataFromHeaders(
					response.headers as AxiosResponseHeaders
				),
			};
		});
	},

	getBoard(teamId: string, boardId: number) {
		const url = `/api/team/${teamId}/boards/${boardId}`;
		return axios.get(url, getAuthConfig()).then((response) => response.data);
	},

	deleteBoard(teamId: string, boardId: number) {
		const url = `/api/team/${teamId}/board/${boardId}`;
		return axios.delete(url, getAuthConfig());
	},

	deleteBoards(teamId: string, boardIds: number[]) {
		const url = `/api/team/${teamId}/boards`;
		return axios.delete(url, {
			...getAuthConfig(),
			data: { boardIds: boardIds },
		});
	},
};

export default BoardService;

function getPaginatedDataFromHeaders(
	headers: AxiosResponseHeaders
): PaginationData {
	return {
		sortBy: headers['sort-by'] as SortByType,
		sortOrder: headers['sort-order'] as SortOrder,
		pageIndex: parseInt(headers['page-index']!, 10),
		pageSize: parseInt(headers['page-size']!, 10),
		pageRange: headers['page-range']!,
		totalBoardCount: parseInt(headers['total-board-count']!, 10),
		totalPages: parseInt(headers['total-pages']!, 10),
	};
}
