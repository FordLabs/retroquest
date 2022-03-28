/*
 * Copyright (c) 2021 Ford Motor Company
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
import classnames from 'classnames';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import ColumnItem from '../../../../../Common/ColumnItem/ColumnItem';
import ThoughtService from '../../../../../Services/Api/ThoughtService';
import { ModalContentsState } from '../../../../../State/ModalContentsState';
import { TeamState } from '../../../../../State/TeamState';
import Thought from '../../../../../Types/Thought';
import { ThoughtTopic } from '../../../../../Types/Topic';
import RetroItemWithAddAction from '../RetroItemWithAddAction/RetroItemWithAddAction';

import UpvoteButton from './UpvoteButton/UpvoteButton';

import './RetroItem.scss';

type RetroItemProps = {
	thought: Thought;
	type: ThoughtTopic;
	disableButtons?: boolean;
	disableAnimations?: boolean;
};

function RetroItem(props: RetroItemProps) {
	const {
		thought,
		type,
		disableButtons = false,
		disableAnimations = false,
	} = props;

	const [animateFadeOut, setAnimateFadeOut] = useState<boolean>(false);

	const team = useRecoilValue(TeamState);
	const setModalContents = useSetRecoilState(ModalContentsState);

	const closeModal = () => setModalContents(null);

	const editThought = (updatedThoughtMessage: string) => {
		ThoughtService.updateMessage(
			team.id,
			thought.id,
			updatedThoughtMessage
		).catch(console.error);
	};

	const updateThoughtDiscussionStatus = () => {
		setAnimateFadeOut(true);
		ThoughtService.updateDiscussionStatus(
			team.id,
			thought.id,
			!thought.discussed
		)
			.then(closeModal)
			.catch(console.error);
	};

	const deleteThought = () => {
		ThoughtService.delete(team.id, thought.id)
			.then(closeModal)
			.catch(console.error);
	};

	const upvoteThought = () => {
		ThoughtService.upvoteThought(team.id, thought.id).catch(console.error);
	};

	const getAnimationClasses = () => {
		if (disableAnimations === false) {
			return {
				'fade-in': !disableAnimations && !animateFadeOut,
				'fade-out': !disableAnimations && animateFadeOut,
			};
		}
	};

	const openRetroItemModal = () =>
		setModalContents({
			title: 'Retro Item',
			component: <RetroItemWithAddAction thoughtId={thought.id} type={type} />,
			superSize: true,
		});

	return (
		<>
			<ColumnItem
				className={classnames(
					'retro-item',
					{ completed: thought.discussed },
					getAnimationClasses()
				)}
				data-testid="retroItem"
				type={type}
				text={thought.message}
				checked={thought.discussed}
				disableButtons={disableButtons}
				onSelect={openRetroItemModal}
				onEdit={editThought}
				onDelete={deleteThought}
				onCheck={updateThoughtDiscussionStatus}
				customButtons={({ editing, deleting }) => (
					<UpvoteButton
						votes={thought.hearts}
						onClick={upvoteThought}
						disabled={thought.discussed || editing || deleting}
						readOnly={disableButtons}
						aria-label={`Upvote (${thought.hearts})`}
						data-testid="retroItem-upvote"
					/>
				)}
			/>
		</>
	);
}

export default RetroItem;
