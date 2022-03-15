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

import React, { useRef, useState } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import RetroItemModal from '../App/Team/Retro/ThoughtColumn/RetroItemModal/RetroItemModal';
import { PrimaryButton } from '../Common/Buttons/Button';
import { ModalMethods } from '../Common/Modal/Modal';
import Thought from '../Types/Thought';
import Topic, { ThoughtTopic } from '../Types/Topic';

export default {
	title: 'components/RetroItemModal',
	component: RetroItemModal,
} as ComponentMeta<typeof RetroItemModal>;

const testThought: Thought = {
	id: 0,
	discussed: false,
	hearts: 0,
	message:
		"If elevators hadn't been invented, all the CEOs and" +
		'important people would have their offices on the first floor as a sign of status.',
	topic: Topic.HAPPY,
};

const Template: ComponentStory<typeof RetroItemModal> = () => {
	const [thought] = useState(testThought);
	const [type, setType] = useState<ThoughtTopic>(Topic.HAPPY);

	const modalRef = useRef<ModalMethods>(null);
	const readOnlyModalRef = useRef<ModalMethods>(null);

	return (
		<>
			<PrimaryButton
				onClick={() => modalRef.current?.show()}
				style={{ marginBottom: '20px' }}
			>
				Show Modal
			</PrimaryButton>
			<RetroItemModal type={Topic.HAPPY} thought={thought} ref={modalRef} />
			<PrimaryButton
				onClick={() => {
					setType((currentType) => {
						switch (currentType) {
							case Topic.HAPPY:
								return Topic.CONFUSED;
							case Topic.CONFUSED:
								return Topic.UNHAPPY;
							default:
								return Topic.HAPPY;
						}
					});
					readOnlyModalRef.current?.show();
				}}
			>
				Show Readonly Modal
			</PrimaryButton>
			<RetroItemModal
				readOnly={true}
				type={type}
				thought={thought}
				ref={readOnlyModalRef}
			/>
		</>
	);
};

export const Example = Template.bind({});
