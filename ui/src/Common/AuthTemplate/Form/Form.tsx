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

import * as React from 'react';
import { ComponentPropsWithoutRef, FormEvent } from 'react';
import classnames from 'classnames';

import { PrimaryButton } from '../../Buttons/Button';

import './Form.scss';

interface FormProps extends ComponentPropsWithoutRef<'form'> {
	errorMessages?: string[];
	submitButtonText?: string;
}

export default function Form(props: FormProps): JSX.Element {
	const {
		submitButtonText = 'submit',
		errorMessages = [],
		onSubmit,
		className,
		children,
		...formProps
	} = props;
	const [loading, setLoading] = React.useState(false);

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setLoading(true);
		if (onSubmit) {
			Promise.resolve(onSubmit(event)).finally(() => setLoading(false));
		}
	}

	return (
		<form
			className={classnames('form', className)}
			onSubmit={handleSubmit}
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
				disabled={loading}
				data-testid="formSubmitButton"
			>
				{submitButtonText}
			</PrimaryButton>
		</form>
	);
}
