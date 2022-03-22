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

import { KeyboardEvent as ReactKeyboardEvent } from 'react';

type KeyEvent = KeyboardEvent | ReactKeyboardEvent;

export function onKeys<T extends KeyEvent>(
	keys: string | string[],
	callback: (event: T) => void
): (event: T) => void {
	const listOfKeys = Array.isArray(keys) ? keys : [keys];

	return (e) => {
		if (listOfKeys.includes(e.key)) {
			callback(e);
		}
	};
}

export function onEachKey<T extends KeyEvent>(
	keyMap: Record<string, (event: T) => void>
): (event: T) => void {
	return (e) => {
		const callback = keyMap[e.key];
		if (callback) {
			callback(e);
		}
	};
}
