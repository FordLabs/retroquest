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
import { useRecoilValue, useSetRecoilState } from 'recoil';

import AssigneeInput from '../../../../../../Common/AssigneeInput/AssigneeInput';
import ColumnItem from '../../../../../../Common/ColumnItem/ColumnItem';
import {
	CheckboxButton,
	ColumnItemButtonGroup,
	DeleteButton,
	EditButton,
} from '../../../../../../Common/ColumnItemButtons/ColumnItemButtons';
import { DateCreated } from '../../../../../../Common/DateCreated/DateCreated';
import ActionItemService from '../../../../../../Services/Api/ActionItemService';
import { ModalContentsState } from '../../../../../../State/ModalContentsState';
import { TeamState } from '../../../../../../State/TeamState';
import Action from '../../../../../../Types/Action';
import ActionItem, { ActionItemViewState } from '../ActionItem';

import './DefaultActionItemView.scss';

interface Props {
	actionItem: Action;
	setViewState: (viewState: ActionItemViewState) => void;
	setActionItemMinHeight: (height: number | undefined) => void;
}

function DefaultActionItemView(props: Props) {
	const { actionItem, setViewState, setActionItemMinHeight } = props;

	const team = useRecoilValue(TeamState);
	const setModalContents = useSetRecoilState(ModalContentsState);

	const actionItemRef = useRef<HTMLDivElement>(null);

	const openActionItemModal = () =>
		setModalContents({
			title: 'Action Item',
			component: <ActionItem actionItemId={actionItem.id} />,
			superSize: true,
		});

	const closeModal = () => setModalContents(null);

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

	const updateActionItemAssignee = (updatedAssignee: string) => {
		ActionItemService.updateAssignee(
			team.id,
			actionItem.id,
			updatedAssignee
		).catch(console.error);
	};

	return (
		<ColumnItem
			className="action-item"
			ref={actionItemRef}
			data-testid="actionItem"
		>
			<button
				onClick={openActionItemModal}
				className={classNames('column-item-message-button', {
					opacity: actionItem.completed,
				})}
				disabled={actionItem.completed}
				data-testid="actionItemTaskButton"
			>
				{actionItem.task}
			</button>
			<AssigneeInput
				assignee={actionItem.assignee}
				onAssign={updateActionItemAssignee}
				disabled={actionItem.completed}
			/>
			<ColumnItemButtonGroup>
				<DateCreated
					date={actionItem.dateCreated}
					disabled={actionItem.completed}
				/>
				<EditButton
					aria-label="Edit"
					onClick={() => setViewState(ActionItemViewState.EDIT_ACTION_ITEM)}
					disabled={actionItem.completed}
				/>
				<DeleteButton
					aria-label="Delete"
					onClick={() => {
						setActionItemMinHeight(actionItemRef?.current?.clientHeight);
						setViewState(ActionItemViewState.DELETE_ACTION_ITEM);
					}}
				/>
				<CheckboxButton
					aria-label="Mark as complete"
					checked={actionItem.completed}
					onClick={updateActionItemCompletionStatus}
				/>
			</ColumnItemButtonGroup>
		</ColumnItem>
	);
}

export default DefaultActionItemView;
