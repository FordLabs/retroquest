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

import React, { useEffect, useRef } from 'react';
import { A11yDialog } from 'react-a11y-dialog';
import { useRecoilValue } from 'recoil';

import {
	ModalContents,
	ModalContentsState,
} from '../../State/ModalContentsState';

import './ModalDialog.scss';

function ModalDialog() {
	const modalContents = useRecoilValue<ModalContents | null>(
		ModalContentsState
	);
	const dialogRef = useRef<{ show: Function; hide: Function }>();

	useEffect(() => {
		if (modalContents) {
			dialogRef.current?.show();
		} else {
			dialogRef.current?.hide();
		}
	}, [modalContents]);

	return (
		<A11yDialog
			id="modal-container"
			classNames={{
				container: 'modal-container',
				overlay: 'modal-overlay',
				dialog: 'modal-content',
				title: 'modal-title',
				closeButton: 'modal-close-button',
			}}
			title={modalContents?.title}
			titleId="modal-title"
			dialogRef={(dialog) => (dialogRef.current = dialog)}
		>
			{modalContents?.form}
		</A11yDialog>
	);
}

export default ModalDialog;
