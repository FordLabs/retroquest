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
import NotFoundSection from 'Common/NotFoundSection/NotFoundSection';
import { useRecoilValue } from 'recoil';
import BoardService, {
	PaginationData,
	SortByType,
	SortOrder,
} from 'Services/Api/BoardService';
import { TeamState } from 'State/TeamState';
import Board from 'Types/Board';

import Pagination from '../../Pagination/Pagination';

import ArchivedBoardListHeader from './ArchivedBoardsListHeader/ArchivedBoardListHeader';
import ArchivedBoardTile from './ArchivedBoardTile/ArchivedBoardTile';

import './ArchivedBoardsList.scss';

const PAGE_SIZE = 20;

interface Props {
	onBoardSelection(board: Board): void;
}

function ArchivedBoardsList({ onBoardSelection }: Props): JSX.Element {
	const [boards, setBoards] = useState<Board[]>([]);
	const [paginationData, setPaginationData] = useState<PaginationData>();
	const team = useRecoilValue(TeamState);
	const [selectedBoardIds, setSelectedBoardIds] = useState<number[]>([]);

	const getBoards = useCallback(
		(pageIndex: number, sortBy: SortByType, sortOrder: SortOrder) => {
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

	function getBoardsForPage(pageIndex: number): void {
		if (paginationData) {
			const { sortBy, sortOrder } = paginationData;
			getBoards(pageIndex, sortBy, sortOrder);
		}
	}

	function handleDateSort(sortOrder: SortOrder): void {
		getBoards(paginationData?.pageIndex || 0, 'dateCreated', sortOrder);
	}

	function getPageData(): string {
		return `(showing ${paginationData?.pageRange} of ${paginationData?.totalBoardCount})`;
	}

	function onBoardDeletion() {
		getBoardsForPage(paginationData?.pageIndex || 0);
	}

	useEffect(() => {
		getBoards(0, 'dateCreated', SortOrder.DESC);
	}, [getBoards]);

	function onBoardCheckboxClick(boardId: number, isChecked: boolean) {
		setSelectedBoardIds((selectedItems: number[]) => {
			if (isChecked) {
				return [...selectedItems, boardId];
			} else {
				return [...selectedItems].filter((i) => i !== boardId);
			}
		});
	}

	return (
		<div className="archived-boards-list">
			{boards?.length ? (
				<>
					<h1 className="thoughts-archive-title">
						Thought Archives
						<span className="thoughts-archive-metadata">{getPageData()}</span>
					</h1>
					<ArchivedBoardListHeader onDateClick={handleDateSort} />
					{selectedBoardIds.length > 0 && <button
						className={"delete-selected-button"}
						data-testid={"deleteSelectedButton"}
					>Delete Selected</button>}
					<ol className="list">
						{boards.map(function (board: Board) {
							return (
								<ArchivedBoardTile
									key={board.teamId + board.dateCreated + board.id}
									board={board}
									isSelected={selectedBoardIds.includes(board.id)}
									onViewBtnClick={onBoardSelection}
									onBoardDeletion={onBoardDeletion}
									onBoardCheckboxClick={onBoardCheckboxClick}
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
