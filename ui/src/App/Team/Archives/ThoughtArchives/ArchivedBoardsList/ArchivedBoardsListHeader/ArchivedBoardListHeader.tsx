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

enum SortState {
	DateDescending,
	DateAscending,
	CountDescending,
	CountAscending,
}

export enum SortOrder {
	DESC = 'DESC',
	ASC = 'ASC',
}

interface Props {
	onDateClick(sortOrder: SortOrder): void;
	onHashClick(sortOrder: SortOrder): void;
}

function ArchivedBoardListHeader(props: Props) {
	const { onDateClick, onHashClick } = props;

	const [sortState, setSortState] = useState<SortState>(
		SortState.DateDescending
	);

	function handleCountSort() {
		const isDescending = sortState === SortState.CountDescending;
		const thoughtCountSortState = isDescending
			? SortState.CountAscending
			: SortState.CountDescending;

		setSortState(thoughtCountSortState);

		const sortOrder = isDescending ? SortOrder.ASC : SortOrder.DESC;
		onHashClick(sortOrder);
	}

	function handleDateSort() {
		const isDescending = sortState === SortState.DateDescending;
		const dateSortState = isDescending
			? SortState.DateAscending
			: SortState.DateDescending;

		setSortState(dateSortState);

		const sortOrder = isDescending ? SortOrder.ASC : SortOrder.DESC;
		onDateClick(sortOrder);
	}

	return (
		<div className="list-header">
			<button
				className={classnames('sort-button', {
					'selected-asc': sortState === SortState.CountAscending,
					'selected-desc': sortState === SortState.CountDescending,
				})}
				onClick={handleCountSort}
			>
				#
			</button>
			<button
				className={classnames('sort-button', {
					'selected-asc': sortState === SortState.DateAscending,
					'selected-desc': sortState === SortState.DateDescending,
				})}
				onClick={handleDateSort}
			>
				Date
			</button>
			<div className="spacer" />
		</div>
	);
}
export default ArchivedBoardListHeader;
