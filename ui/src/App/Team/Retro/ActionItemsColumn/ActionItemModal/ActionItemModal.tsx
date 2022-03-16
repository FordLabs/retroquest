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

import React, { forwardRef, Ref } from 'react';

import Modal, { ModalMethods } from '../../../../../Common/Modal/Modal';
import Action from '../../../../../Types/Action';
import ActionItem from '../ActionItem/ActionItem';

import './ActionItemModal.scss';

interface ActionItemModalProps {
	action: Action;
	readOnly?: boolean;
}

function ActionItemModal(props: ActionItemModalProps, ref: Ref<ModalMethods>) {
	const { action, readOnly } = props;

	return (
		<Modal ref={ref} className="action-item-modal" testId="actionItemModal">
			<ActionItem action={action} readOnly={readOnly} disableAnimations />
		</Modal>
	);
}

export default forwardRef<ModalMethods, ActionItemModalProps>(ActionItemModal);