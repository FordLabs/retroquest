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
import { Link } from 'react-router-dom';
import AuthTemplate from 'Common/AuthTemplate/AuthTemplate';
import Form from 'Common/AuthTemplate/Form/Form';
import Input from 'Common/Input/Input';
import InputPassword from 'Common/InputPassword/InputPassword';
import InputTeamName from 'Common/InputTeamName/InputTeamName';
import useAuth from 'Hooks/useAuth';
import { LOGIN_PAGE_PATH } from 'RouteConstants';
import TeamService from 'Services/Api/TeamService';
import {
	getPasswordInvalidMessage,
	getTeamNameInvalidMessage,
} from 'Utils/StringUtils';

import InputEmail from '../../Common/InputEmail/InputEmail';
import team from '../../Types/Team';

import './CreateTeamPage.scss';

export default function CreateTeamPage(): JSX.Element {
	interface ValueAndValidity {
		value: string;
		validity: boolean;
	}
	const blankValueWithValidity = { value: '', validity: false };

	const { login } = useAuth();
	const [teamName, setTeamName] = useState<ValueAndValidity>(
		blankValueWithValidity
	);
	const [password, setPassword] = useState<ValueAndValidity>(
		blankValueWithValidity
	);
	const [email, setEmail] = useState<ValueAndValidity>(blankValueWithValidity);
	const [secondEmail, setSecondEmail] = useState<ValueAndValidity>({
		value: '',
		validity: true,
	});

	const [isValidated, setIsValidated] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [errorMessages, setErrorMessages] = useState<string[]>([]);

	const teamNameErrorMessage = getTeamNameInvalidMessage(teamName.value);
	const passwordErrorMessage = getPasswordInvalidMessage(password.value);

	const captureErrors = () => {
		const errors = [];
		if (teamNameErrorMessage) errors.push(teamNameErrorMessage);
		if (passwordErrorMessage) errors.push(passwordErrorMessage);
		setErrorMessages(errors);
	};

	function disableSubmitButton(): boolean {
		return (
			!teamName.validity ||
			!password.validity ||
			!email.validity ||
			!secondEmail.validity
		);
	}

	function createTeam() {
		setIsLoading(true);
		TeamService.create(
			teamName.value,
			password.value,
			email.value,
			secondEmail.value
		)
			.then(login)
			.catch((error) => {
				let errorMsg = 'Incorrect team name or password. Please try again.';
				const { response } = error;
				if (response.status === 409) {
					errorMsg =
						typeof response !== 'undefined'
							? response.data.message
							: error.message;
				}
				setErrorMessages([errorMsg]);
			})
			.finally(() => setIsLoading(false));
	}

	function onSubmit() {
		setIsValidated(true);
		setErrorMessages([]);

		if (teamNameErrorMessage || passwordErrorMessage) {
			captureErrors();
		} else {
			createTeam();
		}
	}

	return (
		<AuthTemplate header="Create a New Team!" className="create-team-page">
			<Form
				onSubmit={onSubmit}
				errorMessages={errorMessages}
				submitButtonText="Create Team"
				disableSubmitBtn={isLoading || disableSubmitButton()}
			>
				<InputTeamName
					teamName={teamName.value}
					onTeamNameInputChange={(updatedTeamName: string) => {
						setTeamName({ value: updatedTeamName, validity: true });
						setErrorMessages([]);
					}}
					invalid={isValidated && !!teamNameErrorMessage}
					readOnly={isLoading}
				/>
				<InputPassword
					password={password.value}
					onPasswordInputChange={(
						updatedPassword: string,
						isValid: boolean
					) => {
						setPassword({ value: updatedPassword, validity: isValid });
						setErrorMessages([]);
					}}
					invalid={isValidated && !!passwordErrorMessage}
					readOnly={isLoading}
				/>
				<InputEmail
					id="emailInput"
					label="Email"
					value={email.value}
					onChange={(value, validity) => {
						setEmail({ value: value, validity: validity });
						setErrorMessages([]);
					}}
					readOnly={isLoading}
				/>
				<InputEmail
					id="secondEmailInput"
					label="Second Teammate's Email (optional)"
					value={secondEmail.value}
					required={false}
					onChange={(value, validity) => {
						setSecondEmail({ value: value, validity: validity });
						setErrorMessages([]);
					}}
					readOnly={isLoading}
				/>
			</Form>
			<div className="or-separator-line">
				<span>or</span>
			</div>
			<Link
				to={LOGIN_PAGE_PATH}
				data-testid="goToLoginPageLink"
				className="link-secondary"
			>
				Log in to your existing team
			</Link>
		</AuthTemplate>
	);
}
