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

import React, { ComponentPropsWithoutRef } from 'react';

import { PrimaryButton } from '../../Buttons/Button';

import './Form.scss';

interface FormProps extends ComponentPropsWithoutRef<'form'> {
	onSubmit: () => void;
	errorMessages?: string[];
	submitButtonText?: string;
	disableSubmitBtn?: boolean;
}

function Form(props: FormProps): JSX.Element {
	const {
		onSubmit,
		errorMessages = [],
		submitButtonText = 'Submit',
		disableSubmitBtn,
		children,
		...formProps
	} = props;

	return (
		<form
			className="form"
			onSubmit={(event) => {
				event.preventDefault();
				onSubmit();
			}}
			{...formProps}
		>
			{children}
			{errorMessages.map((errorMessage, index) => (
				<div
					className="error-message"
					key={index}
					data-testid="formErrorMessage"
				>
					{errorMessage}
				</div>
			))}
			<PrimaryButton
				className="submit-button"
				disabled={disableSubmitBtn}
				data-testid="formSubmitButton"
			>
				{submitButtonText}
			</PrimaryButton>
		</form>
	);
}

export default Form;
