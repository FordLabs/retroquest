/*
 * Copyright (c) 2022. Ford Motor Company
 *  All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { PropsWithChildren, useCallback } from 'react';
import { DragDropContext, OnDragEndResponder } from 'react-beautiful-dnd';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { ColumnsState } from '../../State/ColumnsState';
import { TeamState } from '../../State/TeamState';
import { ThoughtsState } from '../../State/ThoughtsState';
import Thought from '../../Types/Thought';
import { ThoughtTopic } from '../../Types/Topic';
import ThoughtService from '../Api/ThoughtService';

type Props = {};

function DragAndDrop({ children }: PropsWithChildren<Props>): JSX.Element {
	const team = useRecoilValue(TeamState);
	const setThoughts = useSetRecoilState(ThoughtsState);
	const columns = useRecoilValue(ColumnsState);

	const onDragEnd: OnDragEndResponder = useCallback(
		(result, provided) => {
			if (result.destination) {
				const thoughtId = parseInt(result.draggableId);
				const columnId = parseInt(result.destination!.droppableId);

				let oldColumnTopic: ThoughtTopic;
				const newColumn = columns.find((c) => c.id === columnId);

				if (newColumn) {
					setThoughts((currentState: Thought[]) => {
						return currentState.map((thought) => {
							if (thought.id === thoughtId) {
								oldColumnTopic = thought.topic;
								return { ...thought, topic: newColumn.topic };
							}
							return thought;
						});
					});
					ThoughtService.updateColumn(team.id, thoughtId, columnId).catch(
						() => {
							if (oldColumnTopic) {
								setThoughts((currentState: Thought[]) => {
									return currentState.map((thought) =>
										thought.id === thoughtId
											? { ...thought, topic: oldColumnTopic }
											: thought
									);
								});
							}
						}
					);
				}
			}
		},
		[columns, setThoughts, team.id]
	);

	return (
		<DragDropContext
			onDragEnd={onDragEnd}
			onBeforeCapture={() => {
				console.log('onBeforeCapture');
			}}
		>
			{children}
		</DragDropContext>
	);
}

export default DragAndDrop;
