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
import ErrorStopSignIcon from 'Assets/ErrorStopSignIcon';
import AuthTemplate from 'Common/AuthTemplate/AuthTemplate';
import LinkPrimary from 'Common/LinkPrimary/LinkPrimary';
import { useRecoilValue } from 'recoil';
import { PASSWORD_RESET_REQUEST_PATH } from 'RouteConstants';
import PasswordResetTokenService from 'Services/Api/PasswordResetTokenService';
import { ThemeState } from 'State/ThemeState';
import Theme from 'Types/Theme';

import './ExpiredResetPasswordLinkPage.scss';

function ExpiredResetPasswordLinkPage() {
	const theme = useRecoilValue(ThemeState);
	const lightRed = '#ef8a7e';
	const red = '#e74c3c';
	const checkboxIconColor = theme === Theme.DARK ? lightRed : red;

	const [resetTokenLifetime, setResetTokenLifetime] = useState<number>(600);

	useEffect(() => {
		PasswordResetTokenService.getResetTokenLifetime().then((seconds) => {
			setResetTokenLifetime(Math.floor(seconds / 60));
		});
	}, []);

	return (
		<AuthTemplate
			header="Expired Link"
			className="expired-link-page"
			showGithubLink={false}
		>
			<div className="paragraph-1-container">
				<ErrorStopSignIcon
					color={checkboxIconColor}
					className="checkbox-icon"
				/>
				<p className="paragraph-1">
					For your safety, our password reset link is only valid for{' '}
					{resetTokenLifetime} minutes.
				</p>
			</div>
			<p className="paragraph-2">
				Fear not! Click here to request a fresh, new reset link.
			</p>
			<LinkPrimary
				to={PASSWORD_RESET_REQUEST_PATH}
				className="reset-password-link"
			>
				Reset my Password
			</LinkPrimary>
		</AuthTemplate>
	);
}

export default ExpiredResetPasswordLinkPage;
