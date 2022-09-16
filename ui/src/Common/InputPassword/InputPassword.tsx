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

import { PASSWORD_REGEX } from '../../Utils/StringUtils';

import './InputPassword.scss';

type Props = {
	label?: string;
	password: string;
	onPasswordInputChange: (updatedTeamName: string) => void;
	required?: boolean;
	readOnly?: boolean;
	invalid?: boolean;
};

function InputPassword(props: Props) {
	const {
		label = 'Password',
		password,
		onPasswordInputChange,
		required,
		invalid,
		readOnly,
	} = props;

	const theme = useRecoilValue(ThemeState);
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const eyeIconColor = theme === Theme.DARK ? '#ecf0f1' : '#34495E';
	const [invalidPassword, setInvalidPassword] = useState<boolean>(false);

	const isInvalidPassword = (pw: string) => !pw.match(PASSWORD_REGEX);

	return (
		<div className="input-password">
			<Input
				id="passwordInput"
				label={label}
				type={showPassword ? 'text' : 'password'}
				value={password}
				onChange={(event) => {
					const newPassword = event.target.value;
					onPasswordInputChange(newPassword);
					setInvalidPassword(isInvalidPassword(newPassword));
				}}
				onFocus={() => {
					if (isInvalidPassword(password)) setInvalidPassword(true);
				}}
				validationMessage="Must have: 8+ Characters, 1 Upper Case Letter, 1 Number"
				required={required}
				invalid={invalid || invalidPassword}
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
