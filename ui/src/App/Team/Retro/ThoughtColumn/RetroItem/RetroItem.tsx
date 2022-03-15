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
import React, { useRef, useState } from 'react';
import classnames from 'classnames';
import { useRecoilValue } from 'recoil';

import ColumnItem from '../../../../../Common/ColumnItem/ColumnItem';
import { ModalMethods } from '../../../../../Common/Modal/Modal';
import ThoughtService from '../../../../../Services/Api/ThoughtService';
import { TeamState } from '../../../../../State/TeamState';
import Thought from '../../../../../Types/Thought';
import { ThoughtTopic } from '../../../../../Types/Topic';
import RetroItemModal from '../RetroItemModal/RetroItemModal';

import UpvoteButton from './UpvoteButton/UpvoteButton';

import './RetroItem.scss';

type RetroItemProps = {
	thought: Thought;
	type: ThoughtTopic;
	readOnly?: boolean;
	disableAnimations?: boolean;
};

export default function RetroItem(props: RetroItemProps) {
	const { thought, type, readOnly = false, disableAnimations = false } = props;

	const [animateFadeOut, setAnimateFadeOut] = useState<boolean>(false);

	const team = useRecoilValue(TeamState);

	const retroItemModalRef = useRef<ModalMethods>(null);

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
		).catch(console.error);
	};

	const deleteThought = () => {
		ThoughtService.delete(team.id, thought.id).catch(console.error);
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
				readOnly={readOnly}
				onSelect={() => retroItemModalRef.current?.show()}
				onEdit={editThought}
				onDelete={deleteThought}
				onCheck={updateThoughtDiscussionStatus}
				customButtons={({ editing, deleting }) => (
					<UpvoteButton
						votes={thought.hearts}
						onClick={upvoteThought}
						disabled={thought.discussed || editing || deleting}
						readOnly={readOnly}
						aria-label={`Upvote (${thought.hearts})`}
						data-testid="retroItem-upvote"
					/>
				)}
			/>
			<RetroItemModal
				ref={retroItemModalRef}
				thought={thought}
				type={thought.topic}
			/>
		</>
	);
}
