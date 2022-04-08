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
import React from 'react';
import classnames from 'classnames';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import ColumnItem from '../../../../../Common/ColumnItem/ColumnItem';
import ThoughtService from '../../../../../Services/Api/ThoughtService';
import { ModalContentsState } from '../../../../../State/ModalContentsState';
import { TeamState } from '../../../../../State/TeamState';
import { ThoughtByIdState } from '../../../../../State/ThoughtsState';
import { ThoughtTopic } from '../../../../../Types/Topic';
import ThoughtItemWithAddAction from '../ThoughtItemWithAddAction/ThoughtItemWithAddAction';

import UpvoteButton from './UpvoteButton/UpvoteButton';

type RetroItemProps = {
	thoughtId: number;
	type: ThoughtTopic;
	disableButtons?: boolean;
};

function ThoughtItem(props: RetroItemProps) {
	const { type, thoughtId, disableButtons = false } = props;

	const team = useRecoilValue(TeamState);
	const thought = useRecoilValue(ThoughtByIdState(thoughtId));
	const setModalContents = useSetRecoilState(ModalContentsState);

	const closeModal = () => setModalContents(null);

	const editThought = (updatedThoughtMessage: string) => {
		ThoughtService.updateMessage(
			team.id,
			thoughtId,
			updatedThoughtMessage
		).catch(console.error);
	};

	const updateThoughtDiscussionStatus = () => {
		if (thought) {
			ThoughtService.updateDiscussionStatus(
				team.id,
				thoughtId,
				!thought.discussed
			)
				.then(closeModal)
				.catch(console.error);
		}
	};

	const deleteThought = () => {
		ThoughtService.delete(team.id, thoughtId)
			.then(closeModal)
			.catch(console.error);
	};

	const upvoteThought = () => {
		ThoughtService.upvoteThought(team.id, thoughtId).catch(console.error);
	};

	const openRetroItemModal = () =>
		setModalContents({
			title: 'Retro Item',
			component: <ThoughtItemWithAddAction thoughtId={thoughtId} type={type} />,
			superSize: true,
		});

	return (
		<>
			{thought && (
				<ColumnItem
					className={classnames('retro-item', { completed: thought.discussed })}
					data-testid="retroItem"
					type={type}
					text={thought.message}
					checked={thought.discussed}
					disableButtons={disableButtons}
					onSelect={openRetroItemModal}
					onEdit={editThought}
					onDelete={deleteThought}
					onCheck={updateThoughtDiscussionStatus}
					customButton={
						<UpvoteButton
							votes={thought.hearts}
							onClick={upvoteThought}
							disabled={thought.discussed}
							readOnly={disableButtons}
							aria-label={`Upvote (${thought.hearts})`}
							data-testid="retroItem-upvote"
						/>
					}
				/>
			)}
		</>
	);
}

export default ThoughtItem;
