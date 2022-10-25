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
import moment from 'moment';

import Board from '../../../../../../Types/Board';

import './ArchivedBoardTile.scss';

interface Props {
	board: Board;
	onViewBtnClick(board: Board): void;
	onDeleteBtnClick(board: Board): void;
}

function ArchivedBoardTile(props: Props): JSX.Element {
	const { board, onViewBtnClick, onDeleteBtnClick } = props;

	return (
		<li data-testid="boardArchive" className="archived-board-tile">
			<span className="thought-count">{board.thoughts.length}</span>
			<span className="date">
				{moment(board.dateCreated).format('MMMM Do, yyyy')}
			</span>
			<div>
				<button className="view-button" onClick={() => onViewBtnClick(board)}>
					View
				</button>
				<button
					className="delete-button"
					onClick={() => onDeleteBtnClick(board)}
				>
					Delete
				</button>
			</div>
		</li>
	);
}

export default ArchivedBoardTile;
