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
import { useState } from 'react';
import Input from 'Common/Input/Input';

interface Props {
	value?: string;
	required?: boolean;
	onChange: (updatedEmail: string, isValid: boolean) => void;
	invalid?: boolean;
	readOnly?: boolean;
	label?: string;
	id?: string;
}

const EMAIL_REGEX = /^[^@]+@[^@]+$/;

function InputEmail(props: Props) {
	const {
		value = '',
		required = true,
		onChange,
		invalid,
		readOnly,
		label = 'Email',
		id = 'emailInput',
	} = props;

	const [isValidEmail, setIsValidEmail] = useState<boolean>(true);

	function checkValidityOfEmail(email: string): boolean {
		return !!email.match(EMAIL_REGEX) || (!required && email === '');
	}

	return (
		<Input
			id={id}
			label={label}
			value={value}
			type="email"
			required={required}
			onChange={(event) => {
				const isValid = checkValidityOfEmail(event.target.value);
				setIsValidEmail(isValid);
				onChange(event.target.value, isValid);
			}}
			validationMessage="Valid email address required"
			onFocus={() => setIsValidEmail(checkValidityOfEmail(value))}
			invalid={invalid || !isValidEmail}
			readOnly={readOnly}
		/>
	);
}

export default InputEmail;
