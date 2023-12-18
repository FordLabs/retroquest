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
import ButtonPrimary from 'Common/ButtonPrimary/ButtonPrimary';
import ThemedCheckboxIcon from 'Common/ThemedCheckboxIcon/ThemedCheckboxIcon';
import { useSetRecoilState } from 'recoil';
import { ModalContentsState } from 'State/ModalContentsState';

import useEnvironmentConfig from '../../../../../../../Hooks/useEnvironmentConfig';

import './EmailSentConfirmation.scss';

interface Props {
	paragraph1: string;
}

function EmailSentConfirmation(props: Readonly<Props>) {
	const { paragraph1 } = props;

	const setModalContents = useSetRecoilState(ModalContentsState);

	const environmentConfig = useEnvironmentConfig();

	const closeModal = () => setModalContents(null);

	return (
		<div className="email-sent-confirmation">
			<div className="email-sent-confirmation-title">Check your Mail!</div>
			<div className="paragraph-1-container">
				<ThemedCheckboxIcon />
				<p className="paragraph-1">{paragraph1}</p>
			</div>
			<p className="paragraph-2">
				If an email doesn’t show up soon, check your spam folder. We sent it
				from {environmentConfig?.email_from_address}.
			</p>
			<ButtonPrimary onClick={closeModal}>Close</ButtonPrimary>
		</div>
	);
}

export default EmailSentConfirmation;
