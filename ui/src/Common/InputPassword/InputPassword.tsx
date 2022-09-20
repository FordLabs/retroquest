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
import EyeOpenIcon from 'Assets/EyeOpenIcon';
import EyeSlashIcon from 'Assets/EyeSlashIcon';
import Input from 'Common/Input/Input';
import { useRecoilValue } from 'recoil';
import { ThemeState } from 'State/ThemeState';
import Theme from 'Types/Theme';

import { validatePasswordString } from '../../Utils/StringUtils';

import './InputPassword.scss';

type Props = {
	label?: string;
	password: string;
	onPasswordInputChange: (updatedTeamName: string, isValid: boolean) => void;
	required?: boolean;
	readOnly?: boolean;
	invalid?: boolean;
	validated?: boolean;
};

function InputPassword(props: Props) {
	const {
		label = 'Password',
		password,
		onPasswordInputChange,
		required,
		invalid,
		readOnly,
		validated = true,
	} = props;

	function checkValidityOfPassword(password: string): boolean {
		return !validated || validatePasswordString(password);
	}

	const theme = useRecoilValue(ThemeState);
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const eyeIconColor = theme === Theme.DARK ? '#ecf0f1' : '#34495E';
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
					<EyeSlashIcon color={eyeIconColor} />
				) : (
					<EyeOpenIcon color={eyeIconColor} />
				)}
			</button>
		</div>
	);
}

export default InputPassword;
