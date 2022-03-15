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

import ActionItemModal from '../App/Team/Retro/ActionItemsColumn/ActionItemModal/ActionItemModal';
import { PrimaryButton } from '../Common/Buttons/Button';
import { ModalMethods } from '../Common/Modal/Modal';
import Action from '../Types/Action';

export default {
	title: 'components/ActionItemModal',
	component: ActionItemModal,
} as ComponentMeta<typeof ActionItemModal>;

const testAction: Action = {
	id: 0,
	task: 'Finish this react migration',
	assignee: 'FordLabs',
	completed: false,
	dateCreated: '2021-08-12',
	archived: false,
};

const Template: ComponentStory<typeof ActionItemModal> = () => {
	const [action] = useState(testAction);

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
			<ActionItemModal action={action} ref={modalRef} />
			<PrimaryButton onClick={() => readOnlyModalRef.current?.show()}>
				Show Readonly Modal
			</PrimaryButton>
			<ActionItemModal readOnly={true} action={action} ref={readOnlyModalRef} />
		</>
	);
};

export const Example = Template.bind({});
