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
import { RecoilRoot } from 'recoil';

import ThoughtItem from '../App/Team/Retro/ThoughtsColumn/ThoughtItem/ThoughtItem';
import { ThoughtsState } from '../State/ThoughtsState';
import Thought from '../Types/Thought';
import Topic from '../Types/Topic';

export default {
	title: 'components/ThoughtItem',
	component: ThoughtItem,
} as ComponentMeta<typeof ThoughtItem>;

const thought1: Thought = {
	id: 1,
	discussed: false,
	hearts: 0,
	message:
		"If elevators hadn't been invented, all the CEOs and" +
		'important people would have their offices on the first floor as a sign of status.',
	topic: Topic.HAPPY,
	columnId: 10,
};

const thought2: Thought = {
	id: 2,
	discussed: true,
	hearts: 0,
	message:
		"If elevators hadn't been invented, all the CEOs and" +
		'important people would have their offices on the first floor as a sign of status.',
	topic: Topic.HAPPY,
	columnId: 10,
};

const Template: ComponentStory<typeof ThoughtItem> = () => {
	return (
		<RecoilRoot
			initializeState={({ set }) => {
				set(ThoughtsState, [thought1, thought2]);
			}}
		>
			<div style={{ width: '400px', marginBottom: '20px' }}>
				<ThoughtItem thoughtId={thought1.id} type={Topic.HAPPY} />
			</div>
			<div style={{ width: '400px' }}>
				<ThoughtItem
					disableButtons={true}
					thoughtId={thought2.id}
					type={Topic.UNHAPPY}
				/>
			</div>
		</RecoilRoot>
	);
};

export const Example = Template.bind({});
