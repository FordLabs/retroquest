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
import { useLocation, useNavigate } from 'react-router-dom';
import Form from 'Common/AuthTemplate/Form/Form';
import Header from 'Common/Header/Header';
import InputEmail from 'Common/InputEmail/InputEmail';
import LinkPrimary from 'Common/LinkPrimary/LinkPrimary';
import { EXPIRED_EMAIL_RESET_LINK_PATH, LOGIN_PAGE_PATH } from 'RouteConstants';
import EmailResetTokenService from 'Services/Api/EmailResetTokenService';
import TeamService from 'Services/Api/TeamService';
import Team from 'Types/Team';

import './ChangeTeamDetailsPage.scss';

const blankValueWithValidity = { value: '', validity: false };

interface ValueAndValidity {
	value: string;
	validity: boolean;
}

function ChangeTeamDetailsPage(): JSX.Element {
	const { search } = useLocation();
	const navigate = useNavigate();
	const emailResetToken = new URLSearchParams(search).get('token') || 'invalid';

	const [email, setEmail] = useState<ValueAndValidity>(blankValueWithValidity);
	const [secondaryEmail, setSecondaryEmail] = useState<ValueAndValidity>({
		value: '',
		validity: true,
	});
	const [formSubmitted, setFormSubmitted] = useState(false);

	function submitEmails() {
		if (email) {
			TeamService.updateEmailsWithResetToken(
				email.value,
				secondaryEmail.value,
				emailResetToken
			).then(() => setFormSubmitted(true));
		}
	}

	function disableSubmitButton(): boolean {
		return !email.validity || !secondaryEmail.validity;
	}

	useEffect(() => {
		EmailResetTokenService.getTeamByResetToken(emailResetToken)
			.then((team: Team) => {
				if (team.email) setEmail({ value: team.email, validity: true });
				if (team.secondaryEmail)
					setSecondaryEmail({ value: team.secondaryEmail, validity: true });
			})
			.catch((err) => {
				if (err.response.status === 400) {
					navigate(EXPIRED_EMAIL_RESET_LINK_PATH);
				}
			});
	}, [emailResetToken, navigate]);

	return (
		<div className="change-team-details-page">
			<Header name="RetroQuest" />
			{!formSubmitted && (
				<div className="change-team-details-form">
					<h1>Update Board Owners</h1>
					<p>
						Edit the current details in the boxes below and press “Save Changes”
						to update your team’s email addresses (for password recovery).
					</p>
					<Form
						onSubmit={submitEmails}
						disableSubmitBtn={disableSubmitButton()}
						submitButtonText="Save Changes"
					>
						<InputEmail
							label="Email 1"
							onChange={(value, validity) => {
								setEmail({ value: value, validity: validity });
							}}
							value={email.value}
							id="email1Id"
							required
						/>
						<InputEmail
							label="Second Teammate’s Email (optional)"
							onChange={(value, validity) => {
								setSecondaryEmail({ value: value, validity: validity });
							}}
							value={secondaryEmail.value}
							id="email2Id"
							required={false}
						/>
					</Form>
				</div>
			)}
			{formSubmitted && (
				<div className="change-team-details-confirmation">
					<h1>Board Owners Updated!</h1>
					<p className="description">
						All set! Your board owners have been changed.
					</p>
					<LinkPrimary to={LOGIN_PAGE_PATH}>Return to Login</LinkPrimary>
				</div>
			)}
		</div>
	);
}

export default ChangeTeamDetailsPage;
