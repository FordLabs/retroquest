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
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import AuthTemplate from '../../Common/AuthTemplate/AuthTemplate';
import Form from '../../Common/AuthTemplate/Form/Form';
import InputPassword from '../../Common/AuthTemplate/InputPassword/InputPassword';
import InputTeamName from '../../Common/AuthTemplate/InputTeamName/InputTeamName';
import useAuth from '../../Hooks/useAuth';
import useTeamFromRoute from '../../Hooks/useTeamFromRoute';
import { CREATE_TEAM_PAGE_PATH } from '../../RouteConstants';
import TeamService from '../../Services/Api/TeamService';
import { validatePassword, validateTeamName } from '../../Utils/StringUtils';

function LoginPage(): JSX.Element {
	const { login } = useAuth();
	const team = useTeamFromRoute();

	const [teamName, setTeamName] = useState<string>('');
	const [password, setPassword] = useState<string>('');

	const [isValidated, setIsValidated] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [errorMessages, setErrorMessages] = useState<string[]>([]);

	useEffect(() => setTeamName(team.name), [team.name]);

	const teamNameErrorMessage = validateTeamName(teamName);
	const passwordErrorMessage = validatePassword(password);

	const captureErrors = () => {
		const errors = [];
		if (teamNameErrorMessage) errors.push(teamNameErrorMessage);
		if (passwordErrorMessage) errors.push(passwordErrorMessage);
		setErrorMessages(errors);
	};

	const loginTeam = () => {
		setIsLoading(true);
		TeamService.login(teamName, password)
			.then(login)
			.catch(() => {
				setErrorMessages([
					'Incorrect team name or password. Please try again.',
				]);
			})
			.finally(() => setIsLoading(false));
	};

	function onLoginFormSubmit() {
		setIsValidated(true);
		setErrorMessages([]);

		if (teamNameErrorMessage || passwordErrorMessage) {
			captureErrors();
		} else {
			loginTeam();
		}
	}

	return (
		<AuthTemplate
			header="Sign in to your Team!"
			subHeader={<Link to={CREATE_TEAM_PAGE_PATH}>or create a new team</Link>}
		>
			<Form
				onSubmit={onLoginFormSubmit}
				errorMessages={errorMessages}
				submitButtonText="Sign in"
				isLoading={isLoading}
			>
				<InputTeamName
					teamName={teamName}
					onTeamNameInputChange={(updatedTeamName: string) => {
						setTeamName(updatedTeamName);
						setErrorMessages([]);
					}}
					invalid={isValidated && !!teamNameErrorMessage}
					readOnly={isLoading}
				/>
				<InputPassword
					password={password}
					onPasswordInputChange={(updatedPassword: string) => {
						setPassword(updatedPassword);
						setErrorMessages([]);
					}}
					invalid={isValidated && !!passwordErrorMessage}
					readOnly={isLoading}
				/>
			</Form>
		</AuthTemplate>
	);
}

export default LoginPage;
