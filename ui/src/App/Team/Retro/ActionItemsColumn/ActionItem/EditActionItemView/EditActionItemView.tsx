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
import { useRecoilValue } from 'recoil';

import AssigneeInput from '../../../../../../Common/AssigneeInput/AssigneeInput';
import EditColumnItem from '../../../../../../Common/ColumnItem/EditColumnItem/EditColumnItem';
import ActionItemService from '../../../../../../Services/Api/ActionItemService';
import { TeamState } from '../../../../../../State/TeamState';
import Action from '../../../../../../Types/Action';
import { ActionItemViewState } from '../ActionItem';

interface Props {
	actionItem: Action;
	setViewState: (viewState: ActionItemViewState) => void;
}

function EditActionItemView(props: Props) {
	const { actionItem, setViewState } = props;

	const team = useRecoilValue(TeamState);

	const updateActionItemTask = (updatedTask: string) => {
		ActionItemService.updateTask(team.id, actionItem.id, updatedTask).catch(
			console.error
		);
	};

	const updateActionItemAssignee = (updatedAssignee: string) => {
		ActionItemService.updateAssignee(
			team.id,
			actionItem.id,
			updatedAssignee
		).catch(console.error);
	};

	const changeToDefaultView = () => setViewState(ActionItemViewState.DEFAULT);

	return (
		<EditColumnItem
			initialValue={actionItem?.task}
			onCancel={changeToDefaultView}
			onConfirm={(updatedThought) => {
				updateActionItemTask(updatedThought);
				changeToDefaultView();
			}}
		>
			<AssigneeInput
				assignee={actionItem?.assignee}
				onAssign={updateActionItemAssignee}
				disabled={actionItem?.completed}
			/>
		</EditColumnItem>
	);
}

export default EditActionItemView;
