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

import ThoughtItemWithAddAction from '../App/Team/Retro/ThoughtsColumn/ThoughtItemWithAddAction/ThoughtItemWithAddAction';
import { ThoughtsState } from '../State/ThoughtsState';
import Thought from '../Types/Thought';
import Topic from '../Types/Topic';

export default {
	title: 'components/ThoughtItemWithAddAction',
	component: ThoughtItemWithAddAction,
} as ComponentMeta<typeof ThoughtItemWithAddAction>;

const thought: Thought = {
	id: 0,
	discussed: false,
	hearts: 0,
	message:
		"If elevators hadn't been invented, all the CEOs and" +
		'important people would have their offices on the first floor as a sign of status.',
	columnId: 0,
};

const Template: ComponentStory<typeof ThoughtItemWithAddAction> = () => {
	return (
		<RecoilRoot
			initializeState={({ set }) => {
				set(ThoughtsState, [thought]);
			}}
		>
			<div style={{ backgroundColor: 'white', width: '450px' }}>
				<ThoughtItemWithAddAction type={Topic.HAPPY} thoughtId={thought.id} />
			</div>
		</RecoilRoot>
	);
};

export const Example = Template.bind({});
