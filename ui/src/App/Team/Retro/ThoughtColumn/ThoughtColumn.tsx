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

import React, { Fragment, useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { useRecoilValue } from 'recoil';

import ColumnHeader from '../../../../Common/ColumnHeader/ColumnHeader';
import CountSeparator from '../../../../Common/CountSeparator/CountSeparator';
import TextField from '../../../../Common/TextField/TextField';
import ColumnService from '../../../../Services/Api/ColumnService';
import ThoughtService from '../../../../Services/Api/ThoughtService';
import { TeamState } from '../../../../State/TeamState';
import {
	ActiveThoughtCountByTopicState,
	SortableThoughtsByTopicState,
} from '../../../../State/ThoughtsState';
import { Column } from '../../../../Types/Column';
import { getCreateThoughtRequest } from '../../../../Types/CreateThoughtRequest';
import Thought from '../../../../Types/Thought';

import DraggableRetroItem from './DraggableRetroItem/DraggableRetroItem';

import './ThoughtColumn.scss';

interface Props {
	column: Column;
}

function ThoughtColumn(props: Props) {
	const { column } = props;

	const team = useRecoilValue(TeamState);
	const [sorted, setSorted] = useState(false);
	const thoughts = useRecoilValue<Thought[]>(
		SortableThoughtsByTopicState({ topic: column.topic, sorted })
	);
	const activeThoughtCount = useRecoilValue<number>(
		ActiveThoughtCountByTopicState(column.topic)
	);

	const changeTitle = (title: string) => {
		ColumnService.updateColumnTitle(team.id, column.id, title).catch(
			console.error
		);
	};

	const createThought = (text: string) => {
		if (text && text.length) {
			ThoughtService.create(
				team.id,
				getCreateThoughtRequest(team.id, column.id, column.topic, text)
			).catch(console.error);
		}
	};

	return (
		<div className="retro-column" data-testid={`retroColumn__${column.topic}`}>
			<ColumnHeader
				initialTitle={column.title}
				type={column.topic}
				sortedChanged={setSorted}
				titleChanged={changeTitle}
			/>
			<TextField
				type={column.topic}
				placeholder="Enter a Thought"
				handleSubmission={createThought}
			/>
			<CountSeparator count={activeThoughtCount} />
			<Droppable droppableId={`${column.id}`} type="THOUGHT">
				{(provided) => (
					<ul
						className="thought-list"
						data-testid={`droppableThoughtColumn-${column.topic}`}
					>
						<div ref={provided.innerRef} {...provided.droppableProps}>
							{thoughts.map((thought: Thought, index: number) => (
								<Fragment key={index}>
									<DraggableRetroItem thought={thought} index={index} />
								</Fragment>
							))}
							{provided.placeholder}
						</div>
					</ul>
				)}
			</Droppable>
		</div>
	);
}

export default ThoughtColumn;
