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
import { useRecoilValue, useSetRecoilState } from 'recoil';
import EmailService from 'Services/Api/EmailService';
import { ModalContentsState } from 'State/ModalContentsState';
import { TeamState } from 'State/TeamState';

import EmailSentConfirmation from './EmailSentConfirmation/EmailSentConfirmation';

import './BoardOwnersForm.scss';

function BoardOwnersForm() {
	const team = useRecoilValue(TeamState);
	const setModalContents = useSetRecoilState(ModalContentsState);

	function getStartOfParagraph1() {
		let startOfParagraph = 'We’ve sent an email to ';
		if (team.email) startOfParagraph += team.email;
		if (team.secondaryEmail) startOfParagraph += ` and ${team.secondaryEmail}`;
		return startOfParagraph;
	}

	function openConfirmationModal(endOfParagraph: string) {
		setModalContents({
			title: 'Check your Mail!',
			component: (
				<EmailSentConfirmation
					paragraph1={getStartOfParagraph1() + endOfParagraph}
				/>
			),
		});
	}

	async function sendPasswordResetLink() {
		if (team.email) {
			await EmailService.sendPasswordResetEmail(team.name, team.email);
		}
		if (team.secondaryEmail) {
			await EmailService.sendPasswordResetEmail(team.name, team.secondaryEmail);
		}
		openConfirmationModal(' with password reset instructions.');
	}

	async function sendBoardOwnersResetLink() {
		if (team.email) {
			await EmailService.sendBoardOwnersResetEmail(team.name, team.email);
		}
		if (team.secondaryEmail) {
			await EmailService.sendBoardOwnersResetEmail(
				team.name,
				team.secondaryEmail
			);
		}
		openConfirmationModal(
			' with instructions on how to change the Board Owner email addresses.'
		);
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
				Send Password Reset Link
			</ButtonPrimary>
			<div className="label">Change Board Owners</div>
			<p className="description">
				Need to change the email addresses associated with this RetroQuest?
				Click the button below and we’ll email the current board owners a link
				to make the changes.
			</p>
			<ButtonPrimary onClick={sendBoardOwnersResetLink}>
				Send Board Owner Update Link
			</ButtonPrimary>
		</div>
	);
}

export default BoardOwnersForm;
