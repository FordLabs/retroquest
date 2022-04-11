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

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import {
	CancelButton,
	ColumnItemButtonGroup,
	ConfirmButton,
} from 'Common/ColumnItemButtons';
import Textarea from 'Common/Textarea/Textarea';
import { useSetRecoilState } from 'recoil';
import { DisableDraggableState } from 'State/DisableDraggableState';
import { onKeys } from 'Utils/EventUtils';

import './EditColumnItem.scss';

interface Props {
	initialValue: string | undefined;
	onConfirm: (value: string) => void;
	onCancel: () => void;
	height?: number;
	children?: ReactNode;
	className?: string;
}

function EditColumnItem(props: Props) {
	const {
		onConfirm,
		onCancel,
		height,
		children,
		className,
		initialValue = '',
	} = props;
	const [editedValue, setEditedValue] = useState<string>(initialValue);
	const submitButtonRef = useRef<HTMLButtonElement>(null);
	const setDisableDraggable = useSetRecoilState(DisableDraggableState);

	useEffect(() => {
		const escapeListener = onKeys('Escape', onCancel);
		document.addEventListener('keydown', escapeListener);

		return () => {
			document.removeEventListener('keydown', escapeListener);
		};
	}, [onCancel]);

	useEffect(() => {
		setDisableDraggable(true);

		return () => setDisableDraggable(false);
	}, [setDisableDraggable]);

	return (
		<div
			className={classNames('edit-column-item thought-item', className)}
			data-testid="editColumnItem"
			style={{ minHeight: height }}
		>
			<Textarea
				initialValue={initialValue}
				onChange={setEditedValue}
				onEnter={() => onConfirm(editedValue)}
			/>
			{children}
			<ColumnItemButtonGroup>
				<CancelButton onClick={onCancel}>Cancel</CancelButton>
				<ConfirmButton
					onClick={() => onConfirm(editedValue)}
					ref={submitButtonRef}
				>
					Save!
				</ConfirmButton>
			</ColumnItemButtonGroup>
		</div>
	);
}

export default EditColumnItem;
