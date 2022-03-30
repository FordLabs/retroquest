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
import classnames from 'classnames';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import Assignee from '../../../../../Common/Assignee/Assignee';
import ColumnItem from '../../../../../Common/ColumnItem/ColumnItem';
import { DateCreated } from '../../../../../Common/DateCreated/DateCreated';
import ActionItemService from '../../../../../Services/Api/ActionItemService';
import { ActionItemByIdState } from '../../../../../State/ActionItemState';
import { ModalContentsState } from '../../../../../State/ModalContentsState';
import { TeamState } from '../../../../../State/TeamState';
import Topic from '../../../../../Types/Topic';

type ActionItemProps = {
	actionItemId: number;
};

function ActionItem(props: ActionItemProps) {
	const { actionItemId } = props;

	const team = useRecoilValue(TeamState);
	const actionItem = useRecoilValue(ActionItemByIdState(actionItemId));
	const setModalContents = useSetRecoilState(ModalContentsState);

	const deleteActionItem = () => {
		ActionItemService.delete(team.id, actionItemId)
			.then(closeModal)
			.catch(console.error);
	};

	const editActionItemTask = (updatedTask: string) => {
		ActionItemService.updateTask(team.id, actionItemId, updatedTask).catch(
			console.error
		);
	};

	const editActionItemAssignee = (updatedAssignee: string) => {
		ActionItemService.updateAssignee(
			team.id,
			actionItemId,
			updatedAssignee
		).catch(console.error);
	};

	const updateActionItemCompletionStatus = () => {
		if (actionItem) {
			ActionItemService.updateCompletionStatus(
				team.id,
				actionItem.id,
				!actionItem.completed
			)
				.then(closeModal)
				.catch(console.error);
		}
	};

	const openActionItemModal = () =>
		setModalContents({
			title: 'Action Item',
			component: <ActionItem actionItemId={actionItemId} />,
			superSize: true,
		});

	const closeModal = () => setModalContents(null);

	return (
		<>
			{actionItem && (
				<ColumnItem
					data-testid="actionItem"
					className={classnames('action-item', {
						completed: actionItem.completed,
					})}
					type={Topic.ACTION}
					text={actionItem.task}
					checked={actionItem.completed}
					onSelect={openActionItemModal}
					onEdit={editActionItemTask}
					onDelete={deleteActionItem}
					onCheck={updateActionItemCompletionStatus}
					customButtons={({ editing, deleting }) => (
						<DateCreated
							date={actionItem.dateCreated}
							disabled={actionItem.completed || editing || deleting}
						/>
					)}
				>
					{({ editing, deleting }) => (
						<Assignee
							assignee={actionItem.assignee}
							onAssign={editActionItemAssignee}
							readOnly={actionItem.completed}
							editing={editing}
							deleting={deleting}
						/>
					)}
				</ColumnItem>
			)}
		</>
	);
}

export default ActionItem;
