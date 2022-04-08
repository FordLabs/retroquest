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

import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';

import { ThoughtByIdState } from '../../../../../State/ThoughtsState';
import { ThoughtTopic } from '../../../../../Types/Topic';

import DefaultThoughtItemView from './DefaultThoughtItemView/DefaultThoughtItemView';
import DeleteThoughtView from './DeleteThoughtView/DeleteThoughtView';
import EditThoughtView from './EditThoughtView/EditThoughtView';

export enum ThoughtItemViewState {
	DELETE_THOUGHT = 'delete-thought-item',
	EDIT_THOUGHT = 'edit-thought-item',
	DEFAULT = 'default-thought-item',
}

interface Props {
	thoughtId: number;
	type: ThoughtTopic;
	disableButtons?: boolean;
}

function ThoughtItem(props: Props) {
	const { thoughtId, type, disableButtons = false } = props;

	const thought = useRecoilValue(ThoughtByIdState(thoughtId));

	const [viewState, setViewState] = useState<ThoughtItemViewState>(
		ThoughtItemViewState.DEFAULT
	);
	const [thoughtItemHeight, setThoughtItemHeight] = useState<number>();

	if (!thought) return <></>;

	switch (viewState) {
		case ThoughtItemViewState.DELETE_THOUGHT:
			return (
				<DeleteThoughtView
					thoughtId={thought.id}
					setViewState={setViewState}
					height={thoughtItemHeight}
				/>
			);
		case ThoughtItemViewState.EDIT_THOUGHT:
			return <EditThoughtView thought={thought} setViewState={setViewState} />;
		default:
			return (
				<DefaultThoughtItemView
					thought={thought}
					type={type}
					setViewState={setViewState}
					setThoughtItemHeight={setThoughtItemHeight}
					disableButtons={disableButtons}
				/>
			);
	}
}

export default ThoughtItem;
