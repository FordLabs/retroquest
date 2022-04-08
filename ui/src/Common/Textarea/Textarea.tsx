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

import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import classnames from 'classnames';

import { onKeys } from '../../Utils/EventUtils';
import FloatingCharacterCountdown from '../FloatingCharacterCountdown/FloatingCharacterCountdown';

import './Textarea.scss';

const MAX_LENGTH = 255;

interface Props {
	initialValue?: string;
	onEnter?: (value: string, event: KeyboardEvent<HTMLTextAreaElement>) => void;
	onChange: (value: string) => void;
	className?: string;
}

function Textarea(props: Props) {
	const {
		initialValue,
		onEnter = () => undefined,
		onChange,
		className,
	} = props;

	const [editValue, setEditValue] = useState(initialValue || '');

	const textAreaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		resizeTextArea();
	}, [editValue, initialValue]);

	useEffect(() => {
		setEditValue(initialValue || '');
		textAreaRef.current?.focus();
		textAreaRef.current?.select();
	}, [initialValue]);

	function resizeTextArea() {
		const textArea = textAreaRef.current;
		if (textArea) {
			textArea.style.height = textArea.scrollHeight + 'px';
		}
	}
	function onKeypressEnter(event: KeyboardEvent<HTMLTextAreaElement>) {
		if (!event.shiftKey) onEnter(editValue.trim(), event);
	}

	return (
		<div className={classnames('text-area', className)}>
			<textarea
				aria-label="Text Area"
				data-testid="textareaField"
				className="text-area-field"
				ref={textAreaRef}
				value={editValue}
				onChange={(event) => {
					setEditValue(event.target.value);
					onChange(event.target.value);
				}}
				onKeyDown={onKeys('Enter', onKeypressEnter)}
				maxLength={MAX_LENGTH}
			/>
			<FloatingCharacterCountdown
				characterCount={editValue.length}
				charsAreRunningOutThreshold={50}
				maxCharacterCount={MAX_LENGTH}
			/>
		</div>
	);
}

export default Textarea;
