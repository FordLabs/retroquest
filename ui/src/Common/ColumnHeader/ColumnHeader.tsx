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
import { emojify } from 'Services/EmojiGenerator';
import Topic from 'Types/Topic';

import ColumnHeaderInput from './ColumnHeaderInput/ColumnHeaderInput';
import EditColumnButton from './EditColumnButton/EditColumnButton';
import SortColumnButton from './SortColumnButton/SortColumnButton';

import './ColumnHeader.scss';

interface ColumnHeaderProps extends HTMLAttributes<HTMLDivElement> {
	initialTitle?: string;
	type?: Topic;
	onSort?(sortedState: boolean): void;
	onTitleChange?(title: string): void;
}

function ColumnHeader(props: Readonly<ColumnHeaderProps>): React.ReactElement {
	const {
		initialTitle = '',
		type = '',
		onTitleChange,
		onSort,
		...divProps
	} = props;

	const sortable = useMemo(() => onSort !== undefined, [onSort]);
	const editable = useMemo(() => onTitleChange !== undefined, [onTitleChange]);

	const [title, setTitle] = useState(initialTitle);
	const [editing, setEditing] = useState(false);

	useEffect(() => setTitle(initialTitle), [initialTitle]);

	const updateTitle = (newTitle: string) => {
		setTitle(newTitle);
		setEditing(false);
		if (onTitleChange) onTitleChange(newTitle);
	};

	return (
		<div
			{...divProps}
			className={classNames('column-header', type)}
			data-testid={`columnHeader-${type}`}
		>
			{editing ? (
				<ColumnHeaderInput
					initialTitle={initialTitle}
					updateTitle={updateTitle}
					setEditing={setEditing}
				/>
			) : (
				<>
					<h2 className="column-header-title">{emojify(title)}</h2>
					{sortable && <SortColumnButton title={title} onClick={onSort} />}
					{editable && (
						<EditColumnButton title={title} onClick={() => setEditing(true)} />
					)}
				</>
			)}
		</div>
	);
}

export default ColumnHeader;
