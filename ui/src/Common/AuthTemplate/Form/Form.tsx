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
import ButtonPrimary from 'Common/ButtonPrimary/ButtonPrimary';

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
			data-testid="form"
			className="form"
			onSubmit={(event) => {
				event.preventDefault();
				onSubmit();
			}}
			{...formProps}
		>
			{children}
			<div className="error-messages">
				{errorMessages.map((errorMessage, index) => (
					<span
						className="error-message"
						key={index}
						data-testid="formErrorMessage"
					>
						{errorMessage}
					</span>
				))}
			</div>
			<ButtonPrimary
				className="submit-button"
				disabled={disableSubmitBtn}
				data-testid="formSubmitButton"
			>
				{submitButtonText}
			</ButtonPrimary>
		</form>
	);
}

export default Form;
