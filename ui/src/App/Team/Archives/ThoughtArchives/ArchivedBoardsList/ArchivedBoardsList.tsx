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

import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames';
import NotFoundSection from 'Common/NotFoundSection/NotFoundSection';
import { useRecoilValue } from 'recoil';
import BoardService, {
	PaginationData,
	SortOrder,
} from 'Services/Api/BoardService';
import { TeamState } from 'State/TeamState';
import Board from 'Types/Board';

import Pagination from '../../Pagination/Pagination';

import ArchivedBoardTile from './ArchivedBoardTile/ArchivedBoardTile';

import './ArchivedBoardsList.scss';

enum SortState {
	DateDescending,
	DateAscending,
	CountDescending,
	CountAscending,
}

interface Props {
	onBoardSelection(board: Board): void;
}

function ArchivedBoardsList({ onBoardSelection }: Props): JSX.Element {
	const [boards, setBoards] = useState<Board[]>([]);
	const [paginationData, setPaginationData] = useState<PaginationData>();
	const [sortState, setSortState] = useState<SortState>(
		SortState.DateDescending
	);
	const team = useRecoilValue(TeamState);
	const PAGE_SIZE = 30;

	const getBoards = useCallback(
		(pageIndex: number, sortBy: string, sortOrder: SortOrder) => {
			if (team.id) {
				BoardService.getBoards(
					team.id,
					pageIndex,
					PAGE_SIZE,
					sortBy,
					sortOrder
				).then((response) => {
					setBoards(response.boards);
					setPaginationData(response.paginationData);
				});
			}
		},
		[team.id]
	);

	useEffect(() => {
		getBoards(0, 'dateCreated', SortOrder.DESC);
	}, [getBoards]);

	const getBoardsForPage = useCallback(
		(pageIndex: number) => {
			if (paginationData) {
				const { sortBy, sortOrder } = paginationData;
				getBoards(pageIndex, sortBy, sortOrder);
			}
		},
		[getBoards, paginationData]
	);

	function handleCountSort() {
		const isDescending = sortState === SortState.CountDescending;
		const thoughtCountSortState = isDescending
			? SortState.CountAscending
			: SortState.CountDescending;

		setSortState(thoughtCountSortState);

		const sortOrder = isDescending ? SortOrder.ASC : SortOrder.DESC;
		getBoards(paginationData?.pageIndex || 0, 'thoughtCount', sortOrder);
	}

	function handleDateSort() {
		const isDescending = sortState === SortState.DateDescending;
		const dateSortState = isDescending
			? SortState.DateAscending
			: SortState.DateDescending;

		setSortState(dateSortState);

		const sortOrder = isDescending ? SortOrder.ASC : SortOrder.DESC;
		getBoards(paginationData?.pageIndex || 0, 'dateCreated', sortOrder);
	}

	const getPageData = (): string => {
		return `( showing ${paginationData?.pageRange} of ${paginationData?.totalBoardCount} )`;
	};

	return (
		<div className="archived-boards-list">
			{boards?.length ? (
				<>
					<h1 className="thoughts-archive-title">Thought Archives</h1>
					<p className="thoughts-archive-metadata">{getPageData()}</p>
					<div className="list-header">
						<button
							className={classnames('sort-button', {
								'selected-asc': sortState === SortState.CountAscending,
								'selected-desc': sortState === SortState.CountDescending,
							})}
							onClick={handleCountSort}
						>
							#
						</button>
						<button
							className={classnames('sort-button', {
								'selected-asc': sortState === SortState.DateAscending,
								'selected-desc': sortState === SortState.DateDescending,
							})}
							onClick={handleDateSort}
						>
							Date
						</button>
						<div className="spacer" />
					</div>
					<ol className="list">
						{boards.map(function (board: Board) {
							return (
								<ArchivedBoardTile
									key={board.teamId + board.dateCreated + board.id}
									board={board}
									onTileClicked={onBoardSelection}
								/>
							);
						})}
					</ol>
					<Pagination
						pageCount={paginationData?.totalPages || 0}
						onPageChange={getBoardsForPage}
					/>
				</>
			) : (
				<NotFoundSection
					paragraph={
						<>
							Boards will appear when retros are ended with{' '}
							<span className="bold">thoughts</span>.
						</>
					}
				/>
			)}
		</div>
	);
}

export default ArchivedBoardsList;
