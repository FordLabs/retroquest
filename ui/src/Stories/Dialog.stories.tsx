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

import ModalContentsWrapper from '../Common/ModalContentsWrapper/ModalContentsWrapper';

export default {
	title: 'components/ModalContentsWrapper',
	component: ModalContentsWrapper,
} as ComponentMeta<typeof ModalContentsWrapper>;

const Template: ComponentStory<typeof ModalContentsWrapper> = () => {
	return (
		<ModalContentsWrapper
			title="I am a dialog"
			subtitle="This is the question?"
			buttons={{
				confirm: { text: 'To be', onClick: () => alert('Be') },
				cancel: { text: 'Not to be', onClick: () => alert('Not Be') },
			}}
		/>
	);
};

export const Example = Template.bind({});
