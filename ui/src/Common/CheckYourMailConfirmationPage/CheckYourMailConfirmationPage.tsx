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
import React from 'react';
import { LOGIN_PAGE_PATH } from 'RouteConstants';

import AuthTemplate from '../AuthTemplate/AuthTemplate';
import LinkPrimary from '../LinkPrimary/LinkPrimary';
import ThemedCheckboxIcon from '../ThemedCheckboxIcon/ThemedCheckboxIcon';

import './CheckYourMailConfirmationPage.scss';

interface Props {
	paragraph1: string;
	paragraph2: string;
}

function CheckYourMailConfirmationPage(props: Readonly<Props>) {
	const { paragraph1, paragraph2 } = props;

	return (
		<AuthTemplate
			header="Check your Mail!"
			className="check-your-mail-confirmation"
			showGithubLink={false}
		>
			<div className="paragraph-1-container">
				<ThemedCheckboxIcon />
				<p className="paragraph-1">{paragraph1}</p>
			</div>
			<p className="paragraph-2">{paragraph2}</p>
			<LinkPrimary className="login-button-link" to={LOGIN_PAGE_PATH}>
				Return to Login
			</LinkPrimary>
		</AuthTemplate>
	);
}

export default CheckYourMailConfirmationPage;
