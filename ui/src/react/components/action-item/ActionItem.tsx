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
import { useRef } from 'react';
import classnames from 'classnames';
import { useRecoilValue } from 'recoil';

import ActionItemService from '../../services/api/ActionItemService';
import { TeamState } from '../../state/TeamState';
import Action from '../../types/Action';
import Topic from '../../types/Topic';
import ActionItemModal from '../action-item-modal/ActionItemModal';
import ColumnItem from '../column-item/ColumnItem';
import { ModalMethods } from '../modal/Modal';

import Assignee from './assignee/Assignee';
import { DateCreated } from './date-created/DateCreated';

import './ActionItem.scss';

type ActionItemProps = {
  action: Action;
  readOnly?: boolean;
};

function ActionItem(props: ActionItemProps) {
  const { action, readOnly = false } = props;
  const actionItemModalRef = useRef<ModalMethods>();

  const team = useRecoilValue(TeamState);

  const deleteActionItem = () => {
    ActionItemService.delete(team.id, action.id).catch(console.error);
  };

  const editActionItemTask = (updatedTask: string) => {
    ActionItemService.updateTask(team.id, action.id, updatedTask).catch(console.error);
  };

  const editActionItemAssignee = (updatedAssignee: string) => {
    ActionItemService.updateAssignee(team.id, action.id, updatedAssignee).catch(console.error);
  };

  const updateActionItemCompletionStatus = () => {
    ActionItemService.updateCompletionStatus(team.id, action.id, !action.completed).catch(console.error);
  };

  return (
    <>
      <ColumnItem
        data-testid="actionItem"
        className={classnames('action-item', { completed: action.completed })}
        type={Topic.ACTION}
        text={action.task}
        checked={action.completed}
        readOnly={readOnly}
        onSelect={() => actionItemModalRef.current?.show()}
        onEdit={editActionItemTask}
        onDelete={deleteActionItem}
        onCheck={updateActionItemCompletionStatus}
        customButtons={({ editing, deleting }) => (
          <DateCreated date={action.dateCreated} disabled={(action.completed || editing || deleting) && !readOnly} />
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
