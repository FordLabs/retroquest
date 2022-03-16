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

import React, { HTMLAttributes, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';

import { emojify } from '../../Services/EmojiGenerator';
import Topic from '../../Types/Topic';
import { onEachKey } from '../../Utils/EventUtils';
import FloatingCharacterCountdown from '../FloatingCharacterCountdown/FloatingCharacterCountdown';
import Tooltip from '../Tooltip/Tooltip';

import './ColumnHeader.scss';

const maxTitleLength = 16;
const almostOutOfCharactersThreshold = 5;

interface ColumnHeaderProps extends HTMLAttributes<HTMLDivElement> {
	initialTitle?: string;
	type?: Topic;
	sortedChanged?: (changed: boolean) => void;
	titleChanged?: (title: string) => void;
}

function ColumnHeader(props: ColumnHeaderProps): JSX.Element {
	const {
		initialTitle = '',
		type = '',
		titleChanged,
		sortedChanged,
		...divProps
	} = props;
	const [title, setTitle] = useState(initialTitle);
	const [editedTitle, setEditedTitle] = useState(initialTitle);
	const sortable = useMemo(() => sortedChanged !== undefined, [sortedChanged]);
	const editable = useMemo(() => titleChanged !== undefined, [titleChanged]);
	const [editing, setEditing] = useState(false);
	const [sorted, setSorted] = useState(false);

	useEffect(() => setTitle(initialTitle), [initialTitle]);

	const updateTitle = (newTitle: string) => {
		setTitle(newTitle);
		setEditing(false);
		if (titleChanged) titleChanged(newTitle);
	};

	const handleBlur = () => {
		updateTitle(editedTitle);
	};

	const handleKeyDown = onEachKey({
		Enter: () => updateTitle(editedTitle),
		Escape: () => setEditing(false),
	});

	const toggleSort = () => {
		const newSorted = !sorted;
		setSorted(newSorted);
		if (sortedChanged) sortedChanged(newSorted);
	};

	const enableEditing = () => {
		setEditedTitle(title);
		setEditing(true);
	};

	const handleInputFocus = (event: any) => event.target.select();

	const getSortedButtonText = (): string => {
		return sorted ? 'Unsort' : 'Sort';
	};

	return (
		<div
			{...divProps}
			className={classNames('column-header', type)}
			data-testid={`columnHeader-${type}`}
		>
			{editing ? (
				<>
					<input
						type="text"
						className="column-input"
						data-testid="column-input"
						maxLength={maxTitleLength}
						value={editedTitle}
						onChange={(event) => setEditedTitle(event.target.value)}
						onBlur={handleBlur}
						onKeyDown={handleKeyDown}
						/* @todo fix this */
						/* eslint-disable-next-line jsx-a11y/no-autofocus */
						autoFocus={true}
						onFocus={handleInputFocus}
					/>
					<FloatingCharacterCountdown
						characterCount={editedTitle.length}
						maxCharacterCount={maxTitleLength}
						charsAreRunningOutThreshold={almostOutOfCharactersThreshold}
					/>
				</>
			) : (
				<>
					<p className="display-text">{emojify(title)}</p>
					{sortable && (
						<button
							className="sort-button"
							onClick={toggleSort}
							aria-label={getSortedButtonText()}
						>
							<span
								aria-hidden
								data-testid="columnHeader-sortButton"
								className={classNames('fas fa-sort-down sort-icon', {
									'sort-icon-translucent': !sorted,
								})}
							/>
							<Tooltip>{getSortedButtonText()}</Tooltip>
						</button>
					)}
					{editable && (
						<button
							className="edit-button"
							onClick={enableEditing}
							aria-label="Edit"
						>
							<i
								role="presentation"
								className="fas fa-pencil-alt"
								aria-hidden="true"
								data-testid="columnHeader-editTitleButton"
							/>
							<Tooltip>Edit</Tooltip>
						</button>
					)}
				</>
			)}
		</div>
	);
}

export default ColumnHeader;
