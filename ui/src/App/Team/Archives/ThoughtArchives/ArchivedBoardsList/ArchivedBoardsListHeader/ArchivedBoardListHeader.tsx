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
import React, { useState } from 'react';
import classnames from 'classnames';
import CheckboxButton from 'Common/ColumnItemButtons/CheckboxButton/CheckboxButton';

import './ArchivedBoardListHeader.scss';

export enum SortOrder {
	DESC = 'DESC',
	ASC = 'ASC',
}

interface Props {
	onDateClick(sortOrder: SortOrder): void;
	onSelectAllClick(): void;
	areAllSelected?: boolean;
}

function ArchivedBoardListHeader(props: Props) {
	const { onDateClick, onSelectAllClick, areAllSelected = false } = props;

	const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC);

	function handleDateSort() {
		const newSortOrder =
			sortOrder === SortOrder.DESC ? SortOrder.ASC : SortOrder.DESC;

		setSortOrder(newSortOrder);
		onDateClick(newSortOrder);
	}

	return (
		<div className="list-header">
			<CheckboxButton
				testId="selectAll"
				disableTooltips
				onClick={onSelectAllClick}
				checked={areAllSelected}
				className="select-all"
			/>
			<button
				className={classnames('sort-button', {
					'selected-asc': sortOrder === SortOrder.ASC,
					'selected-desc': sortOrder === SortOrder.DESC,
				})}
				onClick={handleDateSort}
			>
				Date
			</button>
		</div>
	);
}
export default ArchivedBoardListHeader;
