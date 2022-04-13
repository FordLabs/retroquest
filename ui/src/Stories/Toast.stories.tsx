/*
 * Copyright (c) 2022. Ford Motor Company
 *  All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import * as React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Toast, ToastLevel } from '../Common/Toast/Toast';

export default {
	title: 'components/Toast',
	component: Toast,
} as ComponentMeta<typeof Toast>;

const Template: ComponentStory<typeof Toast> = () => {
	const handleClick = () => {
		alert('close clicked');
	};

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
			<Toast
				title="Uh oh..."
				handleClose={handleClick}
				toastLevel={ToastLevel.ERROR}
			>
				<p style={{ margin: 0 }}>This is an error!</p>
			</Toast>
			<Toast
				title="Heads up!"
				handleClose={handleClick}
				toastLevel={ToastLevel.WARNING}
			>
				<p style={{ margin: 0 }}>This is a warning!</p>
			</Toast>
			<Toast
				title="Just so you know"
				handleClose={handleClick}
				toastLevel={ToastLevel.INFO}
			>
				<p style={{ margin: 0 }}>This is an info!</p>
			</Toast>
		</div>
	);
};

export const Example = Template.bind({});
