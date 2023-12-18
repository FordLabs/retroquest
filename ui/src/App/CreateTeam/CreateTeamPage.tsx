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
import AuthTemplate from 'Common/AuthTemplate/AuthTemplate';
import Form from 'Common/AuthTemplate/Form/Form';
import HorizontalRuleWithText from 'Common/HorizontalRuleWithText/HorizontalRuleWithText';
import InputEmail from 'Common/InputEmail/InputEmail';
import InputPassword from 'Common/InputPassword/InputPassword';
import InputTeamName from 'Common/InputTeamName/InputTeamName';
import LinkSecondary from 'Common/LinkSecondary/LinkSecondary';
import useAuth from 'Hooks/useAuth';
import { LOGIN_PAGE_PATH } from 'RouteConstants';
import TeamService from 'Services/Api/TeamService';

import './CreateTeamPage.scss';

const blankValueWithValidity = { value: '', validity: false };

interface ValueAndValidity {
	value: string;
	validity: boolean;
}

function CreateTeamPage(): React.ReactElement {
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
	const [errorMessages, setErrorMessages] = useState<string[]>([]);

	function disableSubmitButton(): boolean {
		return (
			!teamName.validity ||
			!password.validity ||
			!email.validity ||
			!secondEmail.validity
		);
	}

	function createTeam() {
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
							? response.data.reason
							: error.message;
				}
				setErrorMessages([errorMsg]);
			});
	}

	function onSubmit() {
		setErrorMessages([]);
		createTeam();
	}

	function onTeamNameChange(updatedTeamName: string, validity: boolean) {
		setTeamName({ value: updatedTeamName, validity: validity });
		setErrorMessages([]);
	}

	function onPasswordChange(updatedPassword: string, isValid: boolean) {
		setPassword({ value: updatedPassword, validity: isValid });
		setErrorMessages([]);
	}

	function onPrimaryEmailChange(value: string, validity: boolean) {
		setEmail({ value: value, validity: validity });
		setErrorMessages([]);
	}

	function onSecondaryEmailChange(value: string, validity: boolean) {
		setSecondEmail({ value: value, validity: validity });
		setErrorMessages([]);
	}

	return (
		<AuthTemplate header="Create a New Team!" className="create-team-page">
			<Form
				onSubmit={onSubmit}
				errorMessages={errorMessages}
				submitButtonText="Create Team"
				disableSubmitBtn={disableSubmitButton()}
			>
				<InputTeamName value={teamName.value} onChange={onTeamNameChange} />
				<InputPassword
					password={password.value}
					onPasswordInputChange={onPasswordChange}
				/>
				<InputEmail
					id="emailInput"
					label="Email"
					value={email.value}
					onChange={onPrimaryEmailChange}
				/>
				<InputEmail
					id="secondEmailInput"
					label="Second Teammate's Email (optional)"
					value={secondEmail.value}
					required={false}
					onChange={onSecondaryEmailChange}
				/>
			</Form>
			<HorizontalRuleWithText text="or" />
			<LinkSecondary
				to={LOGIN_PAGE_PATH}
				className="login-page-link"
				data-testid="goToLoginPageLink"
			>
				Log in to your existing team
			</LinkSecondary>
		</AuthTemplate>
	);
}

export default CreateTeamPage;
