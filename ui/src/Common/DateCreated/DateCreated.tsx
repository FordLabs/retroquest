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
import classnames from 'classnames';
import moment from 'moment';

import './DateCreated.scss';

type DateCreatedProps = {
	date: string;
	disabled?: boolean;
	readOnly?: boolean;
	className?: string;
};

export function DateCreated(props: Readonly<DateCreatedProps>) {
	const { date, className, disabled = false, readOnly = false } = props;

	return (
		<div
			className={classnames('column-item-button date-created', className, {
				disabled,
				'read-only': readOnly,
			})}
			data-testid="dateCreated"
		>
			<div className="date-created-header">created</div>
			<div className="date-created-value">{moment(date).format('MMM Do')}</div>
		</div>
	);
}
