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
import { useLocation } from 'react-router-dom';
import Form from 'Common/AuthTemplate/Form/Form';
import Header from 'Common/Header/Header';
import InputEmail from 'Common/InputEmail/InputEmail';
import TeamService from 'Services/Api/TeamService';

import './ChangeTeamDetailsPage.scss';

function ChangeTeamDetailsPage(): JSX.Element {
	const { search } = useLocation();

	const [email, setEmail] = useState<string>('');
	const [secondaryEmail, setSecondaryEmail] = useState<string>('');
	const [shouldShowSaved, setShouldShowSaved] = useState(false);

	function submitEmails() {
		if (email) {
			const token = new URLSearchParams(search).get('token') || '';
			TeamService.updateEmailsWithResetToken(email, secondaryEmail, token).then(
				() => setShouldShowSaved(true)
			);
		}
	}

	return (
		<div className="change-team-details-page">
			<Header name="RetroQuest" />
			<div className="change-team-details-form">
				<h1>Update Team Details</h1>
				<p>
					Edit the current details in the boxes below and press "Update Team
					Details" to update your team's email addresses (for password
					recovery).
				</p>
				<Form onSubmit={submitEmails} submitButtonText="Save Changes">
					<InputEmail
						label="Email 1"
						onChange={setEmail}
						value={email}
						id="email1Id"
						required
					/>
					<InputEmail
						label="Email 2"
						onChange={setSecondaryEmail}
						value={secondaryEmail}
						id="email2Id"
						required
					/>
					{shouldShowSaved && <div className="success-indicator">Saved!</div>}
				</Form>
			</div>
		</div>
	);
}

export default ChangeTeamDetailsPage;
