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

import AssigneeInput from '../../../../../../Common/AssigneeInput/AssigneeInput';
import {
	CancelButton,
	ColumnItemButtonGroup,
	ConfirmButton,
} from '../../../../../../Common/ColumnItemButtons';
import Textarea from '../../../../../../Common/Textarea/Textarea';
import ActionItemService from '../../../../../../Services/Api/ActionItemService';
import ThoughtService from '../../../../../../Services/Api/ThoughtService';
import { ModalContentsState } from '../../../../../../State/ModalContentsState';
import { TeamState } from '../../../../../../State/TeamState';
import { ThoughtByIdState } from '../../../../../../State/ThoughtsState';
import { onKeys } from '../../../../../../Utils/EventUtils';

import './AddActionItem.scss';

type AddActionItemProps = {
	thoughtId: number;
	hideComponentCallback: () => void;
};

function AddActionItem(props: AddActionItemProps) {
	const { hideComponentCallback, thoughtId } = props;

	const team = useRecoilValue(TeamState);
	const thought = useRecoilValue(ThoughtByIdState(thoughtId));

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
			<Textarea
				onChange={setTask}
				onEnter={(_value: any, e: { currentTarget: { blur: () => any } }) =>
					e.currentTarget.blur()
				}
			/>
			<AssigneeInput assignee={assignee} onAssign={setAssignee} />
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
