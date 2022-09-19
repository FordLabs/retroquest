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
import InputEmail from 'Common/InputEmail/InputEmail';
import InputTeamName from 'Common/InputTeamName/InputTeamName';
import TeamService from 'Services/Api/TeamService';

import './PasswordResetRequestPage.scss';

function PasswordResetRequestPage(): JSX.Element {
	const [shouldShowSent, setShouldShowSent] = useState(false);
	const [teamName, setTeamName] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [errorMessages, setErrorMessages] = useState<string[]>([]);

	function submitRequest() {
		if (!!teamName && !!email) {
			TeamService.sendPasswordResetLink(teamName, email)
				.then(() => {
					setShouldShowSent(true);
				})
				.catch(() => {
					setErrorMessages([
						'Team name or email is incorrect. Please try again.',
					]);
				});
		}
	}

	return (
		<AuthTemplate
			header="Reset your password"
			subHeader={
				<p className="password-reset-description">
					Enter the Team Name and email associated with your team's account and
					we’ll send an email with instructions to reset your password.
				</p>
			}
			className="password-reset-request-page"
		>
			<Form
				submitButtonText="Send reset link"
				onSubmit={submitRequest}
				errorMessages={errorMessages}
			>
				<InputTeamName
					teamName={teamName}
					onTeamNameInputChange={(name) => {
						setTeamName(name);
						setErrorMessages([]);
					}}
					required
				/>
				<InputEmail
					value={email}
					onChange={(email) => {
						setEmail(email);
						setErrorMessages([]);
					}}
					required
				/>
			</Form>
			{shouldShowSent && <div className="success-indicator">Link Sent!</div>}
		</AuthTemplate>
	);
}

export default PasswordResetRequestPage;
