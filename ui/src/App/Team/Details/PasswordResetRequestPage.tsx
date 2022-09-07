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

import TeamService from '../../../Services/Api/TeamService';

type ElementType = {
	teamName: { value: string };
	email: { value: string };
};

function PasswordResetRequestPage(): JSX.Element {
	const [shouldShowSent, setShouldShowSent] = useState(false);

	function submitRequest(e: React.SyntheticEvent<HTMLFormElement>) {
		e.preventDefault();
		const teamName = (e.currentTarget.elements as unknown as ElementType)
			.teamName.value;
		const email = (e.currentTarget.elements as unknown as ElementType).email
			.value;
		if (!!teamName && !!email) {
			TeamService.sendPasswordResetLink(teamName, email).then(() => {
				setShouldShowSent(true);
			});
		}
	}

	return (
		<form onSubmit={submitRequest}>
			<label htmlFor="teamnameinput">Team Name</label>
			<input type="text" id="teamnameinput" name="teamName" required />
			<label htmlFor="emailinput">Email</label>
			<input type="email" id="emailinput" name="email" required />
			<button type="submit">Send reset link</button>
			{shouldShowSent && <div className="success-indicator">Link Sent!</div>}
		</form>
	);
}

export default PasswordResetRequestPage;
