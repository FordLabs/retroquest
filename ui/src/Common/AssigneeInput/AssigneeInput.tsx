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
import classNames from 'classnames';

import { onKeys } from '../../Utils/EventUtils';
import FloatingCharacterCountdown from '../FloatingCharacterCountdown/FloatingCharacterCountdown';

import './AssigneeInput.scss';

const MAX_ASSIGNEE_LENGTH = 50;

interface Props {
	assignee: string;
	onAssign?: (assignee: string) => void;
	disabled?: boolean;
	readOnly?: boolean;
}

function AssigneeInput(props: Readonly<Props>) {
	const { assignee = '', onAssign, disabled, readOnly } = props;
	const assigneeInputRef = useRef<HTMLInputElement>(null);

	const [editAssignee, setEditAssignee] = useState<string>(assignee ?? '');

	useEffect(() => {
		setEditAssignee(assignee ?? '');
	}, [assignee]);

	function handleEnter() {
		assigneeInputRef.current?.blur();
	}

	function onAssigneeConfirmed() {
		if (onAssign && editAssignee !== assignee) {
			onAssign(editAssignee);
		}
	}

	return (
		<div className={classNames('assignee-container', { opacity: disabled })}>
			<label className="label">
				assigned to
				<input
					className="assignee"
					type="text"
					value={editAssignee}
					onChange={(event) => setEditAssignee(event.target.value)}
					onBlur={onAssigneeConfirmed}
					onKeyDown={onKeys('Enter', handleEnter)}
					maxLength={MAX_ASSIGNEE_LENGTH}
					disabled={disabled}
					readOnly={readOnly}
					data-testid="assigneeInput"
					ref={assigneeInputRef}
				/>
				<FloatingCharacterCountdown
					characterCount={editAssignee.length}
					charsAreRunningOutThreshold={MAX_ASSIGNEE_LENGTH / 2}
					maxCharacterCount={MAX_ASSIGNEE_LENGTH}
				/>
			</label>
		</div>
	);
}

export default AssigneeInput;
