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
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import boardService from 'Services/Api/BoardService';
import { TeamState } from 'State/TeamState';
import Board from 'Types/Board';
import { Column } from 'Types/Column';
import Retro from 'Types/Retro';
import Thought from 'Types/Thought';

import ArchivedBoardColumn from './ArchivedBoardColumn/ArchivedBoardColumn';

import './ArchivedBoard.scss';

interface Props {
	board?: Board;
	boardId: number;
}

function ArchivedBoard(props: Props): JSX.Element {
	const { boardId } = props;
	const team = useRecoilValue(TeamState);
	const [fullBoard, setFullBoard] = useState<Retro>();

	function getThoughtsByColumn(initialBoard: Retro, column: Column): Thought[] {
		const columnSpecificThoughts = initialBoard.thoughts.filter(
			(thought) => thought.columnId === column.id
		);
		const discussedThoughts = columnSpecificThoughts
			.filter((thought) => thought.discussed)
			.sort((a, b) => b.hearts - a.hearts);
		const notDiscussedThoughts = columnSpecificThoughts
			.filter((thought) => !thought.discussed)
			.sort((a, b) => b.hearts - a.hearts);
		return notDiscussedThoughts.concat(discussedThoughts);
	}

	useEffect(() => {
		if (team.id) boardService.getBoard(team.id, boardId).then(setFullBoard);
	}, [boardId, setFullBoard, team.id]);

	return (
		<div className="archived-board">
			{fullBoard?.columns.map((column) => (
				<ArchivedBoardColumn
					key={column.id}
					column={column}
					thoughts={getThoughtsByColumn(fullBoard, column)}
				/>
			))}
		</div>
	);
}

export default ArchivedBoard;
