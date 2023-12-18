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

import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Form from 'Common/AuthTemplate/Form/Form';
import Header from 'Common/Header/Header';
import InputPassword from 'Common/InputPassword/InputPassword';
import LinkPrimary from 'Common/LinkPrimary/LinkPrimary';
import LinkTertiary from 'Common/LinkTertiary/LinkTertiary';
import PasswordResetTokenService from 'Services/Api/PasswordResetTokenService';
import TeamService from 'Services/Api/TeamService';

import {
	EXPIRED_PASSWORD_RESET_LINK_PATH,
	LOGIN_PAGE_PATH,
} from '../../RouteConstants';

import './ResetPasswordPage.scss';

function ResetPasswordPage(): React.ReactElement {
	const { search } = useLocation();
	const navigate = useNavigate();
	const passwordResetToken =
		new URLSearchParams(search).get('token') || 'invalid';

	const [newPassword, setNewPassword] = useState<string>('');
	const [isFormSubmitted, setIsFormSubmitted] = useState(false);
	const [isValidForm, setIsValidForm] = useState<boolean>(false);

	const goToExpiredLinkPage = useCallback(() => {
		navigate(EXPIRED_PASSWORD_RESET_LINK_PATH);
	}, [navigate]);

	function submitNewPassword() {
		if (newPassword) {
			TeamService.setPasswordWithResetToken(newPassword, passwordResetToken)
				.then(() => setIsFormSubmitted(true))
				.catch(goToExpiredLinkPage);
		}
	}

	useEffect(() => {
		PasswordResetTokenService.checkIfResetTokenIsValid(passwordResetToken).then(
			(isValidToken) => {
				if (!isValidToken) goToExpiredLinkPage();
			}
		);
	}, [goToExpiredLinkPage, passwordResetToken]);

	return (
		<div className="reset-password-page">
			<Header name="RetroQuest" />
			<div className="reset-password-form">
				<h1>Reset Your Password</h1>
				{!isFormSubmitted && (
					<>
						<p
							data-testid="resetPasswordFormDescription"
							className={'reset-form-description'}
						>
							Almost done! Enter your new password here and then remember to
							tell any active teammates so that they can continue to login to
							your board.
						</p>
						<Form
							onSubmit={submitNewPassword}
							submitButtonText="Reset Password"
							disableSubmitBtn={!isValidForm}
						>
							<InputPassword
								label="New Password"
								password={newPassword}
								onPasswordInputChange={(newPassword, isValid) => {
									setNewPassword(newPassword);
									setIsValidForm(isValid);
								}}
							/>
						</Form>
						<div className="login-link-container">
							<LinkTertiary to={LOGIN_PAGE_PATH} className="login-link">
								Return to Login
							</LinkTertiary>
						</div>
					</>
				)}
				{isFormSubmitted && (
					<div className="success-feedback-container">
						<div className="success-indicator">
							All set! Your password has been changed.
						</div>
						<LinkPrimary to={LOGIN_PAGE_PATH}>Return to Login</LinkPrimary>
					</div>
				)}
			</div>
		</div>
	);
}

export default ResetPasswordPage;
