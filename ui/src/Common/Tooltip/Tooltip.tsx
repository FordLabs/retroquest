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

import React, { PropsWithChildren, useEffect, useRef } from 'react';

import './Tooltip.scss';

export type Props = PropsWithChildren<unknown>;

export default function Tooltip(props: Readonly<Props>): React.ReactElement {
	const { children } = props;
	const ref = useRef<HTMLElement>(null);

	useEffect(() => {
		const parent = ref.current?.parentElement;

		if (parent) {
			const parentStyle = window.getComputedStyle(parent);
			const parentStylePosition = parentStyle.getPropertyValue('position');

			if (parentStylePosition === 'static') {
				parent.style.position = 'relative';
			}

			return () => {
				parent.style.position = parentStylePosition;
			};
		}
	}, []);

	return (
		<span className="tooltip" ref={ref}>
			{children}
		</span>
	);
}
