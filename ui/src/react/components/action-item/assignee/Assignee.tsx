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
import { useEffect, useRef, useState } from 'react';

import { onChange, onKeys } from '../../../utils/EventUtils';
import FloatingCharacterCountdown from '../../floating-character-countdown/FloatingCharacterCountdown';

import './Assignee.scss';

const MAX_ASSIGNEE_LENGTH = 50;

type AssigneeProps = {
  assignee: string;
  onAssign: (assignee: string) => void;
  editing?: boolean;
  deleting?: boolean;
  readOnly?: boolean;
};

function Assignee(props: AssigneeProps) {
  const { assignee = '', onAssign, editing, deleting, readOnly } = props;
  const assigneeInputRef = useRef<HTMLInputElement>();

  const [editAssignee, setEditAssignee] = useState<string>(assignee || '');

  useEffect(() => {
    setEditAssignee(assignee || '');
  }, [assignee]);

  function onAssigneeConfirmed() {
    assigneeInputRef.current?.blur();
    if (editAssignee !== assignee) {
      onAssign(editAssignee);
    }
  }

  return (
    <div className="assignee-container">
      <label className="label">
        assigned to
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
      </label>
      <FloatingCharacterCountdown
        characterCount={editAssignee.length}
        charsAreRunningOutThreshold={MAX_ASSIGNEE_LENGTH / 2}
        maxCharacterCount={MAX_ASSIGNEE_LENGTH}
      />
    </div>
  );
}

export default Assignee;
