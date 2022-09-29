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
import Form from 'Common/AuthTemplate/Form/Form';
import InputEmail from 'Common/InputEmail/InputEmail';
import { useRecoilValue } from 'recoil';
import teamService from 'Services/Api/TeamService';
import { TeamState } from 'State/TeamState';

const blankValueWithValidity = { value: '', validity: false };

interface ValueAndValidity {
	value: string;
	validity: boolean;
}

function AddBoardOwnersForm() {
	const team = useRecoilValue(TeamState);

	const [primaryEmail, setPrimaryEmail] = useState<ValueAndValidity>(
		blankValueWithValidity
	);
	const [secondaryEmail, setSecondaryEmail] = useState<ValueAndValidity>({
		value: '',
		validity: true,
	});

	function submitForm() {
		teamService
			.updateTeamEmailAddresses(
				team.id,
				primaryEmail.value,
				secondaryEmail.value
			)
			.catch(console.error);
	}

	return (
		<Form
			submitButtonText="Add Email"
			disableSubmitBtn={!primaryEmail.validity}
			onSubmit={submitForm}
		>
			<div className="label">Add Board Owners</div>
			<p>
				Want the ability to change your team’s password? Add 1 or 2 board owners
				to your RetroQuest team and these email addresses will be able to reset
				the team’s password, when desired.
			</p>
			<InputEmail
				label="Email Address 1"
				id="email-address-1"
				value={primaryEmail.value}
				onChange={(value: string, validity: boolean) => {
					setPrimaryEmail({ value, validity });
				}}
			/>
			<InputEmail
				label="Second Teammate’s Email (optional)"
				id="email-address-2"
				required={false}
				value={secondaryEmail.value}
				onChange={(value: string, validity: boolean) => {
					setSecondaryEmail({ value, validity });
				}}
			/>
		</Form>
	);
}

export default AddBoardOwnersForm;
