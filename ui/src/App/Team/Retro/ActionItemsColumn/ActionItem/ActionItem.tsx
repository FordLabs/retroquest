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

import React, { useRef, useState } from 'react';
import classnames from 'classnames';
import { useRecoilValue } from 'recoil';

import Assignee from '../../../../../Common/Assignee/Assignee';
import ColumnItem from '../../../../../Common/ColumnItem/ColumnItem';
import { DateCreated } from '../../../../../Common/DateCreated/DateCreated';
import { ModalMethods } from '../../../../../Common/Modal/Modal';
import ActionItemService from '../../../../../Services/Api/ActionItemService';
import { TeamState } from '../../../../../State/TeamState';
import Action from '../../../../../Types/Action';
import Topic from '../../../../../Types/Topic';
import ActionItemModal from '../ActionItemModal/ActionItemModal';

import './ActionItem.scss';

type ActionItemProps = {
	action: Action;
	readOnly?: boolean;
	disableAnimations?: boolean;
};

function ActionItem(props: ActionItemProps) {
	const { action, readOnly = false, disableAnimations = false } = props;
	const actionItemModalRef = useRef<ModalMethods>(null);

	const team = useRecoilValue(TeamState);

	const [animateFadeOut, setAnimateFadeOut] = useState<boolean>(false);

	const deleteActionItem = () => {
		ActionItemService.delete(team.id, action.id).catch(console.error);
	};

	const editActionItemTask = (updatedTask: string) => {
		ActionItemService.updateTask(team.id, action.id, updatedTask).catch(
			console.error
		);
	};

	const editActionItemAssignee = (updatedAssignee: string) => {
		ActionItemService.updateAssignee(team.id, action.id, updatedAssignee).catch(
			console.error
		);
	};

	const updateActionItemCompletionStatus = () => {
		setAnimateFadeOut(true);
		ActionItemService.updateCompletionStatus(
			team.id,
			action.id,
			!action.completed
		).catch(console.error);
	};

	const getAnimationClasses = () => {
		if (!disableAnimations) {
			return {
				'fade-in': !disableAnimations && !animateFadeOut,
				'fade-out': !disableAnimations && animateFadeOut,
			};
		}
	};

	return (
		<>
			<ColumnItem
				data-testid="actionItem"
				className={classnames(
					'action-item',
					{ completed: action.completed },
					getAnimationClasses()
				)}
				type={Topic.ACTION}
				text={action.task}
				checked={action.completed}
				readOnly={readOnly}
				onSelect={() => actionItemModalRef.current?.show()}
				onEdit={editActionItemTask}
				onDelete={deleteActionItem}
				onCheck={updateActionItemCompletionStatus}
				customButtons={({ editing, deleting }) => (
					<DateCreated
						date={action.dateCreated}
						disabled={(action.completed || editing || deleting) && !readOnly}
					/>
				)}
			>
				{({ editing, deleting }) => (
					<Assignee
						assignee={action.assignee}
						onAssign={editActionItemAssignee}
						readOnly={readOnly || action.completed}
						editing={editing}
						deleting={deleting}
					/>
				)}
			</ColumnItem>
			<ActionItemModal ref={actionItemModalRef} action={action} />
		</>
	);
}

export default ActionItem;