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
import React, { useRef } from 'react';
import classNames from 'classnames';
import ColumnItem from 'Common/ColumnItem/ColumnItem';
import {
	CheckboxButton,
	ColumnItemButtonGroup,
	DeleteButton,
	EditButton,
	UpvoteButton,
} from 'Common/ColumnItemButtons';
import { useRecoilState, useRecoilValue } from 'recoil';
import ThoughtService from 'Services/Api/ThoughtService';
import { ModalContentsState } from 'State/ModalContentsState';
import { TeamState } from 'State/TeamState';
import Thought from 'Types/Thought';
import { ThoughtTopic } from 'Types/Topic';

import ThoughtItemWithAddAction from '../../ThoughtItemWithAddAction/ThoughtItemWithAddAction';
import { ThoughtItemViewState } from '../ThoughtItem';

import './DefaultThoughtItemView.scss';

interface Props {
	thought: Thought;
	type: ThoughtTopic;
	disableButtons: boolean;
	setViewState: (viewState: ThoughtItemViewState) => void;
	setThoughtItemHeight: (height: number | undefined) => void;
}

function DefaultThoughtItemView(props: Readonly<Props>) {
	const {
		thought,
		type,
		disableButtons = false,
		setViewState,
		setThoughtItemHeight,
	} = props;

	const thoughtItemRef = useRef<HTMLDivElement>(null);

	const team = useRecoilValue(TeamState);
	const [modalContents, setModalContents] = useRecoilState(ModalContentsState);

	const openRetroItemModal = () =>
		setModalContents({
			title: 'Retro Item',
			component: (
				<ThoughtItemWithAddAction thoughtId={thought.id} type={type} />
			),
			superSize: true,
		});

	const upvoteThought = () => {
		ThoughtService.upvoteThought(team.id, thought.id).catch(console.error);
	};

	const closeModal = () => setModalContents(null);

	const updateThoughtDiscussionStatus = () => {
		if (thought) {
			ThoughtService.updateDiscussionStatus(
				team.id,
				thought.id,
				!thought.discussed
			)
				.then(closeModal)
				.catch(console.error);
		}
	};

	return (
		<ColumnItem
			className={classNames('thought-item', type)}
			ref={thoughtItemRef}
			data-testid="retroItem"
		>
			<button
				onClick={openRetroItemModal}
				className={classNames('column-item-message-button', {
					opacity: thought.discussed,
				})}
				data-testid="thoughtMessageButton"
				disabled={thought.discussed || !!modalContents || disableButtons}
			>
				{thought.message}
			</button>
			<ColumnItemButtonGroup>
				<UpvoteButton
					votes={thought.hearts}
					onClick={upvoteThought}
					disabled={thought.discussed || disableButtons}
					aria-label={`Upvote (${thought.hearts})`}
					data-testid="retroItem-upvote"
				/>
				<EditButton
					aria-label="Edit"
					onClick={() => setViewState(ThoughtItemViewState.EDIT_THOUGHT)}
					disabled={thought.discussed || disableButtons}
				/>
				<DeleteButton
					aria-label="Delete"
					onClick={() => {
						setThoughtItemHeight(thoughtItemRef?.current?.clientHeight);
						setViewState(ThoughtItemViewState.DELETE_THOUGHT);
					}}
					disabled={disableButtons}
				/>
				<CheckboxButton
					aria-label="Mark as complete"
					checked={thought.discussed}
					onClick={updateThoughtDiscussionStatus}
					disabled={disableButtons}
				/>
			</ColumnItemButtonGroup>
		</ColumnItem>
	);
}

export default DefaultThoughtItemView;
