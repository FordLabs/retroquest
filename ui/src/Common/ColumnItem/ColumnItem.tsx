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

import React, {
	ComponentPropsWithoutRef,
	ReactNode,
	useEffect,
	useRef,
	useState,
} from 'react';
import classnames from 'classnames';

import Topic from '../../Types/Topic';
import {
	CheckboxButton,
	ColumnItemButtonGroup,
	DeleteButton,
	EditButton,
} from '../ColumnItemButtons/ColumnItemButtons';
import { useModal } from '../Modal/Modal';

import DeletionOverlay from './DeletionOverlay/DeletionOverlay';
import EditableText from './EditableText/EditableText';

import './ColumnItem.scss';

const NO_OP = () => undefined;

type ColumnItemProps = ComponentPropsWithoutRef<'div'> & {
	type: Topic;
	text: string;
	checked?: boolean;
	readOnly?: boolean;
	onSelect?: () => void;
	onEdit?: (message: string) => void;
	onDelete?: () => void;
	onCheck?: () => void;
	defaultButtons?: boolean;
	customButtons?: (state: { editing: boolean; deleting: boolean }) => ReactNode;
	children?: (state: { editing: boolean; deleting: boolean }) => ReactNode;
};

export default function ColumnItem(props: ColumnItemProps) {
	const {
		type,
		text,
		checked = false,
		readOnly = false,
		onSelect,
		onEdit = NO_OP,
		onDelete = NO_OP,
		onCheck = NO_OP,
		defaultButtons = true,
		customButtons,
		children,
		className,
		...divProps
	} = props;

	const { setHideOnEscape, setHideOnBackdropClick } = useModal();

	const editButtonRef = useRef<HTMLButtonElement>(null);
	const deleteButtonRef = useRef<HTMLButtonElement>(null);

	const [editing, setEditing] = useState<boolean>(false);
	const [deleting, setDeleting] = useState<boolean>(false);

	const canSelect =
		((!editing && !deleting && !checked) || readOnly) && !!onSelect;

	useEffect(() => {
		if (editing || deleting) {
			setHideOnEscape(false);
			setHideOnBackdropClick(false);

			return () => {
				setHideOnEscape(true);
				setHideOnBackdropClick(true);
			};
		}
	}, [setHideOnEscape, editing, deleting]);

	function onEditToggle() {
		return setEditing((editing) => !editing);
	}

	function onEditCanceled() {
		setEditing(false);
		editButtonRef.current?.focus();
	}

	function onEditConfirmed(text: string) {
		onEdit(text);
		setEditing(false);
	}

	function onDeleteStarted() {
		setDeleting(true);
	}

	function onDeleteConfirmed() {
		setDeleting(false);
		onDelete();
	}

	function onDeleteCanceled() {
		setDeleting(false);
		if (deleteButtonRef.current) {
			deleteButtonRef.current.disabled = false;
			deleteButtonRef.current?.focus();
		}
	}

	function onTextSelect() {
		if (canSelect) onSelect();
	}

	return (
		<div
			data-testid="columnItem"
			className={classnames('column-item', type, className, {
				editing,
				deleting,
			})}
			{...divProps}
		>
			<EditableText
				value={text}
				editing={editing}
				selectable={canSelect}
				onConfirm={onEditConfirmed}
				onCancel={onEditCanceled}
				onSelect={onTextSelect}
				className="text-container"
				data-testid="columnItem-textarea"
			/>
			{children && children({ editing, deleting })}
			<ColumnItemButtonGroup>
				{customButtons && customButtons({ editing, deleting })}
				{defaultButtons && (
					<>
						<EditButton
							aria-label="Edit"
							editing={editing}
							onClick={onEditToggle}
							disabled={checked || readOnly || deleting}
							ref={editButtonRef}
						/>
						<DeleteButton
							aria-label="Delete"
							onClick={onDeleteStarted}
							disabled={readOnly || editing || deleting}
							ref={deleteButtonRef}
						/>
						<CheckboxButton
							aria-label="Mark as complete"
							checked={checked}
							onClick={onCheck}
							disabled={readOnly || editing || deleting}
						/>
					</>
				)}
			</ColumnItemButtonGroup>
			{deleting && (
				<DeletionOverlay
					onCancel={onDeleteCanceled}
					onConfirm={onDeleteConfirmed}
				>
					Delete this {type === Topic.ACTION ? 'Action Item' : 'Thought'}?
				</DeletionOverlay>
			)}
		</div>
	);
}
