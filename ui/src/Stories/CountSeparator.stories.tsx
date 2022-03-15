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

import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import CountSeparator from '../Common/CountSeparator/CountSeparator';

export default {
	title: 'components/CountSeparator',
	component: CountSeparator,
} as ComponentMeta<typeof CountSeparator>;

const Template: ComponentStory<typeof CountSeparator> = () => (
	<span
		style={{
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between',
			flexBasis: 800,
		}}
	>
		<CountSeparator style={{ marginBottom: '20px' }} count={10} />
		<CountSeparator style={{ marginBottom: '20px' }} count={10000} />
		<CountSeparator style={{ marginBottom: '20px' }} count={892734977952345} />
	</span>
);

export const CountSeparatorExample = Template.bind({});
