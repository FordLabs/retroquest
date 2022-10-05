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

import { useState } from 'react';
import Form from 'Common/AuthTemplate/Form/Form';
import InputEmail from 'Common/InputEmail/InputEmail';
import { useSetRecoilState } from 'recoil';
import { ModalContentsState } from 'State/ModalContentsState';

import AddBoardOwnersConfirmationForm from './AddBoardOwnersConfirmationForm/AddBoardOwnersConfirmationForm';

import './AddBoardOwnersForm.scss';

const blankValueWithValidity = { value: '', validity: false };

interface ValueAndValidity {
	value: string;
	validity: boolean;
}

export interface AddBoardOwnersFormProps {
	email1?: string;
	email2?: string;
}

function AddBoardOwnersForm(props: AddBoardOwnersFormProps) {
	const { email1 = '', email2 = '' } = props;

	const setModalContents = useSetRecoilState(ModalContentsState);

	const [primaryEmail, setPrimaryEmail] = useState<ValueAndValidity>(
		email1 ? { value: email1, validity: true } : blankValueWithValidity
	);
	const [secondaryEmail, setSecondaryEmail] = useState<ValueAndValidity>({
		value: email2,
		validity: true,
	});

	function submitForm() {
		setModalContents({
			title: 'Add Board Owners?',
			component: (
				<AddBoardOwnersConfirmationForm
					email1={primaryEmail.value}
					email2={secondaryEmail.value}
				/>
			),
		});
	}

	return (
		<Form
			submitButtonText="Add Email"
			className="add-board-owners-form"
			disableSubmitBtn={!primaryEmail.validity}
			onSubmit={submitForm}
		>
			<div className="label">Add Board Owners</div>
			<p className="description">
				Want the ability to change your team’s password? Add 1 or 2 board owners
				to your RetroQuest team and these email addresses will be able to reset
				the team’s password, when desired.
			</p>
			<InputEmail
				label="Email Address 1"
				id="email-address-1"
				value={primaryEmail.value}
				onChange={(value: string, validity: boolean) => {
					setPrimaryEmail({ value, validity });
				}}
			/>
			<InputEmail
				label="Second Teammate’s Email (optional)"
				id="email-address-2"
				required={false}
				value={secondaryEmail.value}
				onChange={(value: string, validity: boolean) => {
					setSecondaryEmail({ value, validity });
				}}
			/>
		</Form>
	);
}

export default AddBoardOwnersForm;
