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
	useRef,
	useState,
} from 'react';
import classNames from 'classnames';
import { useRecoilValue } from 'recoil';

import { ModalContentsState } from '../../State/ModalContentsState';
import Topic from '../../Types/Topic';
import {
	CheckboxButton,
	ColumnItemButtonGroup,
	DeleteButton,
	EditButton,
} from '../ColumnItemButtons/ColumnItemButtons';

import DeleteColumnItem from './DeleteColumnItem/DeleteColumnItem';
import EditColumnItem from './EditColumnItem/EditColumnItem';

import './ColumnItem.scss';

const NO_OP = () => undefined;

enum ViewState {
	DELETE = 'delete',
	EDIT = 'edit',
	DEFAULT = 'default',
}

type ColumnItemProps = ComponentPropsWithoutRef<'div'> & {
	type: Topic;
	text: string;
	checked?: boolean;
	disableButtons?: boolean;
	onSelect?: () => void;
	onEdit?: (message: string) => void;
	onDelete?: () => void;
	onCheck?: () => void;
	customButton?: ReactNode;
	children?: ReactNode;
};

function ColumnItem(props: ColumnItemProps) {
	const {
		type,
		text,
		checked = false,
		disableButtons = false,
		onSelect,
		onEdit = NO_OP,
		onDelete = NO_OP,
		onCheck = NO_OP,
		customButton,
		children,
		className,
		...divProps
	} = props;

	const columnItemRef = useRef<HTMLDivElement>(null);

	const modalContents = useRecoilValue(ModalContentsState);
	const [viewState, setViewState] = useState<ViewState>(ViewState.DEFAULT);
	const [columnItemHeight, setColumnItemHeight] = useState<number | undefined>(
		0
	);

	switch (viewState) {
		case ViewState.DELETE:
			return (
				<DeleteColumnItem
					onConfirm={onDelete}
					onCancel={() => setViewState(ViewState.DEFAULT)}
					height={columnItemHeight}
				>
					<>Delete this {type === Topic.ACTION ? 'Action Item' : 'Thought'}?</>
				</DeleteColumnItem>
			);
		case ViewState.EDIT:
			return (
				<EditColumnItem
					initialValue={text}
					onConfirm={(updatedText: string) => {
						onEdit(updatedText);
						setViewState(ViewState.DEFAULT);
					}}
					onCancel={() => setViewState(ViewState.DEFAULT)}
					height={columnItemHeight}
				>
					{children}
				</EditColumnItem>
			);
		default:
			return (
				<div
					data-testid="columnItem"
					className={classNames('column-item', type, className)}
					ref={columnItemRef}
					{...divProps}
				>
					<button
						onClick={onSelect}
						className={classNames('column-item-message-button', {
							opacity: checked,
						})}
						data-testid="columnItemMessageButton"
						disabled={checked || !!modalContents || disableButtons}
					>
						{text}
					</button>
					{children}
					<ColumnItemButtonGroup>
						{customButton}
						<EditButton
							aria-label="Edit"
							onClick={() => setViewState(ViewState.EDIT)}
							disabled={checked || disableButtons}
						/>
						<DeleteButton
							aria-label="Delete"
							onClick={() => {
								setColumnItemHeight(columnItemRef?.current?.clientHeight);
								setViewState(ViewState.DELETE);
							}}
							disabled={disableButtons}
						/>
						<CheckboxButton
							aria-label="Mark as complete"
							checked={checked}
							onClick={onCheck}
							disabled={disableButtons}
						/>
					</ColumnItemButtonGroup>
				</div>
			);
	}
}

export default ColumnItem;
