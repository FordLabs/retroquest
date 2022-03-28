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

import React, { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import ActionItemService from '../../Services/Api/ActionItemService';
import ThoughtService from '../../Services/Api/ThoughtService';
import { ModalContentsState } from '../../State/ModalContentsState';
import { TeamState } from '../../State/TeamState';
import Thought from '../../Types/Thought';
import { onKeys } from '../../Utils/EventUtils';
import Assignee from '../Assignee/Assignee';
import {
	CancelButton,
	ColumnItemButtonGroup,
	ConfirmButton,
} from '../ColumnItemButtons/ColumnItemButtons';
import FloatingCharacterCountdown from '../FloatingCharacterCountdown/FloatingCharacterCountdown';

const MAX_LENGTH_TASK = 255;

type AddActionItemProps = {
	thought: Thought;
	hideComponentCallback: () => void;
};

function AddActionItem(props: AddActionItemProps) {
	const { hideComponentCallback, thought } = props;

	const team = useRecoilValue(TeamState);

	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	const [task, setTask] = useState<string>('');
	const [assignee, setAssignee] = useState<string>('');
	const [shake, setShake] = useState<boolean>(false);

	const setModalContent = useSetRecoilState(ModalContentsState);

	const closeModal = () => setModalContent(null);

	useEffect(() => {
		const escapeListener = onKeys('Escape', hideComponentCallback);
		document.addEventListener('keydown', escapeListener);

		return () => {
			document.removeEventListener('keydown', escapeListener);
		};
	}, [hideComponentCallback]);

	function triggerShakeAnimation() {
		setShake(true);
		textAreaRef.current?.focus();

		setTimeout(() => {
			setShake(false);
		}, 1000);
	}

	const updateThoughtDiscussionStatus = () => {
		ThoughtService.updateDiscussionStatus(
			team.id,
			thought.id,
			!thought.discussed
		)
			.then(closeModal)
			.catch(console.error);
	};

	function onCreate() {
		if (!task) {
			triggerShakeAnimation();
		} else {
			ActionItemService.create(team.id, task, assignee)
				.then(updateThoughtDiscussionStatus)
				.catch(console.error);
		}
	}

	return (
		<div
			data-testid="addActionItem"
			className={classnames('add-action-item action-item column-item action', {
				shake,
			})}
		>
			<div className="text-container">
				<textarea
					data-testid="addActionItem-task"
					className="text-area"
					value={task}
					// eslint-disable-next-line jsx-a11y/no-autofocus
					autoFocus
					onChange={(event) => setTask(event.target.value)}
					onKeyDown={onKeys('Enter', (e) => e.currentTarget.blur())}
					maxLength={MAX_LENGTH_TASK}
					ref={textAreaRef}
				/>
				<FloatingCharacterCountdown
					characterCount={task.length}
					charsAreRunningOutThreshold={50}
					maxCharacterCount={MAX_LENGTH_TASK}
				/>
			</div>
			<Assignee assignee={assignee} onAssign={setAssignee} />
			<ColumnItemButtonGroup>
				<CancelButton onClick={hideComponentCallback}>Discard</CancelButton>
				<ConfirmButton onClick={onCreate}>
					<i
						className="fas fa-link icon"
						aria-hidden="true"
						style={{ marginRight: '6px' }}
					/>
					Create!
				</ConfirmButton>
			</ColumnItemButtonGroup>
		</div>
	);
}

export default AddActionItem;
