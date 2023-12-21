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

import React, { ReactElement } from 'react';
import classNames from 'classnames';

import './FloatingCharacterCountdown.scss';

interface Props {
	characterCount: number;
	maxCharacterCount?: number;
	charsAreRunningOutThreshold?: number;
}

export default function FloatingCharacterCountdown(
	props: Readonly<Props>
): ReactElement {
	const {
		maxCharacterCount = 255,
		charsAreRunningOutThreshold = 20,
		characterCount = 0,
	} = props;

	const charactersRemaining = maxCharacterCount - characterCount;
	const charactersRemainingHaveRunOut = charactersRemaining <= 0;
	const charactersRemainingAreBelowThreshold =
		charactersRemaining < charsAreRunningOutThreshold;
	const charactersRemainingAreAboutToRunOut =
		charactersRemainingAreBelowThreshold && !charactersRemainingHaveRunOut;

	const className = classNames('floating-character-countdown', {
		visible: characterCount,
		'display-warning-text': charactersRemainingAreAboutToRunOut,
		'display-error-text': charactersRemainingHaveRunOut,
	});

	return <span className={className}>{charactersRemaining}</span>;
}
