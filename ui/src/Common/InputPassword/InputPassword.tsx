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

import React, { useState } from 'react';
import Input from 'Common/Input/Input';

import './InputPassword.scss';

type Props = {
	label?: string;
	password: string;
	onPasswordInputChange: (updatedTeamName: string, isValid: boolean) => void;
	required?: boolean;
	readOnly?: boolean;
	invalid?: boolean;
	validateInput?: boolean;
};

const UPPERCASE_REGEX = /[A-Z]/;
const NUMBER_REGEX = /\d/;

export function validatePasswordString(password: string): boolean {
	return (
		!!password &&
		password.length >= 8 &&
		!!password.match(UPPERCASE_REGEX) &&
		!!password.match(NUMBER_REGEX)
	);
}

function InputPassword(props: Readonly<Props>) {
	const {
		label = 'Password',
		password,
		onPasswordInputChange,
		required,
		invalid,
		readOnly,
		validateInput = true,
	} = props;

	function checkValidityOfPassword(password: string): boolean {
		return !validateInput || validatePasswordString(password);
	}

	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [isValidPassword, setIsValidPassword] = useState<boolean>(true);

	return (
		<div className="input-password">
			<Input
				id="passwordInput"
				label={label}
				type={showPassword ? 'text' : 'password'}
				value={password}
				onChange={(event) => {
					const newPassword = event.target.value;
					const isValid = checkValidityOfPassword(newPassword);
					setIsValidPassword(isValid);
					onPasswordInputChange(newPassword, isValid);
				}}
				onFocus={() => setIsValidPassword(checkValidityOfPassword(password))}
				validationMessage="Must have: 8+ Characters, 1 Upper Case Letter, 1 Number"
				required={required}
				invalid={invalid || !isValidPassword}
				readOnly={readOnly}
			/>
			<button
				className="eye-icon-toggle"
				type="button"
				aria-label={`${showPassword ? 'Hide' : 'Show'} Password`}
				onClick={() => setShowPassword(!showPassword)}
			>
				{showPassword ? (
					<i className="fa-solid fa-eye-slash eye-icon" role="presentation" />
				) : (
					<i className="fa-solid fa-eye eye-icon" role="presentation" />
				)}
			</button>
		</div>
	);
}

export default InputPassword;
