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
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Form from '../Common/AuthTemplate/Form/Form';
import Input from '../Common/Input/Input';
import { validatePassword, validateTeamName } from '../Utils/StringUtils';

export default {
	title: 'components/Form',
	component: Form,
} as ComponentMeta<typeof Form>;

const Template: ComponentStory<typeof Form> = () => {
	const [teamName, setTeamName] = useState<string>('');
	const [password, setPassword] = useState<string>('');

	const [isValid, setIsValid] = useState<boolean>(false);
	const [errorMessages, setErrorMessages] = useState<string[]>([]);

	const teamNameErrorMessage = validateTeamName(teamName);
	const passwordErrorMessage = validatePassword(password);

	function onSubmit(): Promise<void> {
		setIsValid(true);

		if (teamNameErrorMessage || passwordErrorMessage) {
			const errors = [];
			if (teamNameErrorMessage) errors.push(teamNameErrorMessage);
			if (passwordErrorMessage) errors.push(passwordErrorMessage);
			setErrorMessages(errors);

			return Promise.resolve();
		} else {
			return new Promise((resolve) => {
				setTimeout(() => {
					setIsValid(false);
					setTeamName('');
					setPassword('');
					setErrorMessages([]);
					resolve();
				}, 1000);
			});
		}
	}

	return (
		<Form
			onSubmit={onSubmit}
			errorMessages={errorMessages}
			style={{ maxWidth: '600px' }}
			isLoading={false}
		>
			<Input
				id="teamName"
				label="Team name"
				value={teamName}
				onChange={(event) => setTeamName(event.target.value)}
				validationMessage="Names must not contain special characters."
				invalid={isValid && !!teamNameErrorMessage}
			/>
			<Input
				id="password"
				label="Password"
				type="password"
				value={password}
				onChange={(event) => setPassword(event.target.value)}
				validationMessage="8 or more characters with a mix of numbers and letters"
				invalid={isValid && !!passwordErrorMessage}
			/>
		</Form>
	);
};

export const Example = Template.bind({});
