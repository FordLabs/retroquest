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
import InputPassword from 'Common/InputPassword/InputPassword';
import TeamService from 'Services/Api/TeamService';

import './ResetPasswordPage.scss';

function ResetPasswordPage(): JSX.Element {
	const { search } = useLocation();

	const [newPassword, setNewPassword] = useState<string>('');
	const [shouldShowSaved, setShouldShowSaved] = useState(false);

	function submitNewPassword() {
		if (newPassword) {
			const token = new URLSearchParams(search).get('token') || '';
			TeamService.setPassword(newPassword, token).then(() =>
				setShouldShowSaved(true)
			);
		}
	}

	return (
		<div className="reset-password-page">
			<Header name="RetroQuest" />
			<div className="reset-password-form">
				<h1>Reset Your Password</h1>
				<p>
					Almost done! Enter your new password here and then remember to tell
					any active teammates so that they can continue to login to your board.
				</p>
				<Form
					onSubmit={submitNewPassword}
					submitButtonText="Reset Password"
					disableSubmitBtn={!newPassword}
				>
					<InputPassword
						label="New Password"
						password={newPassword}
						onPasswordInputChange={setNewPassword}
						required
					/>
					{shouldShowSaved && <div className="success-indicator">Saved!</div>}
				</Form>
			</div>
		</div>
	);
}

export default ResetPasswordPage;
