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

import React from 'react';
import classNames from 'classnames';

import { Column } from '../../../../Types/Column';

import './MobileColumnNav.scss';

interface Props {
	columns: Column[];
	selectedIndex: number;
	setSelectedIndex(index: number): void;
}

function MobileColumnNav(props: Props): JSX.Element {
	const { columns = [], selectedIndex, setSelectedIndex } = props;

	const isSelectedIndex = (index: number): boolean => index === selectedIndex;

	const actionItemIndex = columns.length;

	return (
		<div className="mobile-column-nav">
			{columns.map(({ title, topic }: Column, index) => {
				return (
					<button
						data-testid={`mobileColumnNav-${index}`}
						key={`mobile-column-nav-item-${index}`}
						className={classNames(`nav-button ${topic}-nav-button`, {
							selected: isSelectedIndex(index),
						})}
						onClick={() => setSelectedIndex(index)}
					>
						{title + ' Column'}
					</button>
				);
			})}
			<button
				data-testid={`mobileColumnNav-${columns.length}`}
				className={classNames('nav-button action-nav-button', {
					selected: isSelectedIndex(actionItemIndex),
				})}
				onClick={() => setSelectedIndex(actionItemIndex)}
			>
				Action Items Column
			</button>
		</div>
	);
}

export default MobileColumnNav;
