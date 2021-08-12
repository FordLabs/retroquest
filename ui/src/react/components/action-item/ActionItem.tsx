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

import * as React from 'react';
import classnames from 'classnames';
import moment from 'moment';

import ColumnItem from '../column-item/ColumnItem';
import FloatingCharacterCountdown from '../floating-character-countdown/FloatingCharacterCountdown';
import ColumnType from '../../types/ColumnType';
import Action from '../../types/Action';
import { onChange, onKeys } from '../../utils/EventUtils';

import './ActionItem.scss';

const NO_OP = () => undefined;

const MAX_ASSIGNEE_LENGTH = 50;

type ActionItemProps = {
  action: Action;
  readOnly?: boolean;
  onSelect?: () => void;
  onEdit?: (message: string) => void;
  onAssign?: (assignee: string) => void;
  onDelete?: () => void;
  onComplete?: () => void;
};

export default function ActionItem(props: ActionItemProps) {
  const {
    action,
    readOnly = false,
    onSelect,
    onEdit = NO_OP,
    onAssign = NO_OP,
    onDelete = NO_OP,
    onComplete = NO_OP,
  } = props;

  return (
    <ColumnItem
      data-testid="actionItem"
      className="action-item"
      type={ColumnType.ACTION}
      text={action.task}
      checked={action.completed}
      readOnly={readOnly}
      onSelect={onSelect}
      onEdit={onEdit}
      onDelete={onDelete}
      onCheck={onComplete}
      customButtons={({ editing, deleting }) => (
        <DateCreated date={action.dateCreated} disabled={(action.completed || editing || deleting) && !readOnly} />
      )}
    >
      {({ editing, deleting }) => (
        <Assignee
          assignee={action.assignee}
          onAssign={onAssign}
          readOnly={readOnly || action.completed}
          editing={editing}
          deleting={deleting}
        />
      )}
    </ColumnItem>
  );
}

type AssigneeProps = {
  assignee: string;
  onAssign: (assignee: string) => void;
  editing?: boolean;
  deleting?: boolean;
  readOnly?: boolean;
};

function Assignee(props: AssigneeProps) {
  const { assignee, onAssign, editing, deleting, readOnly } = props;
  const assigneeInputRef = React.useRef<HTMLInputElement>();

  const [editAssignee, setEditAssignee] = React.useState(assignee);

  React.useEffect(() => {
    setEditAssignee(assignee);
  }, [assignee]);

  function onAssigneeConfirmed() {
    assigneeInputRef.current?.blur();
    if (editAssignee !== assignee) {
      onAssign(editAssignee);
    }
  }

  return (
    <div className="assignee-container">
      <div className="label">assigned to</div>
      <input
        className="assignee"
        type="text"
        value={editAssignee}
        onChange={onChange(setEditAssignee)}
        onBlur={onAssigneeConfirmed}
        onKeyDown={onKeys('Enter', onAssigneeConfirmed)}
        maxLength={MAX_ASSIGNEE_LENGTH}
        disabled={readOnly || editing || deleting}
        readOnly={readOnly || editing || deleting}
        data-testid="actionItem-assignee"
        ref={assigneeInputRef}
      />
      <FloatingCharacterCountdown
        characterCount={editAssignee.length}
        charsAreRunningOutThreshold={MAX_ASSIGNEE_LENGTH / 2}
        maxCharacterCount={MAX_ASSIGNEE_LENGTH}
      />
    </div>
  );
}

type DateCreatedProps = {
  date: string;
  disabled?: boolean;
  className?: string;
};

export function DateCreated(props: DateCreatedProps) {
  const { date, className, disabled = false } = props;

  return (
    <div
      className={classnames('column-item-button date-created', className, { disabled })}
      data-testid="actionItem-dateCreated"
    >
      <div className="date-created-header">created</div>
      <div className="date-created-value">{moment(date).format('MMM Do')}</div>
    </div>
  );
}
