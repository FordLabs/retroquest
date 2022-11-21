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
import AuthTemplate from 'Common/AuthTemplate/AuthTemplate';
import LinkPrimary from 'Common/LinkPrimary/LinkPrimary';
import { LOGIN_PAGE_PATH } from 'RouteConstants';

import './PageNotFoundPage.scss';

function PageNotFoundPage() {
	return (
		<AuthTemplate
			header="Oops!"
			className="page-not-found-page"
			showGithubLink={false}
			showCodeContributors={false}
		>
			<div className="paragraph-1-container">
				<i className="fa-solid fa-poo fa-3x not-found-icon" />
				<p className="paragraph-1">
					We can’t seem to find the page you’re looking for.
				</p>
			</div>
			<LinkPrimary to={LOGIN_PAGE_PATH} className="reset-password-link">
				Return to Login
			</LinkPrimary>
		</AuthTemplate>
	);
}

export default PageNotFoundPage;
