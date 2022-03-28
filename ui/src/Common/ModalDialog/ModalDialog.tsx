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

import React, { useCallback, useEffect } from 'react';
import { useA11yDialog } from 'react-a11y-dialog';
import { useRecoilState } from 'recoil';

import {
	ModalContents,
	ModalContentsState,
} from '../../State/ModalContentsState';

import './ModalDialog.scss';

function ModalDialog() {
	const [modalContents, setModalContents] =
		useRecoilState<ModalContents | null>(ModalContentsState);

	const [modalInstance, attr] = useA11yDialog({
		id: 'modal-container',
		title: modalContents?.title,
	});

	const clearModalContents = useCallback(
		() => setModalContents(null),
		[setModalContents]
	);

	useEffect(() => {
		if (modalContents) {
			modalInstance?.show();
		} else {
			modalInstance?.hide();
			clearModalContents();
		}
	}, [clearModalContents, modalContents, modalInstance]);

	return (
		<div {...attr.container} className="modal-container">
			<div
				{...attr.overlay}
				className="modal-overlay"
				data-testid="modalOverlay"
				onClick={clearModalContents}
			/>
			<div
				{...attr.dialog}
				className={`modal-content ${
					modalContents?.superSize ? 'super-size' : ''
				}`}
			>
				<p {...attr.title} className="modal-title">
					{modalContents?.title}
				</p>
				{modalContents?.component}
				<button
					{...attr.closeButton}
					className="modal-close-button"
					aria-label="Close Modal"
					onClick={clearModalContents}
				>
					<i className="fas fa-close close-icon" aria-hidden />
				</button>
			</div>
		</div>
	);
}

export default ModalDialog;
