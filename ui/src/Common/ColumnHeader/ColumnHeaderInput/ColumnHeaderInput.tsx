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

import { onEachKey } from '../../../Utils/EventUtils';
import FloatingCharacterCountdown from '../../FloatingCharacterCountdown/FloatingCharacterCountdown';

import './ColumnHeaderInput.scss';

const MAX_TITLE_LENGTH = 16;
const ALMOST_OUT_OF_CHARACTERS_THRESHOLD = 5;

interface Props {
	initialTitle: string;
	updateTitle(title: string): void;
	setEditing(editing: boolean): void;
}

function ColumnHeaderInput(props: Readonly<Props>) {
	const { initialTitle, updateTitle, setEditing } = props;

	const [value, setValue] = useState(initialTitle);

	const handleKeyDown = onEachKey({
		Enter: () => updateTitle(value),
		Escape: () => setEditing(false),
	});

	return (
		<>
			<input
				type="text"
				className="column-header-input"
				data-testid="column-input"
				maxLength={MAX_TITLE_LENGTH}
				value={value}
				onChange={(event) => setValue(event.target.value)}
				onBlur={() => updateTitle(value)}
				onKeyDown={handleKeyDown}
				/* eslint-disable-next-line jsx-a11y/no-autofocus */
				autoFocus={true}
				onFocus={(event: any) => event.target.select()}
			/>
			<FloatingCharacterCountdown
				characterCount={value.length}
				maxCharacterCount={MAX_TITLE_LENGTH}
				charsAreRunningOutThreshold={ALMOST_OUT_OF_CHARACTERS_THRESHOLD}
			/>
		</>
	);
}

export default ColumnHeaderInput;
