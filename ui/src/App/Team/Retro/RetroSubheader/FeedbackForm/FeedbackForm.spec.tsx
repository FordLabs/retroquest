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
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { RecoilRoot } from 'recoil';

import FeedbackService from '../../../../../Services/Api/FeedbackService';
import {
	ModalContents,
	ModalContentsState,
} from '../../../../../State/ModalContentsState';
import { TeamState } from '../../../../../State/TeamState';
import Team from '../../../../../Types/Team';
import { RecoilObserver } from '../../../../../Utils/RecoilObserver';

import FeedbackForm from './FeedbackForm';

jest.mock('../../../../../Services/Api/FeedbackService');

describe('Feedback Form', () => {
	const fakeComment = 'This is a fake comment';
	const fakeEmail = 'user@ford.com';
	const team: Team = {
		name: 'My Team',
		id: 'fake-team-id',
	};
	let modalContent: ModalContents | null;
	let container: string | Element;

	beforeEach(() => {
		jest.clearAllMocks();

		modalContent = null;

		({ container } = render(
			<RecoilRoot
				initializeState={({ set }) => {
					set(TeamState, team);
					set(ModalContentsState, {
						title: 'Feedback',
						component: <FeedbackForm />,
					});
				}}
			>
				<RecoilObserver
					recoilState={ModalContentsState}
					onChange={(value: ModalContents) => {
						modalContent = value;
					}}
				/>
				<FeedbackForm />
			</RecoilRoot>
		));
	});

	it('should render without axe errors', async () => {
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});

	it('should submit feedback', async () => {
		userEvent.click(screen.getByTestId('feedback-star-4-label'));
		userEvent.type(screen.getByLabelText('Feedback Email'), fakeEmail);
		userEvent.type(screen.getByLabelText('Comments*'), fakeComment);
		userEvent.click(screen.getByText('Send!'));

		await waitFor(() =>
			expect(FeedbackService.addFeedback).toHaveBeenCalledWith({
				teamId: team.id,
				stars: 4,
				comment: fakeComment,
				userEmail: fakeEmail,
			})
		);
	});

	it('should not submit with empty comments', () => {
		userEvent.click(screen.getByTestId('feedback-star-4-label'));
		userEvent.type(screen.getByLabelText('Feedback Email'), fakeEmail);
		userEvent.click(screen.getByText('Send!'));

		expect(FeedbackService.addFeedback).not.toHaveBeenCalled();
	});

	it('should cancel submitting feedback', () => {
		userEvent.click(screen.getByText('Cancel'));

		expect(modalContent).toBeNull();
		expect(FeedbackService.addFeedback).not.toHaveBeenCalled();
	});
});
