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
import { Draggable } from 'react-beautiful-dnd';
import classNames from 'classnames';
import { useRecoilValue } from 'recoil';

import { DisableDraggableState } from '../../../../../State/DisableDraggableState';
import Thought from '../../../../../Types/Thought';
import { ThoughtTopic } from '../../../../../Types/Topic';
import ThoughtItem from '../ThoughtItem/ThoughtItem';

import './DraggableRetroItem.scss';

interface Props {
	thought: Thought;
	topic: ThoughtTopic;
	index: number;
}

const DraggableRetroItem = (props: Readonly<Props>): React.ReactElement => {
	const { thought, topic, index } = props;
	const disableDraggable = useRecoilValue(DisableDraggableState);

	return (
		<Draggable
			key={thought.id}
			draggableId={`${thought.id}`}
			index={index}
			disableInteractiveElementBlocking
			isDragDisabled={disableDraggable}
		>
			{(provided) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					className={classNames('draggable-thought-item', topic)}
					data-testid={`draggableRetroItem-${topic}-${index + 1}`}
				>
					<ThoughtItem thoughtId={thought.id} type={topic} />
				</div>
			)}
		</Draggable>
	);
};

export default DraggableRetroItem;
