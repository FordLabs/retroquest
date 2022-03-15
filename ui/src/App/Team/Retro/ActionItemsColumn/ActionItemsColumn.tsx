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

import ColumnHeader from '../../../../Common/ColumnHeader/ColumnHeader';
import CountSeparator from '../../../../Common/CountSeparator/CountSeparator';
import TextField from '../../../../Common/TextField/TextField';
import ActionItemService from '../../../../Services/Api/ActionItemService';
import {
	ActiveActionItemsState,
	CompletedActionItemsState,
} from '../../../../State/ActionItemState';
import { TeamState } from '../../../../State/TeamState';
import Action from '../../../../Types/Action';
import Topic from '../../../../Types/Topic';

import ActionItem from './ActionItem/ActionItem';

function ActionItemsColumn() {
	const topic = Topic.ACTION;
	const team = useRecoilValue(TeamState);
	const activeActionItems = useRecoilValue<Action[]>(ActiveActionItemsState);
	const completedActionItems = useRecoilValue<Action[]>(
		CompletedActionItemsState
	);

	const createActionItem = (task: string) => {
		if (task && task.length) {
			const assigneesArray: string[] | null =
				ActionItemService.parseAssignees(task);
			const updatedTask: string = ActionItemService.removeAssigneesFromTask(
				task,
				assigneesArray
			);

			if (updatedTask && updatedTask.length) {
				const maxAssigneeLength = 50;
				const assignees = assigneesArray
					? assigneesArray.join(', ').substring(0, maxAssigneeLength)
					: null;
				ActionItemService.create(team.id, updatedTask, assignees).catch(
					console.error
				);
			}
		}
	};

	const renderActionItem = (action: Action) => {
		return (
			<li key={action.id}>
				<ActionItem action={action} />
			</li>
		);
	};

	return (
		<div className="retro-column" data-testid={`retroColumn__${topic}`}>
			<ColumnHeader initialTitle={'Action Items'} type={topic} />
			<TextField
				type={topic}
				placeholder="Enter an Action Item"
				handleSubmission={createActionItem}
			/>
			<CountSeparator count={activeActionItems.length} />
			<ul>
				{activeActionItems.map(renderActionItem)}
				{completedActionItems.map(renderActionItem)}
			</ul>
		</div>
	);
}

export default ActionItemsColumn;
