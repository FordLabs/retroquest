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
import { useParams } from 'react-router-dom';
import AuthTemplate from 'Common/AuthTemplate/AuthTemplate';
import Form from 'Common/AuthTemplate/Form/Form';
import HorizontalRuleWithText from 'Common/HorizontalRuleWithText/HorizontalRuleWithText';
import InputPassword from 'Common/InputPassword/InputPassword';
import InputTeamName from 'Common/InputTeamName/InputTeamName';
import LinkSecondary from 'Common/LinkSecondary/LinkSecondary';
import LinkTertiary from 'Common/LinkTertiary/LinkTertiary';
import useAuth from 'Hooks/useAuth';
import {
	CREATE_TEAM_PAGE_PATH,
	PASSWORD_RESET_REQUEST_PATH,
} from 'RouteConstants';
import TeamService from 'Services/Api/TeamService';

import './LoginPage.scss';

function LoginPage(): JSX.Element {
	const { teamId = '' } = useParams();

	const { login } = useAuth();

	const [teamName, setTeamName] = useState<string>('');
	const [password, setPassword] = useState<string>('');

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [errorMessages, setErrorMessages] = useState<string[]>([]);

	function onLoginFormSubmit() {
		setIsLoading(true);

		TeamService.login(teamName, password)
			.then(login)
			.catch(() => {
				setErrorMessages([
					'Incorrect team name or password. Please try again.',
				]);
			})
			.finally(() => setIsLoading(false));
	}

	useEffect(() => {
		if (teamId) {
			TeamService.getTeamName(teamId).then(setTeamName).catch(console.error);
		}
	}, [teamId]);

	return (
		<AuthTemplate header="Log in to your Team!" className="login-page">
			<Form
				onSubmit={onLoginFormSubmit}
				errorMessages={errorMessages}
				submitButtonText="Log in"
				disableSubmitBtn={isLoading}
			>
				<InputTeamName
					value={teamName}
					onChange={(updatedTeamName: string) => {
						setTeamName(updatedTeamName);
						setErrorMessages([]);
					}}
					readOnly={isLoading}
					validateInput={false}
				/>
				<InputPassword
					password={password}
					onPasswordInputChange={(updatedPassword: string) => {
						setPassword(updatedPassword);
						setErrorMessages([]);
					}}
					readOnly={isLoading}
					validateInput={false}
				/>
			</Form>
			<LinkTertiary to={PASSWORD_RESET_REQUEST_PATH}>
				Forgot your login info?
			</LinkTertiary>
			<HorizontalRuleWithText text="or" />
			<LinkSecondary
				to={CREATE_TEAM_PAGE_PATH}
				className="create-new-team-link"
			>
				Create new team
			</LinkSecondary>
		</AuthTemplate>
	);
}

export default LoginPage;
