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

import React, { createRef } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { PrimaryButton } from '../Common/Buttons/Button';
import Modal, { ModalMethods } from '../Common/Modal/Modal';

export default {
	title: 'components/Modal',
	component: Modal,
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof Modal> = () => {
	const modalRef = createRef<ModalMethods>();
	const noEscapeRef = createRef<ModalMethods>();
	const noBackdropRef = createRef<ModalMethods>();

	return (
		<>
			<div
				style={{
					display: 'inline-flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					height: '180px',
				}}
			>
				<PrimaryButton onClick={() => modalRef.current?.show()}>
					Show Modal
				</PrimaryButton>
				<PrimaryButton onClick={() => noEscapeRef.current?.show()}>
					Show No Escape Modal
				</PrimaryButton>
				<PrimaryButton onClick={() => noBackdropRef.current?.show()}>
					Show No Backdrop Modal
				</PrimaryButton>
			</div>

			<Modal ref={modalRef}>
				<div style={{ color: 'white' }}>This is some modal content</div>
			</Modal>

			<Modal ref={noEscapeRef} hideOnEscape={false}>
				<div style={{ color: 'white' }}>
					This modal cannot be closed with escape
				</div>
			</Modal>

			<Modal ref={noBackdropRef} hideOnBackdropClick={false}>
				<div style={{ color: 'white' }}>
					This modal cannot be close by clicking the backdrop
				</div>
			</Modal>
		</>
	);
};

export const Example = Template.bind({});
