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

import ButtonPrimary from 'Common/ButtonPrimary/ButtonPrimary';
import { useRecoilValue } from 'recoil';
import EmailService from 'Services/Api/EmailService';
import { TeamState } from 'State/TeamState';

import './BoardOwnersForm.scss';

function BoardOwnersForm() {
	const team = useRecoilValue(TeamState);

	function sendPasswordResetLink() {
		if (team.email) {
			EmailService.sendPasswordResetEmail(team.name, team.email).catch(
				console.error
			);
		}
		if (team.secondaryEmail) {
			EmailService.sendPasswordResetEmail(team.name, team.secondaryEmail).catch(
				console.error
			);
		}
	}

	function sendBoardOwnersResetLink() {
		if (team.email) {
			EmailService.sendBoardOwnersResetEmail(team.name, team.email).catch(
				console.error
			);
		}
		if (team.secondaryEmail) {
			EmailService.sendBoardOwnersResetEmail(
				team.name,
				team.secondaryEmail
			).catch(console.error);
		}
	}

	return (
		<div className="board-owners-form">
			<div className="label">Board Owners</div>
			<div className="team-email">{team.email}</div>
			<div className="team-email">{team.secondaryEmail}</div>
			<div className="label">Reset Password</div>
			<p className="description">
				Need to change the password? No problem, just click the button below and
				we'll send the board owners a link to reset the password.
			</p>
			<ButtonPrimary onClick={sendPasswordResetLink}>
				Send Reset Link
			</ButtonPrimary>
			<div className="label">Change Board Owners</div>
			<p className="description">
				Need to change the email addresses associated with this RetroQuest?
				Click the button below and we’ll email the current board owners a link
				to make the changes.
			</p>
			<ButtonPrimary onClick={sendBoardOwnersResetLink}>
				Send Update Email
			</ButtonPrimary>
		</div>
	);
}

export default BoardOwnersForm;
