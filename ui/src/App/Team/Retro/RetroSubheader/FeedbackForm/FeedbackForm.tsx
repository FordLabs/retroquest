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
import { useRecoilValue, useSetRecoilState } from 'recoil';

import ModalContentsWrapper from '../../../../../Common/ModalContentsWrapper/ModalContentsWrapper';
import FeedbackService from '../../../../../Services/Api/FeedbackService';
import { ModalContentsState } from '../../../../../State/ModalContentsState';
import { TeamState } from '../../../../../State/TeamState';

import FeedbackStars from './FeedbackStars/FeedbackStars';

import './FeedbackForm.scss';

function FeedbackForm() {
	const setModalContents = useSetRecoilState(ModalContentsState);
	const team = useRecoilValue(TeamState);
	const [stars, setStars] = useState(0);
	const [comment, setComment] = useState<string>('');
	const [userEmail, setUserEmail] = useState<string>('');

	const closeModal = () => setModalContents(null);

	const handleSubmit = () => {
		if (comment) {
			const feedback = {
				teamId: team.id,
				stars,
				comment,
				userEmail,
			};
			FeedbackService.addFeedback(feedback)
				.then(() => closeModal())
				.catch(console.error);
		}
	};

	return (
		<ModalContentsWrapper
			testId="feedbackDialog"
			className="feedback-dialog"
			title="Feedback"
			subtitle="How can we improve RetroQuest?"
			buttons={{
				cancel: { text: 'Cancel', onClick: closeModal },
				confirm: { text: 'Send!', onClick: handleSubmit },
			}}
		>
			<FeedbackStars className="section" value={stars} onChange={setStars} />
			<div className="section comments-section">
				<label className="label" htmlFor="comments">
					Comments<span className="required-field">*</span>
				</label>
				<textarea
					className="comments-textarea"
					id="comments"
					value={comment}
					onChange={(event) => setComment(event.target.value)}
				/>
			</div>
			<div className="section feedback-email-section">
				<label className="label" htmlFor="email">
					Feedback Email
				</label>
				<input
					className="email-input"
					id="email"
					type="text"
					value={userEmail}
					onChange={(event) => setUserEmail(event.target.value)}
				/>
			</div>
		</ModalContentsWrapper>
	);
}

export default FeedbackForm;
