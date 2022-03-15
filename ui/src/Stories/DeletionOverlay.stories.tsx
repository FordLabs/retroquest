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
import { ComponentMeta, ComponentStory } from '@storybook/react';

import DeletionOverlay from '../Common/ColumnItem/DeletionOverlay/DeletionOverlay';

export default {
	title: 'components/DeletionOverlay',
	component: DeletionOverlay,
} as ComponentMeta<typeof DeletionOverlay>;

const Template: ComponentStory<typeof DeletionOverlay> = () => {
	const [show, setShow] = React.useState(false);

	const onConfirm = () => {
		alert('deletion confirmed');
		setShow(false);
	};

	const onCancel = () => {
		alert('deletion cancelled');
		setShow(false);
	};

	return (
		<span
			style={{
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-around',
				flexShrink: 1,
			}}
		>
			<span
				style={{
					width: 300,
					height: 100,
					position: 'relative',
				}}
			>
				{show ? (
					<DeletionOverlay onConfirm={onConfirm} onCancel={onCancel}>
						Delete item?
					</DeletionOverlay>
				) : (
					<button onClick={() => setShow(true)}>Click to delete</button>
				)}
			</span>
		</span>
	);
};

export const Example = Template.bind({});
