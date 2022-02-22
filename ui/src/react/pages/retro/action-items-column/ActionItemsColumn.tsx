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

import * as React from 'react';
import { Fragment } from 'react';
import { useRecoilValue } from 'recoil';

import ActionItem from '../../../components/action-item/ActionItem';
import ColumnHeader from '../../../components/column-header/ColumnHeader';
import { CountSeparator } from '../../../components/count-separator/CountSeparator';
import TextField from '../../../components/text-field/TextField';
import ActionItemService from '../../../services/api/ActionItemService';
import { ActiveActionItemsState, CompletedActionItemsState } from '../../../state/ActionItemState';
import { ColumnTitleByTopicState } from '../../../state/ColumnTitleState';
import { TeamState } from '../../../state/TeamState';
import Action from '../../../types/Action';
import Topic from '../../../types/Topic';

function ActionItemsColumn() {
  const topic = Topic.ACTION;
  const team = useRecoilValue(TeamState);
  const columnTitle = useRecoilValue(ColumnTitleByTopicState(topic));
  const { title } = columnTitle;

  const activeActionItems = useRecoilValue<Action[]>(ActiveActionItemsState);
  const completedActionItems = useRecoilValue<Action[]>(CompletedActionItemsState);

  const createActionItem = (task: string) => {
    if (task && task.length) {
      const assigneesArray: string[] = ActionItemService.parseAssignees(task);
      const updatedTask: string = ActionItemService.removeAssigneesFromTask(task, assigneesArray);

      if (updatedTask && updatedTask.length) {
        const maxAssigneeLength = 50;
        const assignees = assigneesArray ? assigneesArray.join(', ').substring(0, maxAssigneeLength) : null;
        ActionItemService.create(team.id, updatedTask, assignees).catch(console.error);
      }
    }
  };

  const renderActionItem = (action: Action) => {
    return (
      <Fragment key={action.id}>
        <ActionItem action={action} />
      </Fragment>
    );
  };

  return (
    <div className="retro-column" data-testid={`retroColumn__${topic}`}>
      <ColumnHeader initialTitle={title} type={topic} />
      <TextField type={topic} placeholder="Enter an Action Item" handleSubmission={createActionItem} />
      <CountSeparator count={activeActionItems.length} />
      {activeActionItems.map(renderActionItem)}
      {completedActionItems.map(renderActionItem)}
    </div>
  );
}

export default ActionItemsColumn;
