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

import Action from '../../Types/Action';
import Assignee from '../Assignee/Assignee';
import { DateCreated } from '../DateCreated/DateCreated';

import './ActionItemDisplayOnly.scss';

interface Props {
	actionItem: Action;
}

function ActionItemDisplayOnly(props: Props) {
	const { actionItem } = props;

	return (
		<div className="action-item-display-only">
			<div className="action-item-display-only-task">{actionItem.task}</div>
			<div className="action-item-display-only-bottom">
				<DateCreated date={actionItem.dateCreated} disabled />
				<Assignee assignee={actionItem.assignee} readOnly />
			</div>
		</div>
	);
}

export default ActionItemDisplayOnly;