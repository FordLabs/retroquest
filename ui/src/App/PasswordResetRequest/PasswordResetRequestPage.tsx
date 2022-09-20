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

const blankValueWithValidity = { value: '', validity: false };

interface ValueAndValidity {
	value: string;
	validity: boolean;
}

function PasswordResetRequestPage(): JSX.Element {
	const [shouldShowSent, setShouldShowSent] = useState(false);

	const [teamName, setTeamName] = useState<ValueAndValidity>(
		blankValueWithValidity
	);
	const [email, setEmail] = useState<ValueAndValidity>(blankValueWithValidity);

	const [errorMessages, setErrorMessages] = useState<string[]>([]);

	function submitRequest() {
		if (!!teamName && !!email) {
			TeamService.sendPasswordResetLink(teamName.value, email.value)
				.then(() => setShouldShowSent(true))
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

	return (
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
			{shouldShowSent && <div className="success-indicator">Link Sent!</div>}
		</AuthTemplate>
	);
}

export default PasswordResetRequestPage;
