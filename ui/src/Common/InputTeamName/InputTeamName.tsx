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

import { checkValidityOfPassword } from '../../Utils/StringUtils';

interface Props {
	value?: string;
	required?: boolean;
	onChange: (updatedTeamName: string, validity: boolean) => void;
	invalid?: boolean;
	readOnly?: boolean;
}

const TEAM_NAME_REGEX = /^[\w\s]+$/;

function InputTeamName(props: Props) {
	const { value = '', required, onChange, invalid, readOnly } = props;

	function checkValidityOfTeamName(value: string): boolean {
		const isValid = value.match(TEAM_NAME_REGEX) != null;
		setIsValidTeamName(isValid);
		return isValid;
	}

	const [isValidTeamName, setIsValidTeamName] = useState<boolean>(true);

	return (
		<Input
			id="teamNameInput"
			label="Team Name"
			value={value}
			required={required}
			onChange={(event) => {
				onChange(
					event.target.value,
					checkValidityOfTeamName(event.target.value)
				);
			}}
			onFocus={() => checkValidityOfTeamName(value)}
			validationMessage="Must have: letters, numbers, and spaces only"
			invalid={invalid || !isValidTeamName}
			readOnly={readOnly}
		/>
	);
}

export default InputTeamName;
