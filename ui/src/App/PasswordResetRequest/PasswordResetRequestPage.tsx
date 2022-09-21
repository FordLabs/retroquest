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
import AuthTemplate from 'Common/AuthTemplate/AuthTemplate';
import Form from 'Common/AuthTemplate/Form/Form';
import InputEmail from 'Common/InputEmail/InputEmail';
import InputTeamName from 'Common/InputTeamName/InputTeamName';
import ConfigurationService from 'Services/Api/ConfigurationService';
import TeamService from 'Services/Api/TeamService';

import { LOGIN_PAGE_PATH } from '../../RouteConstants';

import './PasswordResetRequestPage.scss';

const blankValueWithValidity = { value: '', validity: false };

interface ValueAndValidity {
	value: string;
	validity: boolean;
}

function PasswordResetRequestPage(): JSX.Element {
	const [emailFromAddress, setEmailFromAddress] = useState<string>('');
	const [requestSent, setRequestSent] = useState<boolean>(false);
	const [teamName, setTeamName] = useState<ValueAndValidity>(
		blankValueWithValidity
	);
	const [email, setEmail] = useState<ValueAndValidity>(blankValueWithValidity);
	const [errorMessages, setErrorMessages] = useState<string[]>([]);

	function submitRequest() {
		if (!!teamName && !!email) {
			TeamService.sendPasswordResetLink(teamName.value, email.value)
				.then(() => setRequestSent(true))
				.catch(() =>
					setErrorMessages([
						'Team name or email is incorrect. Please try again.',
					])
				);
		}
	}

	function disableSubmitButton(): boolean {
		return !teamName.validity || !email.validity;
	}

	useEffect(() => {
		if (!emailFromAddress) {
			ConfigurationService.get().then((config) =>
				setEmailFromAddress(config.email_from_address)
			);
		}
	});

	return (
		<>
			{!requestSent && (
				<AuthTemplate
					header="Reset your Password"
					subHeader={
						<p className="password-reset-description">
							Enter the Team Name <u>and</u> email associated with your team's
							account and we’ll send an email with instructions to reset your
							password.
						</p>
					}
					className="password-reset-request-page"
				>
					<Form
						submitButtonText="Send reset link"
						onSubmit={submitRequest}
						errorMessages={errorMessages}
						disableSubmitBtn={disableSubmitButton()}
					>
						<InputTeamName
							value={teamName.value}
							onChange={(name, isValid) => {
								setTeamName({ value: name, validity: isValid });
								setErrorMessages([]);
							}}
						/>
						<InputEmail
							value={email.value}
							onChange={(email, isValid) => {
								setEmail({ value: email, validity: isValid });
								setErrorMessages([]);
							}}
						/>
					</Form>
				</AuthTemplate>
			)}
			{requestSent && (
				<AuthTemplate
					header="Check your Mail!"
					className="password-reset-request-page"
				>
					<p>
						We’ve sent an email to {email.value} with password reset
						instructions.
					</p>
					<p>
						If an email doesn't show up soon, check your spam folder. We sent it
						from {emailFromAddress}.
					</p>
					<Link className="login-button-link" to={LOGIN_PAGE_PATH}>
						Return to Login
					</Link>
				</AuthTemplate>
			)}
		</>
	);
}

export default PasswordResetRequestPage;
