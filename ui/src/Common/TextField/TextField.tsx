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

import React, { HTMLAttributes, useState } from 'react';
import classnames from 'classnames';

import Topic from '../../Types/Topic';
import { onKeys } from '../../Utils/EventUtils';
import FloatingCharacterCountdown from '../FloatingCharacterCountdown/FloatingCharacterCountdown';

import './TextField.scss';

export interface TextFieldProps extends HTMLAttributes<HTMLSpanElement> {
	type: Topic;
	placeholder: string;
	handleSubmission: (string: string) => void;
}

const maxCharacterCount = 255;

export default function TextField(props: TextFieldProps): JSX.Element {
	const { placeholder, type, handleSubmission, ...labelProps } = props;

	const [text, setText] = useState('');

	return (
		<label {...labelProps} className={classnames('text-field', type)}>
			<input
				type="text"
				className="text-input"
				placeholder={placeholder}
				maxLength={maxCharacterCount}
				value={text}
				onChange={(event) => setText(event.target.value)}
				onKeyPress={onKeys('Enter', () => {
					handleSubmission(text);
					setText('');
				})}
			/>
			<FloatingCharacterCountdown
				maxCharacterCount={maxCharacterCount}
				charsAreRunningOutThreshold={50}
				characterCount={text.length}
			/>
		</label>
	);
}
