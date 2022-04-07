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

import React, { HTMLAttributes, useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import { useSetRecoilState } from 'recoil';

import { DisableDraggableState } from '../../../State/DisableDraggableState';
import { onKeys } from '../../../Utils/EventUtils';
import FloatingCharacterCountdown from '../../FloatingCharacterCountdown/FloatingCharacterCountdown';

import './EditableText.scss';

const MAX_LENGTH = 255;

const NO_OP = () => undefined;

type EditableTextProps = HTMLAttributes<HTMLDivElement> & {
	value: string;
	editing: boolean;
	selectable?: boolean;
	disabled?: boolean;
	onConfirm?: (value: string) => void;
	onCancel?: () => void;
	onSelect?: () => void;
};

function EditableText(props: EditableTextProps) {
	const {
		value,
		editing,
		selectable = false,
		disabled = false,
		onConfirm = NO_OP,
		onCancel = NO_OP,
		onSelect = NO_OP,
		className,
		...divProps
	} = props;

	const setDisableDraggable = useSetRecoilState(DisableDraggableState);
	const [editValue, setEditValue] = useState(value);

	const textAreaRef = useRef<HTMLTextAreaElement>(null);

	const canSelect = selectable && !disabled && !editing;

	useEffect(() => {
		resizeTextArea();
	}, [value, editValue, textAreaRef?.current?.scrollHeight]);

	useEffect(() => {
		if (editing) {
			setEditValue(value);
			const currentTextArea = textAreaRef.current;
			currentTextArea?.focus();
			currentTextArea?.select();

			const escapeListener = onKeys<KeyboardEvent>('Escape', onCancel);
			document.addEventListener('keydown', escapeListener);

			return () => {
				currentTextArea?.setSelectionRange(0, 0);
				document.removeEventListener('keydown', escapeListener);
			};
		}
	}, [editing, onCancel, value]);

	useEffect(() => {
		setDisableDraggable(editing);
	}, [editing, setDisableDraggable]);

	function resizeTextArea() {
		const textArea = textAreaRef.current;
		if (textArea) {
			textArea.style.height = '';
			textArea.style.height = textArea.scrollHeight + 'px';
		}
	}

	function onEditConfirmed() {
		onConfirm(editValue);
	}

	return (
		<div
			{...divProps}
			data-testid="editableText-container"
			className={classnames('editable-text-container', className, { disabled })}
		>
			<textarea
				aria-label="Text Area"
				data-testid="editableText"
				className="text-area"
				ref={textAreaRef}
				value={editing ? editValue : value}
				onChange={(event) => setEditValue(event.target.value)}
				onKeyDown={onKeys('Enter', onEditConfirmed)}
				maxLength={MAX_LENGTH}
				readOnly={!editing}
				disabled={!editing}
			/>
			{editing && (
				<FloatingCharacterCountdown
					characterCount={editValue.length}
					charsAreRunningOutThreshold={50}
					maxCharacterCount={MAX_LENGTH}
				/>
			)}
			{canSelect && (
				<button
					className="editable-text-select"
					data-testid="editableText-select"
					onClick={canSelect ? onSelect : undefined}
					aria-label={value}
				/>
			)}
		</div>
	);
}

export default EditableText;
