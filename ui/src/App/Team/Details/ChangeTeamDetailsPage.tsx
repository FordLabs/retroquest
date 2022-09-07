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

import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import TeamService from '../../../Services/Api/TeamService';

type TargetType = {
	email1: { value: string };
	email2: { value: string };
};

function ChangeTeamDetailsPage(): JSX.Element {
	const { search } = useLocation();
	const [shouldShowSaved, setShouldShowSaved] = useState(false);

	function submitEmails(e: React.SyntheticEvent<HTMLFormElement>) {
		e.preventDefault();
		const email1 = (e.currentTarget.elements as unknown as TargetType).email1
			.value;
		const email2 = (e.currentTarget.elements as unknown as TargetType).email2
			.value;
		let token = new URLSearchParams(search).get('token');
		TeamService.setEmails(email1, email2, token == null ? '' : token).then(
			() => {
				setShouldShowSaved(true);
			}
		);
	}

	return (
		<form onSubmit={submitEmails}>
			<label htmlFor="email1input">Email Address 1</label>
			<input type="email" id="email1input" name="email1" />
			<label htmlFor="email2input">Email Address 2</label>
			<input type="email" id="email2input" name="email2" />

			<button type="submit">Update Team Details</button>
			{shouldShowSaved && <div className={'success-indicator'}>Saved!</div>}
		</form>
	);
}

export default ChangeTeamDetailsPage;
