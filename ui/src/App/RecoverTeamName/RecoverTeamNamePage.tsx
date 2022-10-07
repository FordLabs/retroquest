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
import AuthTemplate from 'Common/AuthTemplate/AuthTemplate';
import Form from 'Common/AuthTemplate/Form/Form';
import InputEmail from 'Common/InputEmail/InputEmail';
import TeamService from 'Services/Api/TeamService';

function RecoverTeamNamePage() {
	const [recoveryEmail, setRecoveryEmail] = useState<string>('');
	const [errorMessages, setErrorMessages] = useState<string[]>([]);

	function onSubmit() {
		TeamService.sendTeamNameRecoveryEmail(recoveryEmail).catch((error) => {
			setErrorMessages([error.response?.data?.message]);
		});
	}

	return (
		<AuthTemplate
			header="Recover Team Name"
			subHeader="Enter your email below, and we’ll send you the team name (or names!) registered to your email address."
			showGithubLink={false}
		>
			<Form
				submitButtonText="Send me my team name"
				onSubmit={onSubmit}
				disableSubmitBtn={!recoveryEmail}
				errorMessages={errorMessages}
			>
				<InputEmail
					value={recoveryEmail}
					onChange={setRecoveryEmail}
					validateInput={false}
				/>
			</Form>
		</AuthTemplate>
	);
}

export default RecoverTeamNamePage;
