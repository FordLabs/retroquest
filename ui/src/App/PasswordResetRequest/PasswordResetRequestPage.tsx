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
import CheckYourMailConfirmationPage from 'Common/CheckYourMailConfirmationPage/CheckYourMailConfirmationPage';
import InputEmail from 'Common/InputEmail/InputEmail';
import InputTeamName from 'Common/InputTeamName/InputTeamName';
import LinkTertiary from 'Common/LinkTertiary/LinkTertiary';
import useEnvironmentConfig from 'Hooks/useEnvironmentConfig';
import EmailService from 'Services/Api/EmailService';

function PasswordResetRequestPage(): JSX.Element {
	const [emailSent, setEmailSent] = useState<boolean>(false);
	const [errorMessages, setErrorMessages] = useState<string[]>([]);

	const [teamName, setTeamName] = useState<string>('');
	const [email, setEmail] = useState<string>('');

	const environmentConfig = useEnvironmentConfig();

	function submitRequest() {
		if (!!teamName && !!email) {
			EmailService.sendPasswordResetEmail(teamName, email)
				.then(() => setEmailSent(true))
				.catch(() =>
					setErrorMessages([
						'Team name or email is incorrect. Please try again.',
					])
				);
		}
	}

	function disableSubmitButton(): boolean {
		return !teamName || !email;
	}

	return (
		<>
			{!emailSent && (
				<AuthTemplate
					header="Reset your Password"
					subHeader={
						<>
							Enter the Team Name <u>and</u> email associated with your team's
							account and we’ll send an email with instructions to reset your
							password.
						</>
					}
					className="password-reset-request-page"
					showGithubLink={false}
				>
					<Form
						submitButtonText="Send Reset Link"
						onSubmit={submitRequest}
						errorMessages={errorMessages}
						disableSubmitBtn={disableSubmitButton()}
					>
						<InputTeamName
							value={teamName}
							onChange={(name) => {
								setTeamName(name);
								setErrorMessages([]);
							}}
							validateInput={false}
						/>
						<InputEmail
							value={email}
							onChange={(email) => {
								setEmail(email);
								setErrorMessages([]);
							}}
							validateInput={false}
						/>
					</Form>
					<LinkTertiary to="/recover-team-name">
						I don't remember my team name
					</LinkTertiary>
				</AuthTemplate>
			)}
			{emailSent && (
				<CheckYourMailConfirmationPage
					paragraph1={`We’ve sent an email to ${email} with password reset instructions.`}
					paragraph2={`If an email doesn't show up soon, check your spam folder. We sent it from ${environmentConfig?.email_from_address}.`}
				/>
			)}
		</>
	);
}

export default PasswordResetRequestPage;
